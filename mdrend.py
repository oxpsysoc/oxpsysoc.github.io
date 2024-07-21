import mistune as md
import re
from mistune import escape
from mistune.directives import (
    FencedDirective,
    Admonition,
    TableOfContents,
    Image,
    Figure,
)
from pygments import highlight
from pygments.lexers import get_lexer_by_name, _iter_lexerclasses
from pygments.formatters import HtmlFormatter
from pygments.modeline import get_filetype_from_buffer
from pygments.util import ClassNotFound

import asciirend as ar
import tomllib

heading_re = re.compile('<a href="#([^"]+)">.*</a>')


def guess_lexer(_text, conf_threshold=0.01, mime_mul=0.09, **options):
    """Guess a lexer by strong distinctions in the text (eg, shebang)."""

    # try to get a vim modeline first
    ft = get_filetype_from_buffer(_text)

    if ft is not None:
        try:
            return get_lexer_by_name(ft, **options)
        except ClassNotFound:
            pass

    best_lexer = [0.0, None]
    for lexer in _iter_lexerclasses():
        rv = lexer.analyse_text(_text)

        # MIME has an unusually high rv when providing it with any kind of text
        if "MIME" in str(lexer):
            rv *= mime_mul

        if rv == 1.0:
            return lexer(**options)
        if rv > best_lexer[0]:
            best_lexer[:] = (rv, lexer)
    if not best_lexer[0] or best_lexer[0] < conf_threshold or best_lexer[1] is None:
        raise ClassNotFound("no lexer matching the text found")
    return best_lexer[1](**options)


class CustomizedRenderer(md.HTMLRenderer):

    scene_props = {}
    scene_cnt = 0

    # def block_html(self, html):
    #    # Add custom logic here to handle or sanitize HTML
    #    return html

    def ascii_render(self, code):
        div_id = self.scene_cnt
        self.scene_cnt += 1
        d = code.split("{", 1)
        if len(d) == 1:
            scene = code
        else:
            props = tomllib.loads(d[0])
            scene = "{" + d[1]

        color = int(props["color"]) if "color" in props else 0
        w = int(props["w"]) if "w" in props else 72
        h = int(props["h"]) if "h" in props else 32
        aspect = float(w / (2 * h))

        # These parameters are not actually used in latest asciirend
        ortho = bool(props["ortho"]) if "ortho" in props else True
        fov = float(props["fov"]) if "fov" in props else 1.0
        znear = float(props["znear"]) if "znear" in props else 0.1
        zfar = float(props["zfar"]) if "zfar" in props else 100.0

        self.scene_props[div_id] = {
            "scene": scene.replace("\n", ""),
            "w": w,
            "h": h,
            "aspect": aspect,
            "ortho": ortho,
            "fov": fov,
            "znear": znear,
            "zfar": zfar,
            "dynamic_w": bool(props["dynamic_w"]) if "dynamic_w" in props else False,
            "dynamic_h": bool(props["dynamic_h"]) if "dynamic_h" in props else False,
            "show_usage": bool(props["show_usage"]) if "show_usage" in props else True,
            "disable_zoom": (
                bool(props["disable_zoom"]) if "disable_zoom" in props else False
            ),
        }

        rendered = ar.ascii_render(
            scene, color, w, h, aspect, ortho, fov, znear, zfar, 0.0
        )
        return f'<div class="asciirend" id="asciirend-{div_id}"><pre>{rendered}</pre></div>'

    def gh_users_render(self, code):
        output = ""

        for line in code.split("\n"):
            line = line.split(" ", 1)
            if len(line) < 2:
                continue
            username = line[0]
            avatar = line[1]

            output += f"""
            <a href="https://github.com/{ username }">
                <div style="flex-direction: row; box-sizing: border-box; display: flex; place-    content: center flex-start; align-items: center;">
                    <img class="profile-img" src="{ avatar }">
                    <div>{ username }</div>
                </div>
            </a>
            <br/>
            """

    def gallery_render(self, code):
        output = '<section style="display: flex; flex-wrap: wrap; justify-content: space-evenly;">\n'

        for line in code.split("\n"):
            line = line.split(" | ", 2)
            if len(line) < 3:
                continue
            img = line[0]
            width = line[1]
            text = line[2]

            output += f"""
            <div style="text-align: center; max-width: 100%">
              <div class="bordered">
                <img src="{img}" width="{width}"/>
                <p class="gallerytext" style="text-wrap: auto; width: {width}px; max-width: 100%;">{text}</p>
              </div>
            </div>
            """

        output += "</section>"

        return output

    def block_code(self, code, info=None):
        if info:
            if info == "asciirend":
                return self.ascii_render(code)
            elif info == "gh-users":
                return self.gh_users_render(code)
            elif info == "gallery":
                return self.gallery_render(code)
            lexer = get_lexer_by_name(info, stripall=True)
        else:
            try:
                lexer = guess_lexer(code)
            except ClassNotFound:
                lexer = get_lexer_by_name("html", stripall=True)

        formatter = HtmlFormatter()
        return highlight(code, lexer, formatter)

    def heading(self, text, level, **attrs):
        m = heading_re.match(text)
        if m is not None:
            return '<h%d><span class="headerlink" id="%s">   </span>%s</h%d>\n' % (
                level,
                m.group(1),
                text,
                level,
            )
        else:
            return super(CustomizedRenderer, self).heading(text, level, **attrs)


class ShortdownRenderer(md.HTMLRenderer):

    def heading(self, text, level):
        return "%s" % (text)

    def link(self, link, text, title):
        return "%s" % escape(text, quote=True)


def shortdown(value):
    max_len = 500
    lbtrim_len = 100
    mstr = (value[: (max_len - 3)].strip() + "...") if len(value) > max_len else value
    left = mstr[:lbtrim_len]
    right = mstr[lbtrim_len:]

    right_split = right.splitlines()

    trimmed = (left + right_split[0]) if len(right_split) > 0 else left

    renderer = ShortdownRenderer()
    md_rend = md.create_markdown(renderer=renderer, plugins=["strikethrough"])
    return md_rend(trimmed)


def markdown(value, backlink):
    print(backlink)
    renderer = CustomizedRenderer(escape=False)
    md_rend = md.create_markdown(
        escape=False,
        renderer=renderer,
        plugins=[
            "task_lists",
            "table",
            "footnotes",
            "strikethrough",
            FencedDirective(
                [
                    Admonition(),
                    TableOfContents(),
                    Image(),
                    Figure(),
                ]
            ),
        ],
    )
    rendered = md_rend(value)
    if renderer.scene_cnt > 0:
        javascript = f"""
<script type="module">
	import ascii_render from "{backlink}static/js/draw.js";
        """
        for i in range(renderer.scene_cnt):
            props = renderer.scene_props[i]
            javascript += f'const scene_{i} = \'{props["scene"].rstrip()}\';\n'
            javascript += f'ascii_render("asciirend-{i}", scene_{i}, {props["w"] if not props["dynamic_w"] else "null"}, {props["h"] if not props["dynamic_h"] else "null"}, {"true" if props["ortho"] else "false"}, {props["fov"]}, {props["znear"]}, {props["zfar"]}, {"true" if props["show_usage"] else "false"}, {"true" if props["disable_zoom"] else "false"});\n'
        javascript += """
</script>
        """
    else:
        javascript = ""
    return rendered + javascript

from jinja2 import Environment, FileSystemLoader
from mdrend import markdown
import os
import shutil
import glob
import sass

src_dir = "src"
out_dir = "output"


def linkup(a, b):
    if "://" in a:
        return a
    else:
        if b.endswith("/") and a.startswith("/"):
            b = b[:-1]
        return b + a


env = Environment(loader=FileSystemLoader("templates"))
env.filters["markdown"] = markdown
env.filters["linkup"] = linkup
template = env.get_template("main.html")

# Define custom variables passed over to the templates
template_vars = {
    "navbar": [
        ("/", "Home"),
        ("about/#welcome", "Welcome"),
        ("about/#manifesto", "Manifesto"),
        ("about/#things-we-do", "Things We Do"),
        ("about/#gallery", "Gallery"),
        ("about/#donate", "Donate"),
    ]
}

if os.path.isdir(out_dir):
    shutil.rmtree(out_dir)

os.mkdir(out_dir)

for f in glob.glob(os.path.join(src_dir, "**"), recursive=True):
    if not f.startswith(src_dir):
        raise "Glob returned unexpected path"

    offset = f[len(src_dir) :]
    if offset.startswith("/"):
        offset = offset[1:]
    of = os.path.join(out_dir, offset)

    if os.path.isdir(f):
        os.makedirs(of, exist_ok=True)
    else:
        pre, ext = os.path.splitext(of)

        with open(f, "rb") as file:
            content = file.read()

        if ext == ".md":
            # Render into a subpath/index.html, because that looks better
            if not pre.endswith("index"):
                pre += "/index"
            of = pre + ".html"
            os.makedirs(os.path.dirname(of), exist_ok=True)

            # Build a backlink to root
            offset2 = of[len(out_dir) :]
            if offset2.startswith("/"):
                offset2 = offset2[1:]
            backlink = ""
            for i in range(1, len(offset2.split("/"))):
                backlink += "../"

            template_vars["backlink"] = backlink

            content = str.encode(
                template.render(template_vars, content=content.decode("utf-8"))
            )
        elif ext == ".scss":
            of = pre + ".css"
            content = str.encode(sass.compile(string=content.decode("utf-8")))
        elif not offset.startswith("static/"):
            print("Skipping {f}")
            continue

        with open(of, "wb") as file:
            print(f"{f} => {of}")
            file.write(content)

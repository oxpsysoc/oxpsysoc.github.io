# OPS Homepage

This site is made out of a bunch of markdown files that then get rendered to HTML.

## Requirements

Python 3.11 is required.

## Usage

### Regular python installation

```
# Setup virtual environment (first time only)
python3 -m venv .venv

# Activate it
source .venv/bin/activate

# Install dependencies and run:
pip3 install -r requirements.txt
python3 main.py
```

### Using nix

```
nix-shell
python3 main.py
```

## Structure

- `main.py` - generation entrypoint
- `mdrend.py` - markdown renderer with custom directives (\`\`\`gallery, etc.)
- `src` - site structure
  - `static` - static files with no processing applied
  - `{name}.md` - markdown file that gets rendered to `{name}/index.html`
  - `{name}.scss` - SASS stylesheet that gets turned to `{name}.css`
  - `scss_inc` - Additional SASS files to allow splitting the stylesheet up better

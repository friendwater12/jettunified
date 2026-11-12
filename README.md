# JettUnified website

Static site for the JettUnified Paper plugin. Plain HTML, CSS and JS, no build step needed.

## Publish on GitHub Pages
1. Create a GitHub repository and upload everything in this folder (keep `index.html` at the top level).
2. Repository **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Your site will be at `https://<your-name>.github.io/<repo>/`.

## Pages
- `index.html` home
- `features.html` full feature list
- `wiki.html` docs, all commands and permissions
- `download.html` jar downloads (from GitHub Releases, tag v1.0)
- `changelog.html` release notes
- `about.html` about the plugin

## New release
Upload the new jars to a new GitHub Release, then update the version, sizes and SHA-256 in `download.html` and add an entry to `changelog.html`.

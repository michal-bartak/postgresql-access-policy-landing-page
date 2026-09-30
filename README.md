# Access Policy — landing page

A single page of clickable tiles (presentation + related apps), shown to the audience via a QR code at the end of the talk. Built with [Astro](https://astro.build), hosted on GitHub Pages.

## Editing the tiles

Everything is in **[`src/data/landing.yaml`](src/data/landing.yaml)**. Edit it, commit, push to `main` — GitHub Actions rebuilds and deploys in about a minute.

```yaml
title: Access Policy
subtitle: Thanks for listening!
footer: Optional footer text

tiles:
  - title: Presentation
    description: Slides from today's talk
    url: https://docs.google.com/presentation/d/...
    icon: lucide:presentation
    highlight: true          # optional — full-width accent tile
    disabled: true           # optional — shown but not clickable, labelled "Coming soon"
                             #            (or disabled: Available tomorrow)

  - title: Policy Editor
    description: Author and review access policies
    url: https://example.com/editor
    image: ./icons/editor.png # file in src/data/icons/
```

Each tile needs `title`, `description`, `url` and **exactly one** of `icon` / `image` (below).

`url` is either a full web address, or a file you put in `src/data/` written relative to `landing.yaml` — e.g. `url: ./postgres_access_policy.pdf`. Such files are published with the site; a wrong file name fails the build.

Icon options:

| Field   | Value                                                                 |
|---------|-----------------------------------------------------------------------|
| `icon`  | An Iconify name — browse [icones.js.org](https://icones.js.org). Installed sets: `lucide:*`, `simple-icons:*` (brand logos). |
| `image` | Your own icon (PNG, JPG, WebP or SVG) placed in `src/data/icons/`, written relative to `landing.yaml`: `./icons/my-app.png`. It is resized and converted to WebP at build time, so large source files are fine. Square images look best. |

Tiles appear in the order listed. To split them into groups, put a divider item between tiles:

```yaml
  - section: Affiliated apps
```

It renders as a thin line with a small label across the full width. A typo or missing field fails the build with a message pointing at the tile (e.g. `tiles.1.url: Required`), so a broken config never gets deployed.

> **Presentation link:** in Google Slides use *Share → General access → Anyone with the link* (or *File → Share → Publish to web*), otherwise the audience hits a sign-in wall.

## Running locally

Requires Node 22.12+ and `make`.

```bash
make dev       # live-reload dev server at http://localhost:4321 — edit landing.yaml and watch it update
make build     # static site in dist/
make preview   # build + serve under /<repo>/ exactly as GitHub Pages will
make stop      # stop a preview server left running in the background
make clean     # remove dist/ and caches
```

Dependencies are installed automatically on first run (`make install` to do it explicitly). Override the port or path with e.g. `make preview PORT=8080 BASE_PATH=/other-name`.

## Deploying (one-time setup)

1. Push this repo to GitHub.
2. *Settings → Pages → Build and deployment → Source:* **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the *Actions* tab).

The site URL and base path (`https://<org>.github.io/<repo>/`) are taken from the repository's Pages settings automatically — nothing to configure when the repo is renamed or a custom domain is added. Generate the QR code for your slides from the URL shown in *Settings → Pages*.

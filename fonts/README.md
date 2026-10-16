# Self-hosted fonts

| File | What | Size |
| --- | --- | --- |
| `inter-latin-var.woff2` | Inter 4.001, variable `wght` axis 100-900, **latin subset only** | 48,256 bytes |
| `OFL.txt` | SIL Open Font License 1.1 and copyright notice for Inter | |

**Source:** Google Fonts' own build of Inter (`font-family: Inter`, the `/* latin */` face from
`https://fonts.googleapis.com/css2?family=Inter:wght@100..900`, served from `fonts.gstatic.com/s/inter/v20/`).
Upstream project: <https://github.com/rsms/inter>. SHA-256 of the file:
`3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62`.

**Licence:** Copyright (c) 2016 The Inter Project Authors. Licensed under the SIL Open Font License 1.1
(`OFL.txt`), which permits bundling and redistribution with this site provided the notice stays with the font.

**Why only latin and a variable file:** the site uses weights 400, 500, 700 and 900 (Tailwind `font-medium`,
`font-bold`, `font-black`) and no italic face (`italic` is synthesised, as before). Every non-ASCII character in the
site's markup (em dash, curly quotes) is in the latin range, so latin-ext/cyrillic/greek are not shipped.
One variable file covers all four weights and is smaller than four static files.

`@font-face` lives in `../css/app.src.css`; the preload is in `../index.html`.
The React apps under `apps/web/` load their own fonts and do not use these.

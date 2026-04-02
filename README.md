# skiffle

A sound board where all sounds used in PhET sims can be tried out.

## Prerequisites

Skiffle scans sound files from a **totality** monorepo checkout. It does **not** live inside the monorepo — it is an
external tool cloned as a sibling of totality.

Expected directory layout:
```
parent/
  totality/       # the PhET monorepo
  skiffle/        # this repo (sibling, not inside totality)
```

If your layout differs, set the `TOTALITY_PATH` environment variable to point to your totality checkout.

## Building

To regenerate the soundboard HTML:

    npm run build

To override the default totality location:

    TOTALITY_PATH=/path/to/totality npm run build

This scans all repos in totality for `sounds/` directories and generates `html/sound-board.html`.

## Usage

The generated `sound-board.html` references sound files via relative paths into the totality checkout.
It must be served over HTTP (not opened as a `file://` URL) because the Web Audio API uses `fetch()` to load sounds.

For example, serve from the common parent directory of skiffle and totality:

    cd parent/ && npx http-server -p 8080

Then open `http://localhost:8080/skiffle/html/sound-board.html`.

Alternatively, if totality's chipper dev-server is running, any HTTP server that can reach both skiffle and totality
from the same origin will work.

## Automation

This project is automatically rebuilt every night via `daily-grunt-work.sh` in the totality monorepo. The generated
HTML is committed and pushed to GitHub.

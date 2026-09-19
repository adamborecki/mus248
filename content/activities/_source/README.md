# Imported instruction sources

Verbatim plain-text copies of activity instructions that still live in an external doc.
They exist so every activity's instructions are readable from this repo, even before the
activity has been rewritten into the template format used by the `.md` files one level up.

These are **source material, not student-facing**. The site never renders this folder; it
still links to the external doc until the activity is migrated. Once an activity has a
real `<id>.md`, its source file here is just provenance.

## Importing

```bash
tools/import-activity-doc.sh x32compact https://docs.google.com/document/d/DOC_ID/edit
```

Works for any Google Doc shared as "anyone with the link can view." Re-run it to refresh
a file after editing the doc.

## Status

| Activity | Source here | Migrated to `.md` |
| --- | --- | --- |
| Stereo Recording | — | ✅ `stereo.md` |
| Portable Cameras | — | ✅ `cameras.md` |
| Live Looping Rig | — | ✅ `live-looping.md` |
| Dante (×4) | — | ✅ `dante-*.md` |
| DAW Training Circuit | ✅ `daw.txt` | not yet |
| What can you do with a mixer? | ✅ `mixer.txt` | not yet |
| X32 Compact | ✅ `x32compact.txt` | not yet |
| Mic Stand Yoga | ✅ `mic-stands.txt` (slide text) | not yet |

## Mic Stand Yoga needs image work

Its text is here, but the activity is carried by pictures: 22 slides holding 37 photos and
2 demo videos. The deck itself is `_media/mic-stands.pptx` — gitignored, because at 125 MB
it doesn't belong in git. Before that activity can be migrated:

- **Photos** — 59.5 MB as exported (several single PNGs are 3–5 MB). Downscaled to sensible
  web JPEGs they should land near 5–8 MB total, which is fine to commit.
- **Videos** — 65.4 MB across two clips showing the "hold the thing, twist the shaft" trick.
  These want a host outside git.

Extract with any unzip tool: the media lives under `ppt/media/` inside the .pptx.

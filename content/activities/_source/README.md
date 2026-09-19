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
| Mic Stand Yoga | ❌ SharePoint returns 403 | not yet |

Mic Stand Yoga is a slide deck on SharePoint and is heavily image-based. Its text still
needs exporting by hand; the images will need separate handling when it's migrated.

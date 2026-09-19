#!/usr/bin/env bash
# Import an activity's instructions from a link-shared Google Doc as plain text.
#
#   tools/import-activity-doc.sh x32compact https://docs.google.com/document/d/ID/edit
#   tools/import-activity-doc.sh x32compact ID
#
# Writes content/activities/_source/<id>.txt — the verbatim source, kept as the
# reference copy until the activity is rewritten into the template format.
# Fails if the doc isn't shared as "anyone with the link can view."
set -euo pipefail

id="${1:?activity id, e.g. x32compact}"
src="${2:?Google Doc URL or document id}"

doc="$src"
[[ "$src" == http* ]] && doc="$(sed -E 's#.*/document/d/([^/]+).*#\1#' <<<"$src")"

root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/content/activities/_source/$id.txt"
mkdir -p "$(dirname "$out")"

if ! curl -fsSL "https://docs.google.com/document/d/$doc/export?format=txt" -o "$out"; then
  echo "Couldn't export that doc. Check the id, and that link sharing is on." >&2
  exit 1
fi

printf 'Imported %s (%s bytes) -> content/activities/_source/%s.txt\n' "$id" "$(wc -c <"$out" | tr -d ' ')" "$id"

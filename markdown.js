// Shared Markdown rendering for the activity pages and the worksheet generator.
// One parser, so a worksheet can never drift from the page it was generated from.

export const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character]));

export const inline = (value) => escapeHtml(value)
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // Single-asterisk emphasis, after bold has consumed its pairs. Without this a
  // source file's *emphasis* reached the page with the asterisks still in it.
  .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

// Answer-key markers. Correct answers live in the activity Markdown so the key
// generates from the same file, and both student renders strip them out:
//   - ✅ c) 9 dB            marks the correct multiple-choice option
//   ✅ **Answer.** 17 cm    gives the answer to a question with no option list
export const OPTION = /^[-*]\s+(✅\s*)?([a-zA-Z])[).]\s+(.+)$/;
export const ANSWER_LINE = /^✅\s*\*\*Answers?[.:]?\*\*\s*(.*)$/i;

export const isAnswerLine = (line) => ANSWER_LINE.test(line.trim());
export const stripAnswerMark = (line) => line.replace(OPTION, (match, mark) => (mark ? match.replace(mark, '') : match));

export const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\s*/;

// A hard-wrapped paragraph is still one paragraph, and a wrapped bullet is still
// one bullet. Without this, a source file that wraps at 100 characters renders as
// a stack of one-line paragraphs — and the worksheet generator reads a checkpoint
// as just its first line.
const STARTS_BLOCK = /^(\s*([-*+]|\d+\.)\s|#{1,6}\s|>|\||```|\s*$)/;
const OPAQUE = /^(\||```|#{1,6}\s)/;

export function joinWrappedLines(markdown) {
  const joined = [];
  markdown.split('\n').forEach((line) => {
    const previous = joined[joined.length - 1];
    const append = (text) => { joined[joined.length - 1] = `${previous.replace(/\s+$/, '')} ${text}`; };
    const carries = previous !== undefined && Boolean(previous.trim()) && !OPAQUE.test(previous.trim());
    if (!line.trim()) { joined.push(line); return; }
    if (line.trimStart().startsWith('>')) {
      if (carries && previous.trimStart().startsWith('>')) append(line.trim().replace(/^>\s?/, ''));
      else joined.push(line);
      return;
    }
    if (!STARTS_BLOCK.test(line) && carries) { append(line.trim()); return; }
    joined.push(line);
  });
  return joined.join('\n');
}

export function renderMarkdown(markdown) {
  const lines = joinWrappedLines(markdown.replace(FRONTMATTER, '')).split('\n');
  const output = [];
  let list = null;
  const closeList = () => { if (list) { output.push(`</${list}>`); list = null; } };
  const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
  const isDivider = (line) => line.includes('|') && /^\|?[\s:|-]*-[\s:|-]*\|?$/.test(line.trim());
  const row = (values, tag) => `<tr>${values.map((value) => `<${tag}>${inline(value)}</${tag}>`).join('')}</tr>`;

  for (let index = 0; index < lines.length; index += 1) {
    const line = stripAnswerMark(lines[index]);
    if (isAnswerLine(line)) continue;
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    const bullet = line.match(/^[-*]\s+(.+)$/);
    const numbered = line.match(/^\d+\.\s+(.+)$/);
    const quote = line.match(/^>\s?(.+)$/);

    if (line.trim().startsWith('|') && isDivider(lines[index + 1] || '')) {
      closeList();
      const head = cells(line);
      const body = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith('|')) { body.push(cells(lines[index])); index += 1; }
      index -= 1;
      output.push(`<div class="table-scroll"><table><thead>${row(head, 'th')}</thead><tbody>${body.map((values) => row(values, 'td')).join('')}</tbody></table></div>`);
    }
    else if (heading) { closeList(); output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); }
    else if (bullet) {
      if (list !== 'ul') { closeList(); list = 'ul'; output.push('<ul>'); }
      const task = bullet[1].match(/^\[([ xX])\]\s+(.+)$/);
      output.push(task
        ? `<li class="task"><span aria-hidden="true">${task[1] === ' ' ? '☐' : '☑'}</span> ${inline(task[2])}</li>`
        : `<li>${inline(bullet[1])}</li>`);
    }
    else if (numbered) { if (list !== 'ol') { closeList(); list = 'ol'; output.push('<ol>'); } output.push(`<li>${inline(numbered[1])}</li>`); }
    else if (quote) { closeList(); output.push(`<aside>${inline(quote[1])}</aside>`); }
    else if (!line.trim()) { closeList(); }
    else { closeList(); output.push(`<p>${inline(line)}</p>`); }
  }
  closeList();
  return output.join('');
}

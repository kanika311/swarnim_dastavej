/**
 * Utility functions for sanitizing, stripping HTML tags,
 * creating clean excerpts, and extracting key takeaway bullet points.
 */

/**
 * Strips all HTML tags and decodes common HTML entities, returning clean plain text.
 */
export function stripHtml(input?: string | null): string {
  if (!input) return '';
  let text = String(input);

  // Replace block tags with space so words don't merge
  text = text.replace(/<\/(p|div|h[1-6]|li|blockquote|tr|table|ul|ol)>/gi, ' ');
  text = text.replace(/<br\s*[\/]?>/gi, ' ');
  text = text.replace(/<(hr|img|video)[\s\S]*?[\/]?>/gi, ' ');

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Strip any incomplete unclosed opening tag at the end (e.g. from truncation: "<span style=...")
  text = text.replace(/<[a-zA-Z][^>]*$/g, '');

  // Decode common HTML entities
  text = text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—');

  // Collapse multiple spaces/tabs/newlines into a single clean space
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Cleans HTML and returns a truncated plain text excerpt of specified max length.
 */
export function cleanExcerpt(text?: string | null, maxLength: number = 150): string {
  if (!text) return '';
  const plain = stripHtml(text);
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + '...';
}

/**
 * Cleans messy pasted HTML from Google Gemini, ChatGPT, Word, or external websites.
 * Removes tracking attributes (e.g. data-path-to-node, data-index-in-node),
 * unwanted classes, inline fonts, lab() colors, and cleans empty spans.
 */
export function sanitizeArticleHtml(html?: string | null): string {
  if (!html) return '';
  let clean = String(html);

  // 1. Remove dangerous tags
  clean = clean.replace(/<(script|style|iframe|object|embed|meta|link)[\s\S]*?<\/\1>/gi, '');
  clean = clean.replace(/<(meta|link)[\s\S]*?>/gi, '');

  // 2. Remove all data-* attributes (e.g. data-path-to-node="1", data-index-in-node="18", etc.)
  clean = clean.replace(/\s+data-[a-zA-Z0-9_\-]+="[^"]*"/gi, '');
  clean = clean.replace(/\s+data-[a-zA-Z0-9_\-]+='[^']*'/gi, '');
  clean = clean.replace(/\s+data-[a-zA-Z0-9_\-]+=[^\s>]+/gi, '');

  // 3. Remove external classes and IDs
  clean = clean.replace(/\s+(class|id)="[^"]*"/gi, '');
  clean = clean.replace(/\s+(class|id)='[^']*'/gi, '');

  // 4. Remove messy external inline styles (especially font-family, lab() colors, Google CSS)
  clean = clean.replace(/\s+style="[^"]*"/gi, '');
  clean = clean.replace(/\s+style='[^']*'/gi, '');

  // 5. Unwrap useless <span> wrappers left behind from rich copy-pasting
  for (let i = 0; i < 4; i++) {
    clean = clean.replace(/<span\b[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  }

  // 6. Remove completely empty tags like <p></p>, <span></span>, <b></b>
  clean = clean.replace(/<(span|p|b|i|strong|em|h[1-6])\s*><\/\1>/gi, '');

  return clean.trim();
}

/**
 * Extracts clean bullet points/takeaways from article body or excerpt.
 * Ideal for lead story bullet highlights (like the Dainik lead card).
 */
export function extractTakeaways(body?: string | null, excerpt?: string | null, maxItems: number = 4): string[] {
  const content = body || excerpt || '';
  if (!content) return [];

  // 1. Check for <li> elements in the HTML
  const liMatches = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  if (liMatches && liMatches.length > 0) {
    const listItems = liMatches
      .map((li) => stripHtml(li))
      .map((t) => t.replace(/^[\s•●\-–\d\.]+/, '').trim())
      .filter((t) => t.length > 5);
    if (listItems.length > 0) {
      return listItems.slice(0, maxItems);
    }
  }

  // 2. Check for multiple <p> elements
  const pMatches = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (pMatches && pMatches.length > 1) {
    const pItems = pMatches
      .map((p) => stripHtml(p))
      .filter((t) => t.length > 15 && !t.endsWith(':'));
    if (pItems.length > 0) {
      return pItems.slice(0, maxItems);
    }
  }

  // 3. Fallback: split by newlines for markdown or raw plain text
  const lines = content
    .split(/\r?\n+/)
    .map((l) => stripHtml(l))
    .map((l) => l.replace(/^[\s•●\-–\d\.]+/, '').trim())
    .filter((l) => l.length > 15 && !l.endsWith(':'));

  if (lines.length > 0) {
    return lines.slice(0, maxItems);
  }

  // 4. Last fallback: return the clean excerpt if available
  const single = cleanExcerpt(excerpt || body, 140);
  return single ? [single] : [];
}

'use client';

import React from 'react';

interface RichArticleBodyProps {
  content: string;
  className?: string;
  fontClass?: string;
}

/**
 * Converts legacy markdown (e.g. **bold**, ## heading, • bullet, [size=xl])
 * or mixed markdown + HTML to clean, safe, valid HTML for both the visual editor
 * and the public article detail page.
 */
export function markdownToHtml(str: string): string {
  if (!str) return '';

  let html = str;

  // 1. Convert markdown asterisks to strong / em (handles 2, 3, 4+ asterisks cleanly)
  html = html.replace(/\*{2,}([^*\n]+?)\*{2,}/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');

  // 2. Convert custom size tags if any exist: [size=xl]...[/size]
  html = html.replace(/\[size=xl\]([\s\S]*?)\[\/size\]/gi, '<span style="font-size: 1.5rem; font-weight: 800; display: inline-block;">$1</span>');
  html = html.replace(/\[size=lg\]([\s\S]*?)\[\/size\]/gi, '<span style="font-size: 1.25rem; font-weight: 700; display: inline-block;">$1</span>');
  html = html.replace(/\[size=sm\]([\s\S]*?)\[\/size\]/gi, '<span style="font-size: 0.875rem;">$1</span>');

  // 3. Convert underline and highlight
  html = html.replace(/==(.+?)==/g, '<mark>$1</mark>');

  // If already full of HTML block tags (<p>, <div>, <h2>, <ul>, etc.), return normalized
  if (/<(p|div|h[1-6]|ul|ol|li|blockquote|hr)[\s>]/i.test(html)) {
    return html;
  }

  // Otherwise, convert lines into block elements (<p>, <h2>, <h3>, <ul>, <ol>, <blockquote>)
  const lines = html.split(/\r?\n/);
  const out: string[] = [];
  let inUl = false;
  let inOl = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      continue;
    }

    if (trimmed.startsWith('# ')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<h1>${trimmed.slice(2)}</h1>`);
    } else if (trimmed.startsWith('## ')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<h2>${trimmed.slice(3)}</h2>`);
    } else if (trimmed.startsWith('### ')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<h3>${trimmed.slice(4)}</h3>`);
    } else if (trimmed.startsWith('> ')) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<blockquote>${trimmed.slice(2)}</blockquote>`);
    } else if (/^(\-{3,}|\*{3,})$/.test(trimmed)) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push('<hr />');
    } else if (/^[•\-\*]\s+/.test(trimmed)) {
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push(`<li>${trimmed.replace(/^[•\-\*]\s+/, '')}</li>`);
    } else if (/^\d+\.\s+/.test(trimmed)) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol>'); inOl = true; }
      out.push(`<li>${trimmed.replace(/^\d+\.\s+/, '')}</li>`);
    } else {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<p>${trimmed}</p>`);
    }
  }

  if (inUl) out.push('</ul>');
  if (inOl) out.push('</ol>');

  return out.join('');
}

export default function RichArticleBody({
  content,
  className = '',
  fontClass = 'text-base leading-relaxed',
}: RichArticleBodyProps) {
  if (!content) return null;

  const html = markdownToHtml(content);

  return (
    <div
      className={`rich-article-content ${fontClass} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

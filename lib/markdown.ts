import { Marked, type Tokens } from "marked";
import type { TocEntry } from "@/types/content";

export interface RenderedMarkdown {
  html: string;
  toc: TocEntry[];
  plainText: string;
  wordCount: number;
}

const CALLOUT_LABELS: Record<string, string> = {
  NOTE: "Note",
  TIP: "Good to know",
  IMPORTANT: "Important",
  CONTEXT: "Historical context",
};

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Renders editorial Markdown into HTML suitable for the `Prose` component.
 * - adds stable ids to H2/H3 and returns a table of contents
 * - wraps tables so they scroll horizontally on small screens
 * - turns `> [!NOTE] Title` blockquotes into callout boxes
 * - marks external links with rel="noopener noreferrer"
 */
export function renderMarkdown(markdown: string): RenderedMarkdown {
  const toc: TocEntry[] = [];
  const usedIds = new Map<string, number>();

  const marked = new Marked({
    gfm: true,
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        const level = Math.min(Math.max(token.depth, 2), 4);
        if (level === 2 || level === 3) {
          const base = slugifyHeading(stripHtml(inner)) || "section";
          const seen = usedIds.get(base) ?? 0;
          usedIds.set(base, seen + 1);
          const id = seen ? `${base}-${seen + 1}` : base;
          toc.push({ id, text: stripHtml(inner), level: level as 2 | 3 });
          return `<h${level} id="${id}">${inner}</h${level}>\n`;
        }
        return `<h${level}>${inner}</h${level}>\n`;
      },
      link(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const href = escapeAttr(token.href);
        const title = token.title ? ` title="${escapeAttr(token.title)}"` : "";
        const external = /^https?:\/\//.test(token.href);
        const rel = external ? ` rel="noopener noreferrer" target="_blank"` : "";
        const srHint = external ? `<span class="sr-only"> (opens in a new tab)</span>` : "";
        return `<a href="${href}"${title}${rel}>${text}${srHint}</a>`;
      },
      table(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Table) {
        const head = token.header
          .map((cell) => `<th scope="col">${this.parser.parseInline(cell.tokens)}</th>`)
          .join("");
        const body = token.rows
          .map(
            (row) =>
              `<tr>${row
                .map((cell, i) =>
                  i === 0
                    ? `<th scope="row">${this.parser.parseInline(cell.tokens)}</th>`
                    : `<td>${this.parser.parseInline(cell.tokens)}</td>`,
                )
                .join("")}</tr>`,
          )
          .join("");
        return `<div class="table-wrap" role="region" aria-label="Table" tabindex="0"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>\n`;
      },
      blockquote(this: { parser: { parse: (t: Tokens.Generic[]) => string } }, token: Tokens.Blockquote) {
        const inner = this.parser.parse(token.tokens);
        const match = inner.match(/^<p>\[!(NOTE|TIP|IMPORTANT|CONTEXT)\]\s*([^\n<]*)(?:\n|<br>)?/);
        if (match) {
          const kind = match[1];
          const title = match[2].trim() || CALLOUT_LABELS[kind];
          const rest = inner.slice(match[0].length).replace(/^\s*<\/p>/, "");
          const body = rest.startsWith("<") ? rest : `<p>${rest}`;
          return `<aside class="callout callout-${kind.toLowerCase()}"><p class="callout-title">${title}</p>${body}</aside>\n`;
        }
        return `<blockquote>${inner}</blockquote>\n`;
      },
    },
  });

  const html = marked.parse(markdown, { async: false }) as string;
  const plainText = stripHtml(html);
  return { html, toc, plainText, wordCount: countWords(plainText) };
}

export function readingTimeFromWords(words: number): number {
  return Math.max(1, Math.round(words / 225));
}

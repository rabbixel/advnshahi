/**
 * Renders trusted, pre-rendered article HTML (from local Markdown or the CMS)
 * with the editorial typography defined in globals.css.
 */
export function Prose({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

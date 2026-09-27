"use client";

import { useState } from "react";
import { LinkIcon } from "@/components/ui/Icons";

export function CopyLinkButton({ url, className = "" }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button type="button" onClick={copy} className={className} aria-label="Copy link to this article">
      <LinkIcon />
      <span aria-live="polite" className="text-[0.8rem] font-medium">
        {copied ? "Copied" : "Copy link"}
      </span>
    </button>
  );
}

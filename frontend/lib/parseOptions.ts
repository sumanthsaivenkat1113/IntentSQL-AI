// lib/parseOptions.ts

export type ParsedClarification = {
  question: string;
  options: string[];
  fallback: boolean; // true = no options could be extracted → show textarea
};

export function parseClarification(raw: string): ParsedClarification {
  const text = (raw || "").trim();
  if (!text) return { question: "", options: [], fallback: true };

  // ---- Strategy 1: multi-line bullet / numbered list ----
  {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const optionLines: string[] = [];
    const questionLines: string[] = [];
    const listRe = /^(?:[-*•●○◦]|\d+[.)]|[a-z][.)])\s+(.+)$/i;

    for (const line of lines) {
      const m = line.match(listRe);
      if (m) {
        optionLines.push(m[1].trim().replace(/[.;]$/, ""));
      } else if (optionLines.length === 0) {
        questionLines.push(line);
      }
    }

    if (optionLines.length >= 2 && optionLines.length <= 8) {
      return {
        question: questionLines.join(" ").trim() || text,
        options: optionLines,
        fallback: false,
      };
    }
  }

  // ---- Strategy 2: inline "(a) X (b) Y (c) Z" ----
  {
    const re = /\(([a-z])\)\s*([^()]*?)(?=\s*\([a-z]\)|$)/gi;
    const found: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const opt = m[2]
        .trim()
        .replace(/^[,;:\-–—]\s*/, "")
        .replace(/[,;:\-–—.]\s*$/, "")
        .trim();
      if (opt) found.push(opt);
    }
    if (found.length >= 2 && found.length <= 8) {
      const idx = text.search(/\([a-z]\)/i);
      const question = idx > 0 ? text.slice(0, idx).trim() : text;
      return { question, options: found, fallback: false };
    }
  }

  // ---- Strategy 3: inline "a) X b) Y c) Z" ----
  {
    const re = /(?:^|\s)([a-z])\)\s*([^)]*?)(?=\s+[a-z]\)|$)/gi;
    const found: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const opt = m[2].trim().replace(/[,;:\-–—.]\s*$/, "").trim();
      if (opt) found.push(opt);
    }
    if (found.length >= 2 && found.length <= 8) {
      const idx = text.search(/(?:^|\s)[a-z]\)\s/i);
      const question = idx > 0 ? text.slice(0, idx).trim() : text;
      return { question, options: found, fallback: false };
    }
  }

  // ---- Strategy 4: trailing "Options: X, Y, Z" ----
  {
    const m = text.match(/(?:options?|choices?)\s*[:\-–—]\s*(.+)$/i);
    if (m && m.index !== undefined) {
      const parts = m[1]
        .split(/\s*[,;]\s*|\s+or\s+/i)
        .map((s) => s.trim().replace(/[.;]$/, ""))
        .filter(Boolean);
      if (parts.length >= 2 && parts.length <= 8) {
        const question = text.slice(0, m.index).trim() || text;
        return { question, options: parts, fallback: false };
      }
    }
  }

  // ---- Fallback: no structured options ----
  return { question: text, options: [], fallback: true };
}
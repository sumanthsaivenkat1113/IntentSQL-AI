const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  isAmbiguous: (user_prompt: string) =>
    post<{ success: boolean; is_ambiguous: boolean }>("/is-ambiguous", { user_prompt }),

  clarify: (user_prompt: string) =>
    post<{ success: boolean; Clarification: string }>("/clarify", { user_prompt }),

  generateSql: (user_prompt: string) =>
    post<{ success: boolean; SQL_Query: string }>("/generate-sql", { user_prompt }),

  answer: (user_prompt: string, SQL_Query: string) =>
    post<{ success: boolean; report: string }>("/answer", { user_prompt, SQL_Query }),
};
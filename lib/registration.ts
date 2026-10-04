export function generateId(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `SDLC-${y}${m}${day}-${seq}`;
}

export function normalizeGoals(goals: string[]): string {
  if (!goals || goals.length === 0) return "";
  return goals.join("; ");
}

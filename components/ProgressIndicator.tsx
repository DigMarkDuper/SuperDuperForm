export default function ProgressIndicator({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Kenalan" },
    { n: 2, label: "Perjalanan" },
    { n: 3, label: "Program" },
  ];
  return (
    <div className="flex items-center gap-2 w-full mb-6" aria-label="Progress">
      {steps.map((s, i) => {
        const active = step === s.n;
        const done = step > s.n;
        return (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold font-display shrink-0 transition ${
              active ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" :
              done ? "bg-brand-yellow text-brand-dark" : "bg-white/60 text-brand-slate border border-brand-blue-soft"
            }`} aria-current={active ? "step" : undefined}>
              {done ? "✓" : s.n}
            </div>
            <span className={`hidden sm:inline text-xs font-medium font-display ${active ? "text-brand-ink" : done ? "text-brand-slate" : "text-brand-slate/60"}`}>{s.label}</span>
            {i < steps.length - 1 && (
              <div className={`hidden sm:block flex-1 h-0.5 rounded-full ${done ? "bg-brand-yellow" : "bg-brand-blue-soft"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

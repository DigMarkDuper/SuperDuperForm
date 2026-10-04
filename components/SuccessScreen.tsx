export default function SuccessScreen({ name, id }: { name: string; id: string }) {
  return (
    <div className="text-center py-12 px-6" role="status" aria-live="polite">
      <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-brand-yellow-soft flex items-center justify-center shadow-inner shadow-brand-yellow/20">
        <span className="text-4xl" aria-hidden="true">🎉</span>
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark mb-2">Registration Received!</h2>
      <p className="text-brand-slate mb-1">Terima kasih, <strong className="text-brand-blue">{name || "Calon Peserta"}</strong>!</p>
      <p className="text-brand-slate/90 mb-6 text-sm sm:text-base max-w-md mx-auto">Pendaftaran Super Duper Language Center Anda berhasil dikirim. Tim kami akan menghubungi Anda melalui WhatsApp dengan langkah selanjutnya.</p>
      <div className="inline-flex items-center gap-3 bg-brand-blue-deep text-white rounded-2xl px-6 py-3 mb-6 shadow-xl shadow-brand-blue-deep/20">
        <span className="text-xs uppercase tracking-widest text-brand-yellow font-bold">ID Pendaftaran</span>
        <span className="font-display font-bold text-lg tracking-wide">{id}</span>
      </div>
      <a href="/" className="inline-block rounded-full bg-brand-blue text-white px-8 py-3 font-display font-semibold shadow-lg shadow-brand-blue/25 hover:bg-brand-blue-deep transition">Kembali ke Super Duper</a>
    </div>
  );
}

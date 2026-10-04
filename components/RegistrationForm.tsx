'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import ProgressIndicator from './ProgressIndicator';
import SuccessScreen from './SuccessScreen';
import { GOALS, STATUSES, PROGRAMS, SOURCES, LEVELS, validate } from '@/lib/validation';

const YEARS = Array.from({ length: 25 }, (_, i) => String(2000 + i));
export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    fullName: '', nickname: '', whatsapp: '', email: '', birthYear: '', domicile: '',
    status: '', statusOther: '', learningGoals: [] as string[], learningGoalsOther: '',
    englishLevel: '', program: '', source: '', sourceOther: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [regId, setRegId] = useState('');
  const [serverError, setServerError] = useState('');
  const submitRef = useRef(false);

  const update = useCallback((k: string, v: unknown) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => { const n = { ...prev }; delete n[k]; return n; });
  }, []);

  const goNext = useCallback(() => {
    const v = validate(values, step);
    if (!v.ok) { setErrors(v.errors); return; }
    setErrors({});
    if (step < 3) setStep(step + 1);
  }, [values, step]);

  const goBack = useCallback(() => { if (step > 1) setStep(step - 1); }, [step]);

  const toggleGoal = useCallback((g: string) => {
    setValues((prev) => {
      const curr = prev.learningGoals;
      let next = curr.includes(g) ? curr.filter((x) => x !== g) : [...curr, g];
      if (next.length > 2) next = curr;
      return { ...prev, learningGoals: next };
    });
    setErrors((prev) => { const n = { ...prev }; delete n.learningGoals; delete n.learningGoalsOther; return n; });
  }, []);

  const handleSubmit = useCallback(async () => {
    const v = validate(values, 3);
    if (!v.ok) { setErrors(v.errors); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (submitRef.current) return;
    submitRef.current = true;
    setStatus('loading');
    setServerError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success && data.registrationId) {
        setRegId(data.registrationId);
        setStatus('success');
      } else {
        setServerError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (e) {
      setServerError("Something went wrong. Please check your connection and try again.");
      setStatus('error');
    } finally {
      submitRef.current = false;
      setStatus((s) => s === 'loading' ? 'error' : s);
    }
  }, [values]);

  useEffect(() => {
    const el = document.getElementById('registration-card');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  if (status === 'success') return <SuccessScreen name={values.fullName.split(' ')[0]} id={regId} />;

  return (
    <section id="registration-card" className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-brand-dark/5 border border-white/40 overflow-hidden" aria-label="Registration Form">
      <div className="relative bg-gradient-to-br from-brand-blue-deep via-brand-blue to-brand-blue-deep px-6 sm:px-8 pt-10 pb-14 text-white">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%"><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#FFF"/></pattern><rect width="100%" height="100%" fill="url(#dots)"/></svg>
        </div>
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <img src="/assets/logo.png" alt="Super Duper Language Center" className="h-10 w-auto drop-shadow-md" />
          <span className="font-display text-sm font-bold tracking-tight text-brand-yellow">SUPER DUPER</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-2">Start Your English Journey</h1>
        <p className="text-white/90 text-sm sm:text-base max-w-md">Belajar English. Build Confidence. Build Your Future.</p>
      </div>

      <div className="px-6 sm:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-brand-dark/5 border border-brand-blue-soft/40 p-6 sm:p-8">
          <ProgressIndicator step={step} />
          {status === 'error' && serverError && (
            <div className="mb-4 rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3 border border-red-100" role="alert">{serverError}</div>
          )}
          {status === 'loading' && (
            <div className="mb-4 rounded-xl bg-brand-blue-soft text-brand-blue-deep text-sm px-4 py-3 font-medium" role="status">Mengirim pendaftaran... Mohon tunggu.</div>
          )}

          {step === 1 && (
            <div className="space-y-5 transition-opacity duration-300">
              <h2 className="font-display text-xl font-bold text-brand-dark">Let's Get to Know You</h2>
              <Field label="Nama Lengkap" required htmlFor="fn"><input id="fn" type="text" value={values.fullName} onChange={e=>update('fullName',e.target.value)} className={inputClass(errors.fullName)} placeholder="Contoh: Muhammad Afiq" aria-invalid={!!errors.fullName} aria-describedby="fn-err" />{errMsg(errors.fullName, 'fn-err')}</Field>
              <Field label="Nama Panggilan" required htmlFor="pn"><input id="pn" type="text" value={values.nickname} onChange={e=>update('nickname',e.target.value)} className={inputClass(errors.nickname)} placeholder="Contoh: Ejak" aria-invalid={!!errors.nickname} aria-describedby="pn-err" />{errMsg(errors.nickname, 'pn-err')}</Field>
              <Field label="Nomor WhatsApp" required htmlFor="wa"><input id="wa" type="tel" value={values.whatsapp} onChange={e=>update('whatsapp',e.target.value)} className={inputClass(errors.whatsapp)} placeholder="081234567890" aria-invalid={!!errors.whatsapp} aria-describedby="wa-err" />{errMsg(errors.whatsapp, 'wa-err')}</Field>
              <Field label="Email" htmlFor="em"><input id="em" type="email" value={values.email} onChange={e=>update('email',e.target.value)} className={inputClass(errors.email)} placeholder="anda@email.com (opsional)" aria-invalid={!!errors.email} aria-describedby="em-err" />{errMsg(errors.email, 'em-err')}</Field>
              <Field label="Tahun Lahir" required htmlFor="by"><select id="by" value={values.birthYear} onChange={e=>update('birthYear',e.target.value)} className={inputClass(errors.birthYear)} aria-invalid={!!errors.birthYear} aria-describedby="by-err"><option value="">Pilih tahun</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select>{errMsg(errors.birthYear, 'by-err')}</Field>
              <Field label="Domisili Saat Ini" required htmlFor="dom"><input id="dom" type="text" value={values.domicile} onChange={e=>update('domicile',e.target.value)} className={inputClass(errors.domicile)} placeholder="Contoh: Yogyakarta" aria-invalid={!!errors.domicile} aria-describedby="dom-err" />{errMsg(errors.domicile, 'dom-err')}</Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 transition-opacity duration-300">
              <h2 className="font-display text-xl font-bold text-brand-dark">Your English Journey</h2>
              <Field label="Status Saat Ini" required htmlFor="st"><select id="st" value={values.status} onChange={e=>update('status',e.target.value)} className={inputClass(errors.status)} aria-invalid={!!errors.status} aria-describedby="st-err"><option value="">Pilih status</option>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>{errMsg(errors.status, 'st-err')}</Field>
              {values.status === 'Lainnya' && <Field label="Jelaskan Status Lainnya" required htmlFor="sto"><input id="sto" type="text" value={values.statusOther} onChange={e=>update('statusOther',e.target.value)} className={inputClass(errors.statusOther)} placeholder="Contoh: Freelance designer" aria-invalid={!!errors.statusOther} aria-describedby="sto-err" />{errMsg(errors.statusOther, 'sto-err')}</Field>}
              <div>
                <label className="block text-sm font-semibold text-brand-ink mb-2" htmlFor="goals">Tujuan Utama Belajar English <span className="text-brand-blue font-bold">(Pilih maksimal 2)</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="goals" role="group" aria-label="Tujuan belajar">
                  {GOALS.map(g => (
                    <button key={g} type="button" onClick={()=>toggleGoal(g)} className={`text-left text-sm px-3 py-2.5 rounded-xl border transition flex items-center gap-2 ${values.learningGoals.includes(g) ? 'bg-brand-blue-soft border-brand-blue text-brand-blue-deep font-medium shadow-sm' : 'bg-white border-brand-blue-soft/60 text-brand-slate hover:border-brand-blue/40'}`} aria-pressed={values.learningGoals.includes(g)}>
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${values.learningGoals.includes(g) ? 'bg-brand-blue border-brand-blue' : 'border-brand-slate/30'}`}>{values.learningGoals.includes(g) ? <span className="text-[10px] text-white font-bold">✓</span> : <span />}</span>
                      <span className="leading-tight">{g}</span>
                    </button>
                  ))}
                </div>
                {errors.learningGoals && <p id="goals-err" className="text-red-600 text-sm mt-1">{errors.learningGoals}</p>}
                {values.learningGoals.includes('Lainnya') && <div className="mt-2"><input type="text" value={values.learningGoalsOther} onChange={e=>update('learningGoalsOther',e.target.value)} className={inputClass(errors.learningGoalsOther)} placeholder="Jelaskan tujuan lainnya" aria-invalid={!!errors.learningGoalsOther} aria-describedby="gother-err" />{errMsg(errors.learningGoalsOther, 'gother-err')}</div>}
              </div>
              <Field label="Kemampuan English Saat Ini" required htmlFor="lvl"><select id="lvl" value={values.englishLevel} onChange={e=>update('englishLevel',e.target.value)} className={inputClass(errors.englishLevel)} aria-invalid={!!errors.englishLevel} aria-describedby="lvl-err"><option value="">Pilih level</option>{LEVELS.map(l=><option key={l} value={l}>{l}</option>)}</select>
                <div className="mt-2 text-xs text-brand-slate/80 space-y-1">
                  <p><strong>Beginner</strong> — masih sangat dasar</p>
                  <p><strong>Basic</strong> — mengerti sedikit, masih sulit bicara</p>
                  <p><strong>Intermediate</strong> — bisa berkomunikasi tetapi belum lancar</p>
                  <p><strong>Advanced</strong> — cukup lancar</p>
                </div>
                {errMsg(errors.englishLevel, 'lvl-err')}
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 transition-opacity duration-300">
              <h2 className="font-display text-xl font-bold text-brand-dark">Your Program</h2>
              <Field label="Program yang Diminati" required htmlFor="pr"><select id="pr" value={values.program} onChange={e=>update('program',e.target.value)} className={inputClass(errors.program)} aria-invalid={!!errors.program} aria-describedby="pr-err"><option value="">Pilih program</option>{PROGRAMS.map(p=><option key={p} value={p}>{p}</option>)}</select>{errMsg(errors.program, 'pr-err')}</Field>
              <Field label="Dari Mana Mengetahui Super Duper" required htmlFor="src"><select id="src" value={values.source} onChange={e=>update('source',e.target.value)} className={inputClass(errors.source)} aria-invalid={!!errors.source} aria-describedby="src-err"><option value="">Pilih sumber</option>{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select>{errMsg(errors.source, 'src-err')}</Field>
              {values.source === 'Lainnya' && <Field label="Jelaskan Sumber Lainnya" required htmlFor="srcoth"><input id="srcoth" type="text" value={values.sourceOther} onChange={e=>update('sourceOther',e.target.value)} className={inputClass(errors.sourceOther)} placeholder="Contoh: Poster kampus" aria-invalid={!!errors.sourceOther} aria-describedby="srcoth-err" />{errMsg(errors.sourceOther, 'srcoth-err')}</Field>}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 mt-7 pt-6 border-t border-brand-blue-soft/40">
            {step > 1 ? (
              <button type="button" onClick={goBack} className="rounded-full px-5 py-2.5 text-sm font-semibold text-brand-blue bg-brand-blue-soft hover:bg-brand-blue-soft/70 transition">Kembali</button>
            ) : <div />}
            {step < 3 ? (
              <button type="button" onClick={goNext} className="ml-auto rounded-full bg-brand-blue text-white px-7 py-2.5 text-sm font-bold font-display shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-deep transition">Lanjut</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={status === 'loading'} className="ml-auto rounded-full bg-brand-yellow text-brand-dark px-7 py-3 text-sm font-extrabold font-display shadow-xl shadow-brand-yellow/30 hover:brightness-95 active:scale-[0.98] transition disabled:opacity-70">DAFTAR SEKARANG</button>
            )}
          </div>
        </div>
      </div>
      <div className="text-center text-[11px] text-brand-slate/50 mt-4 pb-6">Super Duper Language Center · Yogyakarta · Data disimpan secara aman</div>
    </section>
  );
}

function inputClass(err?: string) {
  return 'w-full rounded-xl border px-3.5 py-2.5 text-sm bg-brand-stone border-brand-blue-soft/60 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition ' + (err ? 'border-red-300 bg-red-50/40' : 'hover:border-brand-blue/40');
}
function errMsg(err?: string, id?: string) {
  if (!err) return null;
  return <p id={id} className="text-red-600 text-xs mt-1">{err}</p>;
}
function Field({ label, required, htmlFor, children }: { label: string; required?: boolean; htmlFor: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-semibold text-brand-ink mb-1" htmlFor={htmlFor}>{label}{required ? <span className="text-brand-blue ml-0.5" aria-label="required">*</span> : null}</label>{children}</div>;
}

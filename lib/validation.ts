export interface FormData {
  fullName: string;
  nickname: string;
  whatsapp: string;
  email: string;
  birthDate: string;
  domicile: string;
  status: string;
  statusOther: string;
  learningGoals: string[];
  learningGoalsOther: string;
  englishLevel: string;
  program: string;
  source: string;
  sourceOther: string;
}

export type FieldErrors = Partial<Record<keyof FormData, string>>;

const GOALS = [
  "Lebih lancar conversation",
  "Meningkatkan confidence",
  "Persiapan kerja",
  "Persiapan kerja ke luar negeri",
  "Hospitality / Cruise Career",
  "Pendidikan",
  "Lainnya",
];

const STATUSES = ["Pelajar","Mahasiswa","Fresh Graduate","Bekerja","Sedang mencari kerja","Lainnya"];
const PROGRAMS = ["English for Duta Persada Student","English for General Customer","Belum tahu, ingin konsultasi"];
const SOURCES = ["Instagram","TikTok","YouTube","Teman/Alumni","Duta Persada","Google","Lainnya"];
const LEVELS = ["Beginner","Basic","Intermediate","Advanced"];

function normalizeWA(raw: string) {
  let s = raw.replace(/\D/g, "");
  if (s.startsWith("0")) s = "62" + s.slice(1);
  if (!s.startsWith("62")) s = "62" + s;
  return s;
}

export function validate(data: Partial<FormData>, step?: number): { ok: boolean; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const d = data as Partial<FormData>;

  if (!step || step >= 1) {
    if (!d.fullName || d.fullName.trim().length < 2) errors.fullName = "Masukkan nama lengkap";
    if (!d.nickname || d.nickname.trim().length < 1) errors.nickname = "Masukkan nama panggilan";
    if (!d.whatsapp || d.whatsapp.trim().length < 7) errors.whatsapp = "Masukkan nomor WhatsApp";
    else {
      const n = normalizeWA(d.whatsapp);
      if (n.length < 10 || n.length > 15) errors.whatsapp = "Nomor WhatsApp tidak valid";
    }
    if (d.email && d.email.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errors.email = "Format email tidak valid";
    if (!d.birthDate || d.birthDate.trim().length === 0) errors.birthDate = "Masukkan tanggal lahir";
    else {
      const bdRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!bdRegex.test(d.birthDate.trim())) errors.birthDate = "Format tanggal lahir harus DD/MM/YYYY";
      else {
        const parts = d.birthDate.trim().split("/");
        const year = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[0], 10);
        if (year < 1940 || year > 2015) errors.birthDate = "Tahun lahir tidak masuk akal";
        else {
          const dateObj = new Date(year, month - 1, day);
          if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
            errors.birthDate = "Tanggal lahir tidak valid";
          }
        }
      }
    }
    if (!d.domicile || d.domicile.trim().length < 2) errors.domicile = "Masukkan domisili saat ini";
  }

  if (!step || step >= 2) {
    if (!d.status || !STATUSES.includes(d.status)) errors.status = "Pilih status saat ini";
    if (d.status === "Lainnya" && (!d.statusOther || d.statusOther.trim().length < 1)) errors.statusOther = "Jelaskan status lainnya";

    if (!d.learningGoals || d.learningGoals.length === 0) errors.learningGoals = "Pilih minimal 1 tujuan";
    else if (d.learningGoals.length > 2) errors.learningGoals = "Pilih maksimal 2 tujuan";
    if (d.learningGoals?.includes("Lainnya") && (!d.learningGoalsOther || d.learningGoalsOther.trim().length < 2)) errors.learningGoalsOther = "Jelaskan tujuan lainnya";

    if (!d.englishLevel || !LEVELS.includes(d.englishLevel)) errors.englishLevel = "Pilih kemampuan English";
  }

  if (!step || step >= 3) {
    if (!d.program || !PROGRAMS.includes(d.program)) errors.program = "Pilih program";
    if (!d.source || !SOURCES.includes(d.source)) errors.source = "Pilih dari mana Anda mengetahui kami";
    if (d.source === "Lainnya" && (!d.sourceOther || d.sourceOther.trim().length < 1)) errors.sourceOther = "Jelaskan sumber lainnya";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

export { GOALS, STATUSES, PROGRAMS, SOURCES, LEVELS, normalizeWA };

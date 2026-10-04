import { NextRequest, NextResponse } from "next/server";
import { validate, GOALS, STATUSES, PROGRAMS, SOURCES } from "@/lib/validation";
import { generateId, normalizeGoals } from "@/lib/registration";
import { appendRegistration } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Basic rate guard (very simple memory-based per IP not feasible serverless; use header check)
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ success: false, error: "Invalid content type." }, { status: 400 });
    }

    // Sanitize / type-cast
    const d = {
      fullName: String(body.fullName || "").trim().slice(0, 120),
      nickname: String(body.nickname || "").trim().slice(0, 60),
      whatsapp: String(body.whatsapp || "").trim().slice(0, 30),
      email: String(body.email || "").trim().slice(0, 100),
      birthYear: String(body.birthYear || "").trim(),
      domicile: String(body.domicile || "").trim().slice(0, 120),
      status: String(body.status || "").trim(),
      statusOther: String(body.statusOther || "").trim().slice(0, 120),
      learningGoals: Array.isArray(body.learningGoals) ? body.learningGoals.map((s: unknown) => String(s).trim()).filter(Boolean) : [],
      learningGoalsOther: String(body.learningGoalsOther || "").trim().slice(0, 120),
      englishLevel: String(body.englishLevel || "").trim(),
      program: String(body.program || "").trim(),
      source: String(body.source || "").trim(),
      sourceOther: String(body.sourceOther || "").trim().slice(0, 120),
    };

    // Build goals with explanation embedded
    // goals stored with embedded explanations below

    const v = validate(d, 3);
    if (!v.ok) {
      return NextResponse.json({ success: false, error: "Please complete the required fields.", details: v.errors }, { status: 400 });
    }

    // Additional allowed-value checks
    if (!STATUSES.includes(d.status)) return NextResponse.json({ success: false, error: "Invalid status selection." }, { status: 400 });
    if (!PROGRAMS.includes(d.program)) return NextResponse.json({ success: false, error: "Invalid program selection." }, { status: 400 });
    if (!SOURCES.includes(d.source)) return NextResponse.json({ success: false, error: "Invalid source selection." }, { status: 400 });
    if (d.learningGoals.length > 2) return NextResponse.json({ success: false, error: "Select max 2 goals." }, { status: 400 });

    // Normalize whatsapp for storage
    const wa = d.whatsapp.replace(/\D/g, "");
    let whatsappNormalized = wa;
    if (whatsappNormalized.startsWith("0")) whatsappNormalized = "62" + whatsappNormalized.slice(1);
    if (!whatsappNormalized.startsWith("62")) whatsappNormalized = "62" + whatsappNormalized;

    // Generate ID
    const regId = generateId();
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

    // Build goals string (with other explanations embedded)
    let goalsString = d.learningGoals.join("; ");
    // goals stored with embedded explanations below

    // Build status with other if selected
    let statusString = d.status;
    if (d.status === "Lainnya" && d.statusOther) statusString = `Lainnya: ${d.statusOther}`;

    // Build source with other
    let sourceString = d.source;
    if (d.source === "Lainnya" && d.sourceOther) sourceString = `Lainnya: ${d.sourceOther}`;

    // Append to sheet
    await appendRegistration({
      id: regId,
      timestamp,
      fullName: d.fullName,
      nickname: d.nickname,
      whatsapp: whatsappNormalized,
      email: d.email || "",
      birthYear: d.birthYear,
      domicile: d.domicile,
      status: statusString,
      learningGoals: goalsString,
      englishLevel: d.englishLevel,
      program: d.program,
      source: sourceString,
      leadStatus: "New",
      notes: "",
    });

    return NextResponse.json({ success: true, registrationId: regId }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /api/register] error:", msg);
    return NextResponse.json({ success: false, error: "We couldn't complete your registration right now. Please try again in a moment." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validation";
export async function POST(request: Request) {
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return NextResponse.json({ error: "Unsupported request." }, { status: 415 });
  const parsed = contactMessageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the submitted information.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ success: true });
  try {
    await prisma.contactMessage.create({ data: { name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone || null, organisation: parsed.data.organisation || null, subject: parsed.data.subject, message: parsed.data.message } });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "We could not save your enquiry. Please try again." }, { status: 500 }); }
}

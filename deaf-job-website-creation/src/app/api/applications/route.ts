import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { jobId, name, email, preferredContact, message } = body;
  if (!jobId || !name || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [row] = await db
    .insert(applications)
    .values({
      jobId: Number(jobId),
      name: String(name).trim(),
      email: String(email).trim(),
      preferredContact: preferredContact ? String(preferredContact) : "Email",
      message: message ? String(message).trim() : "",
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

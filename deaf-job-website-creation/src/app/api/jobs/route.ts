import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();
  const rows = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { title, company, location, type, description, contactEmail, aslFriendly, remote, applyUrl, salary } = body;
  if (!title || !company || !location || !description || !contactEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [row] = await db
    .insert(jobs)
    .values({
      title: String(title).trim(),
      company: String(company).trim(),
      location: String(location).trim(),
      type: type ? String(type) : "Full-time",
      description: String(description).trim(),
      contactEmail: String(contactEmail).trim(),
      aslFriendly: Boolean(aslFriendly ?? true),
      remote: Boolean(remote ?? false),
      applyUrl: applyUrl ? String(applyUrl).trim() : null,
      salary: salary ? String(salary).trim() : null,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

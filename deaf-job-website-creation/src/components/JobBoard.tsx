"use client";

import { useMemo, useState, type FormEvent } from "react";

export type JobDTO = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  contactEmail: string;
  aslFriendly: boolean;
  remote: boolean;
  applyUrl: string | null;
  salary: string | null;
  createdAt: string;
};

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function JobBoard({ initialJobs }: { initialJobs: JobDTO[] }) {
  const [jobs, setJobs] = useState<JobDTO[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [applyingTo, setApplyingTo] = useState<JobDTO | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        (!remoteOnly || j.remote) &&
        (j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)),
    );
  }, [jobs, search, remoteOnly]);

  async function submitJob(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      title: fd.get("title"),
      company: fd.get("company"),
      location: fd.get("location"),
      type: fd.get("type"),
      description: fd.get("description"),
      contactEmail: fd.get("contactEmail"),
      applyUrl: fd.get("applyUrl") || null,
      salary: fd.get("salary") || null,
      aslFriendly: fd.get("aslFriendly") === "on",
      remote: fd.get("remote") === "on",
    };
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const job: JobDTO = await res.json();
      setJobs((prev) => [job, ...prev]);
      form.reset();
      setNotice("✅ Your job was posted! Thank you for hiring Deaf talent.");
      document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setNotice("❌ Something went wrong. Please check all fields.");
    }
  }

  async function submitApplication(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!applyingTo) return;
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: applyingTo.id,
        name: fd.get("name"),
        email: fd.get("email"),
        preferredContact: fd.get("preferredContact"),
        message: fd.get("message"),
      }),
    });
    if (res.ok) {
      setNotice(`✅ Application sent to ${applyingTo.company}! They will contact you by your preferred method.`);
      setApplyingTo(null);
    } else {
      setNotice("❌ Could not send application. Please try again.");
    }
  }

  return (
    <>
      {notice && (
        <div role="status" className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-indigo-900">
            <span>{notice}</span>
            <button onClick={() => setNotice(null)} className="ml-4 text-sm font-semibold underline">Dismiss</button>
          </div>
        </div>
      )}

      {/* Listings */}
      <section id="jobs" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Open Positions</h2>
            <p className="mt-1 text-slate-600">{filtered.length} Deaf-friendly job{filtered.length === 1 ? "" : "s"} available · real employers, links go to their live postings</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              aria-label="Search jobs"
              placeholder="Search title, company, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputCls} w-64`}
            />
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
              Remote only
            </label>
          </div>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {filtered.map((j) => (
            <li key={j.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex flex-wrap gap-2">
                {j.aslFriendly && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">🤟 ASL Friendly</span>}
                {j.remote && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">🏠 Remote</span>}
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{j.type}</span>
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900">{j.title}</h3>
              <p className="text-slate-600">{j.company} · {j.location}</p>
              {j.salary && <p className="mt-1 text-sm font-semibold text-emerald-700">💵 {j.salary}</p>}
              <p className="mt-3 flex-1 text-sm text-slate-700">{j.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-slate-500">Posted {new Date(j.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  {j.applyUrl && (
                    <a href={j.applyUrl} target="_blank" rel="noreferrer" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                      Apply on employer site ↗
                    </a>
                  )}
                  <button onClick={() => { setApplyingTo(j); setNotice(null); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${j.applyUrl ? "border border-indigo-600 text-indigo-700 hover:bg-indigo-50" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
                    Express interest
                  </button>
                </div>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No jobs match your search yet.</li>
          )}
        </ul>
      </section>

      {/* Apply modal */}
      {applyingTo && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="apply-title">
          <form onSubmit={submitApplication} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 id="apply-title" className="text-2xl font-bold text-slate-900">Apply: {applyingTo.title}</h3>
            <p className="mt-1 text-slate-600">{applyingTo.company} — they&apos;ll contact you your way. No phone calls.</p>
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-medium text-slate-700">Your name
                <input name="name" required className={`${inputCls} mt-1`} />
              </label>
              <label className="text-sm font-medium text-slate-700">Email
                <input name="email" type="email" required className={`${inputCls} mt-1`} />
              </label>
              <label className="text-sm font-medium text-slate-700">Preferred way to be contacted
                <select name="preferredContact" className={`${inputCls} mt-1`}>
                  <option>Email</option>
                  <option>Text message</option>
                  <option>Video call (ASL)</option>
                  <option>Video Relay Service</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">Message (optional)
                <textarea name="message" rows={3} className={`${inputCls} mt-1`} placeholder="Tell them about yourself…" />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setApplyingTo(null)} className="rounded-full px-5 py-2 font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="rounded-full bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-700">Send Application</button>
            </div>
          </form>
        </div>
      )}

      {/* Post a job */}
      <section id="post" className="scroll-mt-20 bg-indigo-50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-3xl font-bold text-slate-900">Post a Deaf-Friendly Job</h2>
          <p className="mt-2 text-slate-600">Free for employers. By posting, you agree to provide ASL interpreters or written communication for interviews.</p>
          <form onSubmit={submitJob} className="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Job title
              <input name="title" required className={`${inputCls} mt-1`} />
            </label>
            <label className="text-sm font-medium text-slate-700">Company
              <input name="company" required className={`${inputCls} mt-1`} />
            </label>
            <label className="text-sm font-medium text-slate-700">Location
              <input name="location" required placeholder="Bethel, AK or Remote" className={`${inputCls} mt-1`} />
            </label>
            <label className="text-sm font-medium text-slate-700">Job type
              <select name="type" className={`${inputCls} mt-1`}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">Salary / pay (optional)
              <input name="salary" placeholder="$20/hr or $60k/yr" className={`${inputCls} mt-1`} />
            </label>
            <label className="text-sm font-medium text-slate-700">Application link (optional)
              <input name="applyUrl" type="url" placeholder="https://…" className={`${inputCls} mt-1`} />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Contact email
              <input name="contactEmail" type="email" required className={`${inputCls} mt-1`} />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Description
              <textarea name="description" rows={4} required className={`${inputCls} mt-1`} placeholder="Describe the role and the accommodations you offer…" />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" name="aslFriendly" defaultChecked className="h-4 w-4 accent-indigo-600" /> ASL interpreters / accommodations provided
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" name="remote" className="h-4 w-4 accent-indigo-600" /> Remote position
            </label>
            <button type="submit" className="mt-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 sm:col-span-2">
              Post Job
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

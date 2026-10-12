import { desc } from "drizzle-orm";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import JobBoard from "@/components/JobBoard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeeded();
  const rows = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  const initialJobs = rows.map((j) => ({ ...j, createdAt: j.createdAt.toISOString() }));

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-indigo-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2 text-xl font-bold text-indigo-700">
            <span aria-hidden className="text-2xl">🤟</span> ASL Bethel Jobs
          </a>
          <nav className="hidden gap-6 text-sm font-medium text-slate-700 sm:flex">
            <a href="#jobs" className="hover:text-indigo-700">Find Jobs</a>
            <a href="#post" className="hover:text-indigo-700">Post a Job</a>
            <a href="#resources" className="hover:text-indigo-700">Resources</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">
            Deaf-owned. Deaf-friendly. Deaf-first.
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">
            Helping Deaf people find jobs that <span className="text-amber-300">see</span> their talent.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
            Every employer on this board has committed to ASL-accessible hiring: interpreters,
            captioning, and written-first communication. No phone calls required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#jobs" className="rounded-full bg-amber-400 px-7 py-3 font-semibold text-slate-900 shadow-lg hover:bg-amber-300">
              Browse Jobs
            </a>
            <a href="#post" className="rounded-full border-2 border-white/70 px-7 py-3 font-semibold text-white hover:bg-white/10">
              Hire Deaf Talent
            </a>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:grid-cols-3">
        {[
          { icon: "🙌", title: "ASL-Accessible Employers", text: "Every listing is tagged for ASL support, interpreters, and visual-alert workplaces." },
          { icon: "💬", title: "No Phone Calls", text: "Apply by email, text, or video relay. Employers agree to reach you the way you prefer." },
          { icon: "🌍", title: "Local & Remote", text: "Jobs in Bethel, across Alaska, and fully remote positions nationwide." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-4xl" aria-hidden>{f.icon}</div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-slate-600">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Job Board (client) */}
      <JobBoard initialJobs={initialJobs} />

      {/* Resources */}
      <section id="resources" className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold text-slate-900">Know Your Rights & Resources</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { title: "ADA Workplace Accommodations", text: "Under the Americans with Disabilities Act, employers must provide reasonable accommodations such as sign language interpreters and captioning.", link: "https://www.ada.gov", label: "ada.gov" },
              { title: "National Association of the Deaf", text: "Employment advocacy, legal help, and resources for Deaf job seekers.", link: "https://www.nad.org", label: "nad.org" },
              { title: "Vocational Rehabilitation (Alaska)", text: "Free job training, resume help, and interpreter funding for Alaskans with disabilities.", link: "https://labor.alaska.gov/dvr/", label: "labor.alaska.gov/dvr" },
              { title: "Video Relay Service (VRS)", text: "Use a free VRS to call employers through an interpreter when a phone call is unavoidable.", link: "https://www.fcc.gov/vrs", label: "fcc.gov/vrs" },
            ].map((r) => (
              <a key={r.title} href={r.link} target="_blank" rel="noreferrer" className="block rounded-2xl border border-slate-200 p-6 transition hover:border-indigo-400 hover:shadow-md">
                <h3 className="text-lg font-bold text-indigo-700">{r.title}</h3>
                <p className="mt-2 text-slate-600">{r.text}</p>
                <p className="mt-3 text-sm font-medium text-slate-500">{r.label} ↗</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center">
          <p className="text-2xl" aria-hidden>🤟</p>
          <p className="text-lg font-semibold text-white">ASL Bethel Jobs · aslbethel.us</p>
          <p className="text-base">
            Made with ❤️ by <span className="font-bold text-amber-300">Tyree</span> and{" "}
            <span className="font-bold text-amber-300">Kianu</span>
          </p>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} ASL Bethel. Connecting the Deaf community to meaningful work.</p>
        </div>
      </footer>
    </main>
  );
}

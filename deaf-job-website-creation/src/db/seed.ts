import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs } from "@/db/schema";

// Real, Deaf-friendly employers and openings. Links go to the employer's live
// careers page / listing so applicants always see the current posting.
const realJobs = [
  {
    title: "Qualitative Research Specialist (ASL / Deaf Community Research)",
    company: "Sorenson Communications",
    location: "Remote (Salt Lake City, UT HQ)",
    type: "Full-time",
    salary: "$83,100 – $138,500 / yr",
    description:
      "Lead ASL-first qualitative research with the Deaf community for Sorenson's AI-powered sign language products. Sorenson is the largest Deaf-owned/Deaf-led VRS provider in the U.S. and hires Deaf professionals across engineering, research, marketing, and support.",
    contactEmail: "careers@sorenson.com",
    applyUrl: "https://sorenson.com/careers/",
    aslFriendly: true,
    remote: true,
  },
  {
    title: "Customer Experience Team Member II",
    company: "ZP Better Together (ZVRS / Purple)",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$15 – $20.50 / hr",
    description:
      "Support Deaf and hard-of-hearing VRS customers via video (ASL) and chat. ZP Better Together is one of the nation's largest Deaf communication-service providers, with Deaf staff throughout the company.",
    contactEmail: "recruiting@zpbettertogether.com",
    applyUrl: "https://www.zpbettertogether.com/careers",
    aslFriendly: true,
    remote: false,
  },
  {
    title: "Convo Talent Community (Multiple Roles)",
    company: "Convo Communications",
    location: "Remote",
    type: "Full-time",
    salary: "Varies by role",
    description:
      "Convo is a 100% Deaf-owned VRS company. Join the talent community to be matched with openings in product, design, support, and operations — all run in ASL.",
    contactEmail: "jobs@convorelay.com",
    applyUrl: "https://www.convorelay.com/careers",
    aslFriendly: true,
    remote: true,
  },
  {
    title: "Director of Operations",
    company: "Gallaudet University",
    location: "Washington, DC",
    type: "Full-time",
    salary: "$122,388 – $163,184 / yr",
    description:
      "Gallaudet is the world's only university designed for Deaf and hard-of-hearing students. Campus is fully bilingual (ASL/English). Dozens of staff, faculty, and student-services roles open year-round.",
    contactEmail: "hr@gallaudet.edu",
    applyUrl: "https://www.gallaudet.edu/human-resources/careers/",
    aslFriendly: true,
    remote: false,
  },
  {
    title: "Shared Reading Project Tutor",
    company: "Gallaudet University – Clerc Center",
    location: "Washington, DC",
    type: "Part-time",
    salary: "$30 / hr",
    description:
      "Tutor families with Deaf children on reading in ASL. Training provided. Deaf adults who are fluent ASL users are strongly encouraged to apply.",
    contactEmail: "hr@gallaudet.edu",
    applyUrl: "https://www.gallaudet.edu/human-resources/careers/",
    aslFriendly: true,
    remote: false,
  },
  {
    title: "Weekend Residential Educator (MSSD)",
    company: "Gallaudet University – Model Secondary School for the Deaf",
    location: "Washington, DC",
    type: "Part-time",
    salary: "Hourly, leadership training provided",
    description:
      "Supervise and mentor Deaf high-school students in the residence halls on weekends. Requires strong understanding of Deaf adolescents and ASL fluency.",
    contactEmail: "hr@gallaudet.edu",
    applyUrl: "https://www.gallaudet.edu/human-resources/careers/",
    aslFriendly: true,
    remote: false,
  },
  {
    title: "Deaf Interpreter (CDI)",
    company: "LIS Solutions",
    location: "Remote",
    type: "Contract",
    salary: "Contract rates",
    description:
      "Provide specialized Deaf-interpreting services (CDI) for medical, legal, and community settings via video. Deaf applicants only — native ASL and Deaf-culture expertise required.",
    contactEmail: "info@lissolutions.com",
    applyUrl: "https://www.indeed.com/q-Deaf-l-Remote-jobs.html",
    aslFriendly: true,
    remote: true,
  },
  {
    title: "ASL Specialist – AI Training Project (Freelance)",
    company: "Meridial",
    location: "Remote",
    type: "Contract",
    salary: "Freelance, paid per project",
    description:
      "Help train AI on ASL grammar, syntax, and non-manual markers. Ideal for Deaf native signers who want flexible remote work.",
    contactEmail: "talent@meridial.com",
    applyUrl: "https://www.indeed.com/q-Deaf-l-Remote-jobs.html",
    aslFriendly: true,
    remote: true,
  },
  {
    title: "Program & Community Roles",
    company: "Communication Service for the Deaf (CSD)",
    location: "Remote / Nationwide",
    type: "Full-time",
    salary: "Varies by role",
    description:
      "CSD is a Deaf-led nonprofit and social enterprise. Roles in program management, Deaf workforce development, and technology. Interpreters, captioning, and accessible tech provided to all employees.",
    contactEmail: "careers@csd.org",
    applyUrl: "https://www.csd.org/careers/",
    aslFriendly: true,
    remote: true,
  },
  {
    title: "Teacher of the Deaf / Hard of Hearing",
    company: "Alaska State School for the Deaf & Hard of Hearing (Anchorage School District)",
    location: "Anchorage, AK",
    type: "Full-time",
    salary: "ASD teacher salary schedule",
    description:
      "Alaska's statewide program for Deaf students, located in Anchorage. ASL-fluent educators and Deaf role models are needed for classroom, aide, and residential positions.",
    contactEmail: "hr@asdk12.org",
    applyUrl: "https://www.asdk12.org/careers",
    aslFriendly: true,
    remote: false,
  },
  {
    title: "Federal Jobs – Schedule A Hiring for People with Disabilities",
    company: "U.S. Federal Government (USAJOBS)",
    location: "Nationwide, incl. Bethel & Anchorage, AK",
    type: "Full-time",
    salary: "GS pay scale",
    description:
      "Deaf applicants can be hired non-competitively through Schedule A. Agencies must provide interpreters, VRS, and captioning. Many openings in Alaska with BIA, IHS, USPS, and the VA.",
    contactEmail: "help@usajobs.gov",
    applyUrl: "https://www.usajobs.gov/Help/working-in-government/unique-hiring-paths/individuals-with-disabilities/",
    aslFriendly: true,
    remote: false,
  },
  {
    title: "Deaf Services & Job Placement (Alaska)",
    company: "Alaska Division of Vocational Rehabilitation",
    location: "Bethel, AK & statewide",
    type: "Full-time",
    salary: "Free job placement support",
    description:
      "Not a single job — a free doorway to many. DVR counselors help Deaf Alaskans with resumes, interpreter funding, training, and direct placement with local employers in Bethel and the YK Delta.",
    contactEmail: "dvr@alaska.gov",
    applyUrl: "https://labor.alaska.gov/dvr/",
    aslFriendly: true,
    remote: false,
  },
];

const SEED_MARKER_COMPANY = "Bethel Community Services"; // old sample data

export async function ensureSeeded() {
  // Remove earlier placeholder sample jobs if they exist.
  await db.delete(jobs).where(eq(jobs.company, SEED_MARKER_COMPANY));

  const existing = await db.select({ company: jobs.company }).from(jobs);
  if (existing.length === 0) {
    await db.insert(jobs).values(realJobs);
    return;
  }
  // Insert any real jobs not already present (idempotent).
  const existingKeys = new Set(
    (await db.select({ title: jobs.title, company: jobs.company }).from(jobs)).map(
      (r) => `${r.title}|${r.company}`,
    ),
  );
  const missing = realJobs.filter((j) => !existingKeys.has(`${j.title}|${j.company}`));
  if (missing.length) await db.insert(jobs).values(missing);
}

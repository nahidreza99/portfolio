import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CASE_STUDIES_DIR = path.join(process.cwd(), "content", "case-studies");

export interface WorkSummary {
  slug: string;
  title: string;
  shortDescription: string;
  tech: string[];
  year?: string;
  thumbnail?: string;
  client?: string;
}

export interface WorkWithContent {
  frontmatter: WorkSummary;
  content: string;
}

function getSlugs(): string[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];
  return fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.basename(f, ".md"));
}

export function getAllSlugs(): string[] {
  return getSlugs();
}

export async function getAllWorks(): Promise<WorkSummary[]> {
  const slugs = getSlugs();
  const works: WorkSummary[] = [];
  for (const slug of slugs) {
    const work = await getWorkBySlug(slug);
    if (work) works.push(work.frontmatter);
  }
  return works;
}

export async function getWorkBySlug(
  slug: string
): Promise<WorkWithContent | null> {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter: WorkSummary = {
    slug,
    title: data.title ?? slug,
    shortDescription: data.shortDescription ?? "",
    tech: Array.isArray(data.tech) ? data.tech : [],
    year: data.year,
    thumbnail: data.thumbnail,
    client: data.client,
  };
  return { frontmatter, content };
}

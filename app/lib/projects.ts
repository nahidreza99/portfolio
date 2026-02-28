import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export interface ProjectSummary {
  slug: string;
  title: string;
  shortDescription: string;
  tech: string[];
  year?: string;
  thumbnail?: string;
  client?: string;
  github?: string;
  live?: string;
}

export interface ProjectWithContent {
  frontmatter: ProjectSummary;
  content: string;
}

function getSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.basename(f, ".md"));
}

export function getAllProjectSlugs(): string[] {
  return getSlugs();
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  const slugs = getSlugs();
  const projects: ProjectSummary[] = [];
  for (const slug of slugs) {
    const project = await getProjectBySlug(slug);
    if (project) projects.push(project.frontmatter);
  }
  return projects;
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectWithContent | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter: ProjectSummary = {
    slug,
    title: data.title ?? slug,
    shortDescription: data.shortDescription ?? "",
    tech: Array.isArray(data.tech) ? data.tech : [],
    year: data.year,
    thumbnail: data.thumbnail,
    client: data.client,
    github: data.github,
    live: data.live,
  };
  return { frontmatter, content };
}

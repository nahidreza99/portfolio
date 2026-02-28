# Portfolio Case Study — Personal / Non-Client Projects

Use this prompt in Cursor (or any LLM) when working on a **personal, open-source, or non-client project** to generate a **uniform, portfolio-ready case study** in Markdown. The output should be a single `.md` file that can be dropped into `content/case-studies/` and will render on the portfolio site. Unlike the NDA-focused prompt, this one allows **real project names** and **optional links** (GitHub, live demo).

**Reference example:** Same section order and style as `content/case-studies/air-duct-cleaning-service.md` in this repo.

---

## Instructions for the AI

Generate a case study markdown file for my portfolio based on the project I'm describing or the docs you have in context. Follow these rules exactly.

### 1. Naming and links

- **Title and naming:** Use the **real** project or product name in the title and throughout the case study (e.g. "My Todo API", "Recipe Finder App").
- **Client:** Omit `client` or set to "Personal" or "Open source" as appropriate. No need to anonymize.
- **Optional links:** If the project has a public repo or live demo, add `github` and/or `live` to the frontmatter (full URLs). Do not include internal or confidential links. If the portfolio Work section does not yet display these fields, they can still be mentioned in the Summary or you can add them for future use.

### 2. File and frontmatter

- **Filename:** `{slug}.md` where `slug` is lowercase, hyphenated (e.g. `my-todo-api.md`). The slug is used in the URL: `/work/{slug}`.
- **Frontmatter (YAML at the top):**

```yaml
---
title: <Real project name, e.g. "My Todo API">
shortDescription: <One sentence for portfolio cards: what it is and main tech.>
tech:
  - <Tech 1>
  - <Tech 2>
  # ... 5–12 items: frameworks, DB, infra, CI/CD
year: "<YYYY>"
thumbnail: /case_study/<folder_name>/thumbnail.png
client: Personal
# Optional:
github: https://github.com/username/repo
live: https://my-app.example.com
---
```

- **Required frontmatter fields:** `title`, `shortDescription`, `tech` (array), `year`, `thumbnail`. **Optional:** `client` (use "Personal" or "Open source" or omit), `github`, `live`.

### 3. Required sections (in this order)

Use `##` for main sections and `###` for subsections. Separate major sections with `---`.

1. **Executive Summary**  
   One or two short paragraphs: what the system is, who uses it (roles), and what it delivers. You can name the product and describe it directly; no anonymization needed.

2. **Problem Statement and Goals**  
   - **Problem Statement:** Bullet list of 3–5 pain points (e.g. fragmented visibility, ad-hoc processes, manual coordination). Use bold labels and short explanations.
   - **Goals:** Bullet list of 3–5 goals (e.g. single source of truth, better UX, learning a new stack).

3. **System Architecture**  
   - **Application Architecture:** Table: Application | Path | Technology | Target Users. One short paragraph on how clients talk to the system (e.g. REST, JWT, WebSocket).
   - **Diagram:** Include a **mermaid** code block for the application/system architecture (e.g. clients, API, data stores). I will manually convert it to an image and add `system_design.png` under `public/case_study/<folder_name>/` when updating the case study in my portfolio.
   - **Deployment Architecture:** Table: Component | Technology | Hosting | Description (API, workers, DB, cache, storage, secrets, etc.).
   - **Network Architecture (if applicable):** Include a **mermaid** code block for the network/deployment topology. I will manually convert it to an image and add `network_architecture.png` under `public/case_study/<folder_name>/`.
   - **Supporting Components:** Table: Component | Purpose (e.g. third-party APIs, email, storage).

4. **System Design**  
   - **API Design:** Base path, auth (e.g. JWT Bearer), WebSocket if any. Table of API modules: Prefix | Module.
   - **Pattern:** One line on REST + controller/service layers and async workers if applicable.
   - **Authentication and Authorization:** Auth methods, tokens, roles, data scoping.
   - **Data Flow (High Level):** Request/response, real-time, files/exports in 2–3 short bullets.
   - **Key Backend Components:** Table: Component | Description (main app, workers, migrations, entities).

5. **Domain and Feature Summary**  
   Table: Area | Description. List 5–10 domain areas. End with one **Out of scope** line.

6. **Development and Operations**  
   - **Monorepo and Local Development:** High-level layout and which tools are used (e.g. Prisma, Jest). **Do not** include repository-specific details: no exact env var names, no exact CLI commands (e.g. `yarn dev`, `make migrate`), no exact file/folder paths (e.g. `src/**/__tests__/`). Keep it conceptual so the case study stays portable.
   - **CI:** Table: Workflow | Scope | Jobs. Omit if the project has no CI.
   - **CD:** How staging/production deploy (triggers, where secrets live). No step-by-step runbooks or exact commands.

7. **Summary**  
   One short paragraph: stack in one line, main capabilities, path from local dev to deployed environments. You may mention the GitHub repo or live demo URL here if not in frontmatter.

### 4. Formatting and style

- Use **Markdown tables** for all structured comparisons (apps, deployment, API modules, domain areas, CI workflows).
- Use **bullets** for problem statements, goals, and data flow.
- Use **bold** for the first part of a bullet (e.g. **Fragmented visibility:**) when listing problems or goals.
- **Do** include **mermaid** code blocks for the system architecture and network architecture diagrams; I will convert them to images and update the case study in my portfolio later.
- **No** internal links to private docs (e.g. `documentation/srs.md`); keep the case study self-contained. Public repo or live URLs are fine in frontmatter or Summary.
- **No repository-specific runbook details:** Do not include exact environment variable names, exact CLI commands, or exact file/folder paths. Describe tools and flow at a conceptual level so the case study stays portfolio-ready.
- Keep tone professional, technical, and concise.

### 5. Assets (for the portfolio repo)

- In the **portfolio** repo, assets live under `public/case_study/<folder_name>/`:
  - `thumbnail.png` — used in Work section cards (set in frontmatter).
  - `system_design.png` — application/system architecture diagram (I generate this by converting the mermaid diagram from the case study).
  - `network_architecture.png` — network/deployment diagram (optional; same, converted from mermaid).
- `<folder_name>` is usually a short, snake_case name for the project (e.g. `my_todo_api`). Use the same in image paths and in the frontmatter `thumbnail` path.

### 6. Output

- Produce a **single markdown file** whose content I can save as `content/case-studies/{slug}.md` in my portfolio repo.
- Ensure the slug (filename without `.md`) is a valid URL segment: lowercase, hyphens only, no spaces or special characters.

---

## Copy-paste prompt (for use in another project)

When you're in a **personal or non-client** project codebase and want to generate a new case study, paste this into Cursor:

```
Generate a portfolio case study in a single markdown file following the template and rules in PERSONAL_PROJECT_CASE_STUDY_PROMPT.md from my portfolio repo. Use the project/codebase in this workspace as the source of truth. This is a personal/non-client project: use the real project name, no NDA anonymization. Optional: add github and live URLs in frontmatter if the project has a public repo or live demo. Exclude repository-specific details in Development and Operations—keep that section conceptual (tools and flow only). Required sections: Executive Summary, Problem Statement and Goals, System Architecture (include mermaid code blocks for application/system diagram and for network architecture; I will convert them to images later), Deployment Architecture, System Design (API, auth, data flow, key components), Domain and Feature Summary, Development and Operations (monorepo, CI if any, CD), Summary. Frontmatter: title, shortDescription, tech (array), year, thumbnail path, optional client/github/live. Output only the markdown file content; I will save it as content/case-studies/{slug}.md in my portfolio.
```

Replace `{slug}` and `<folder_name>` with your chosen slug and asset folder name when you save the file and add images.

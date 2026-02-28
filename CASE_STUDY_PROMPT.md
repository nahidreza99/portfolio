# Portfolio Case Study — Master Prompt

Use this prompt in Cursor (or any LLM) when working on a different project to generate a **uniform, portfolio-ready case study** in Markdown. The output should be a single `.md` file that can be dropped into `content/case-studies/` and will render on the portfolio site with the same structure and NDA-safe wording.

**Reference example:** `content/case-studies/air-duct-cleaning-service.md` in this repo.

---

## Instructions for the AI

Generate a case study markdown file for my portfolio based on the project I’m describing or the docs you have in context. Follow these rules exactly.

### 1. NDA and anonymization

- **Do not** include: real product/project names, client names, vendor names, internal reference IDs (e.g. S00005), or links to internal docs (e.g. `documentation/ip-and-license.md`).
- **Do** use: a **generic, descriptive title** (e.g. "Air Duct Cleaning Service", "Inventory Management Platform") and, if needed, `client: Confidential` in frontmatter. Describe the domain in neutral terms (e.g. "an air duct cleaning and insulation company" instead of the actual company name).
- The case study should be safe to show publicly without revealing confidential identities.

### 2. File and frontmatter

- **Filename:** `{slug}.md` where `slug` is lowercase, hyphenated (e.g. `air-duct-cleaning-service.md`). The slug is used in the URL: `/work/{slug}`.
- **Frontmatter (YAML at the top):**

```yaml
---
title: <Generic project title, e.g. "Air Duct Cleaning Service">
shortDescription: <One sentence for portfolio cards: what it is and main tech.>
tech:
  - <Tech 1>
  - <Tech 2>
  # ... 5–12 items: frameworks, DB, infra, CI/CD
year: "<YYYY>"
thumbnail: /case_study/<folder_name>/thumbnail.png
client: Confidential
---
```

- **Required frontmatter fields:** `title`, `shortDescription`, `tech` (array), `year`, `thumbnail`, `client` (use `Confidential` or omit if not needed).
- **No** `reference` or internal IDs in frontmatter.

### 3. Required sections (in this order)

Use `##` for main sections and `###` for subsections. Separate major sections with `---`.

1. **Executive Summary**  
   One or two short paragraphs: what the system is, who uses it (roles), and what it delivers (self-service, oversight, audit, etc.). Use neutral, generic wording for the client/domain.

2. **Problem Statement and Goals**  
   - **Problem Statement:** Bullet list of 3–5 pain points (e.g. fragmented visibility, ad-hoc processes, manual coordination, audit gaps). Use bold labels and short explanations.
   - **Goals:** Bullet list of 3–5 goals (e.g. reduced turnaround, single source of truth, audit trail, adoption).

3. **System Architecture**  
   - **Application Architecture:** Table: Application | Path | Technology | Target Users. One short paragraph on how clients talk to the system (e.g. REST, JWT, WebSocket).
   - **Diagram:** Include a **mermaid** code block for the application/system architecture (e.g. clients, API, data stores). I will manually convert it to an image and add `system_design.png` under `public/case_study/<folder_name>/` when updating the case study in my portfolio.
   - **Deployment Architecture:** Table: Component | Technology | Hosting | Description (API, workers, DB, cache, storage, secrets, etc.).
   - **Network Architecture (if applicable):** Include a **mermaid** code block for the network/deployment topology (e.g. Internet, DNS, app hosting, VPC, RDS, etc.). I will manually convert it to an image and add `network_architecture.png` under `public/case_study/<folder_name>/` when updating the case study in my portfolio.
   - **Supporting Components:** Table: Component | Purpose (Lambda, Twilio, SES, FCM, APNs, Sentry, etc.).

4. **System Design**  
   - **API Design:** Base path, auth (e.g. JWT Bearer), WebSocket if any. Table of API modules: Prefix | Module.
   - **Pattern:** One line on REST + controller/service layers and async workers if applicable.
   - **Authentication and Authorization:** Auth methods, tokens, RBAC/roles, data scoping.
   - **Data Flow (High Level):** Request/response, real-time, files/exports in 2–3 short bullets.
   - **Key Backend Components:** Table: Component | Description (main app, workers, migrations, entities).

5. **Domain and Feature Summary**  
   Table: Area | Description. List 5–10 domain areas (e.g. user/org management, scheduling, fleet, request workflows, financial, resources, notifications). End with one **Out of scope** line (e.g. payroll, native mobile, etc.).

6. **Development and Operations**  
   - **Monorepo and Local Development:** High-level layout (e.g. “Edge Functions for production, Express for local dev”) and which tools are used (Prisma, Jest, etc.). **Do not** include repository-specific details: no exact env var names (e.g. `SUPABASE_DB_URL`), no exact CLI commands (e.g. `yarn dev`, `make migrate`), no exact file/folder paths (e.g. `src/**/__tests__/`, `apps/api`). Keep it conceptual so the case study stays portable.
   - **CI:** Table: Workflow | Scope | Jobs (e.g. ci-api, ci-web). Omit if the project has no CI.
   - **CD:** How staging/production deploy (triggers, where secrets live). No step-by-step runbooks or exact commands.

7. **Summary**  
   One short paragraph: production-grade, stack in one line, main capabilities, path from local dev to deployed environments.

### 4. Formatting and style

- Use **Markdown tables** for all structured comparisons (apps, deployment, API modules, domain areas, CI workflows).
- Use **bullets** for problem statements, goals, and data flow.
- Use **bold** for the first part of a bullet (e.g. **Fragmented visibility:**) when listing problems or goals.
- **Do** include **mermaid** code blocks for the system architecture and network architecture diagrams; I will convert them to images and update the case study in my portfolio later.
- **No** internal links (e.g. to `documentation/srs.md` or `apps/api/src/api.py`); keep the case study self-contained and portable.
- **No repository-specific runbook details:** Do not include exact environment variable names, exact CLI commands (e.g. `yarn test`, `make db-up`), or exact file/folder paths (e.g. `src/**/__tests__/`, `apps/api`). Describe tools and flow at a conceptual level (e.g. “schema and migrations are managed with Prisma”; “tests use Jest”) so the case study stays portfolio-ready and not tied to one repo layout.
- Keep tone professional, technical, and concise. Omit proprietary or confidential details.

### 5. Assets (for the portfolio repo)

- In the **portfolio** repo, assets live under `public/case_study/<folder_name>/`:
  - `thumbnail.png` — used in Work section cards (set in frontmatter).
  - `system_design.png` — application/system architecture diagram (I generate this by converting the mermaid diagram from the case study).
  - `network_architecture.png` — network/deployment diagram (optional; same, converted from mermaid).
- `<folder_name>` is usually a short, snake_case name for the project (e.g. `air_duct_cleaning`). Use the same in image paths and in the frontmatter `thumbnail` path.

### 6. Output

- Produce a **single markdown file** whose content I can save as `content/case-studies/{slug}.md` in my portfolio repo.
- Ensure the slug (filename without `.md`) is a valid URL segment: lowercase, hyphens only, no spaces or special characters.

---

## Copy-paste prompt (for use in another project)

When you're in a different codebase and want to generate a new case study, you can paste this into Cursor:

```
Generate a portfolio case study in a single markdown file following the template and rules in CASE_STUDY_PROMPT.md from my portfolio repo. Use the project/codebase in this workspace as the source of truth. Apply NDA anonymization: no real project name, client, vendor, or reference IDs; use a generic descriptive title and "Confidential" for client. Exclude repository-specific details: no exact env vars, CLI commands, or file paths in Development and Operations—keep that section conceptual (tools and flow only). Required sections: Executive Summary, Problem Statement and Goals, System Architecture (include mermaid code blocks for application/system diagram and for network architecture; I will convert them to images later), Deployment Architecture, System Design (API, auth, data flow, key components), Domain and Feature Summary, Development and Operations (monorepo, CI if any, CD), Summary. Frontmatter: title, shortDescription, tech (array), year, thumbnail path, client. Output only the markdown file content; I will save it as content/case-studies/{slug}.md in my portfolio.
```

Replace `{slug}` and `<folder_name>` with your chosen slug and asset folder name when you save the file and add images.

# NotebookLM MCP — Guide for Antigravity

This guide covers how to use the `notebooklm-mcp` server inside Google Antigravity IDE, including quick-start prompts and a full tool glossary.

---

What the MCP is and the caveat about undocumented APIs
- 4 alternative MCP packages with links, in case you ever want to switch
- Re-authentication instructions for when cookies expire
- 8 quick-start prompts for the most common workflows
- Full glossary of all 38 tools, grouped by category

## What Is This?

The NotebookLM MCP server connects Antigravity directly to your Google NotebookLM account. Instead of switching tabs, you can create notebooks, add sources, query your knowledge base, and generate content (audio overviews, study guides, etc.) all through natural language inside Antigravity.

> **Important:** This MCP uses undocumented internal Google APIs. It may occasionally break if Google updates NotebookLM. Treat it as personal/experimental tooling and use a dedicated Google account if you're cautious.

---

## Other NotebookLM MCP Options

If you ever want to try alternatives to the `jacob-bd` package you installed:

| Project | Description | Link |
|---|---|---|
| **notebooklm-mcp-cli** *(what you have)* | CLI + MCP, 38 tools, most feature-complete | [github.com/jacob-bd/notebooklm-mcp-cli](https://github.com/jacob-bd/notebooklm-mcp-cli) |
| **PleasePrompto/notebooklm-mcp** | Browser automation via Chrome, zero-hallucination focus | [github.com/PleasePrompto/notebooklm-mcp](https://github.com/PleasePrompto/notebooklm-mcp) |
| **khengyun/notebooklm-mcp** | Selenium-based, supports HTTP REST transport | [github.com/khengyun/notebooklm-mcp](https://github.com/khengyun/notebooklm-mcp) |
| **mukundajmera/notebooklm-mcp** | Node.js + Python packages, Playwright-based | [github.com/mukundajmera/notebooklm-mcp](https://github.com/mukundajmera/notebooklm-mcp) |

---

## Authentication

Cookies expire every **2–4 weeks**. When NotebookLM stops responding, re-authenticate from your terminal:

```bash
nlm login
```

Then restart Antigravity or hit **Refresh** in Settings → Customizations.

---

## Quick Start

These are the most useful things to do first. Just type these as prompts in Antigravity:

### 1. See your notebooks
```
List all my NotebookLM notebooks
```

### 2. Ask a question against a notebook
```
Ask my [notebook name] notebook: what are the key themes?
```

### 3. Create a new notebook and add a source
```
Create a new notebook called "Research" and add this URL as a source: https://example.com/article
```

### 4. Add a YouTube video to a notebook
```
Add this YouTube video to my [notebook name] notebook: https://youtube.com/watch?v=...
```

### 5. Generate an audio overview (podcast)
```
Create an audio overview of my [notebook name] notebook in deep dive format
```

Then poll for completion:
```
Check the status of the audio overview for my [notebook name] notebook
```

### 6. Run web research and import sources
```
Do web research on "enterprise AI trends 2025" and import the top 5 sources into a new notebook
```

### 7. Query across multiple notebooks
```
Search across all my notebooks for anything related to [topic]
```

### 8. Generate a briefing document
```
Generate a briefing doc from my [notebook name] notebook
```

---

## Full Tool Glossary

### Authentication & Session

| Tool | What it does |
|---|---|
| `refresh_auth` | Re-authenticates with Google — call this if requests start failing |
| `save_auth_tokens` | Saves current session cookies to disk for persistence |
| `server_info` | Returns info about the running MCP server instance |

### Notebooks

| Tool | What it does |
|---|---|
| `notebook_list` | Lists all notebooks in your NotebookLM account |
| `notebook_get` | Gets details about a specific notebook by ID or name |
| `notebook_describe` | Returns an AI-generated description/summary of a notebook |
| `notebook_create` | Creates a new empty notebook with a given title |
| `notebook_rename` | Renames an existing notebook |
| `notebook_delete` | Permanently deletes a notebook |

### Querying & Chat

| Tool | What it does |
|---|---|
| `notebook_query` | Sends a question to a notebook and returns an answer grounded in its sources |
| `notebook_query_start` | Starts an async query (for long-running questions) |
| `notebook_query_status` | Checks the status/result of an async query started with `notebook_query_start` |
| `cross_notebook_query` | Queries across multiple notebooks at once |
| `chat_configure` | Configures chat behaviour — e.g. response length, style (learning guide, etc.) |
| `batch` | Runs multiple tool calls in a single request — useful for bulk operations |

### Sources

| Tool | What it does |
|---|---|
| `source_add` | Adds a source to a notebook — supports URLs, YouTube links, Google Drive files, or pasted text |
| `source_list_drive` | Lists available Google Drive files that can be added as sources |
| `source_sync_drive` | Syncs Google Drive sources that have become stale/outdated |
| `source_rename` | Renames a source within a notebook |
| `source_delete` | Removes a source from a notebook |
| `source_describe` | Returns a description of what a specific source contains |
| `source_get_content` | Retrieves the raw content of a source |

### Studio (Content Generation)

| Tool | What it does |
|---|---|
| `studio_create` | Generates studio content from a notebook — audio overviews, video explainers, briefing docs, study guides, flashcards, mind maps, infographics, slide decks, timelines, and more |
| `studio_status` | Checks the generation status of a studio artifact (generation takes time) |
| `studio_delete` | Deletes a generated studio artifact |
| `studio_revise` | Revises/regenerates a studio artifact with updated instructions |
| `download_artifact` | Downloads a completed artifact (e.g. the audio file for a podcast) — use after `studio_status` confirms it's ready |
| `export_artifact` | Exports an artifact in a specific format |

### Research

| Tool | What it does |
|---|---|
| `research_start` | Starts a web or Google Drive research session on a topic and finds sources |
| `research_status` | Checks the status of a running research job |
| `research_import` | Imports sources found during a research session into a notebook |

### Sharing

| Tool | What it does |
|---|---|
| `notebook_share_status` | Shows current sharing settings for a notebook |
| `notebook_share_public` | Makes a notebook publicly accessible via a shareable link |
| `notebook_share_invite` | Invites a specific person (by email) as a viewer or editor |
| `notebook_share_batch` | Invites multiple people to a notebook at once |

### Utilities

| Tool | What it does |
|---|---|
| `note` | Adds a text note directly to a notebook (separate from sources) |
| `pipeline` | Chains multiple operations together in sequence |
| `tag` | Adds tags to a notebook for organisation |

---

## Tips

- **Disable when not in use.** The MCP loads 38 tools into context. Toggle it off in Settings when you're not doing NotebookLM work to keep your context window clean. In Antigravity you can toggle it directly from the Settings → Customizations panel.
- **Poll studio jobs.** Audio and video generation takes 1–5 minutes. After calling `studio_create`, ask Antigravity to check `studio_status` every minute until it's ready, then `download_artifact` to get the file.
- **Use a dedicated Google account.** Since this uses browser automation under the hood, Google may occasionally flag it. A secondary account keeps your primary safe.
- **Free tier limit.** You get roughly 50 queries/day on the free NotebookLM tier.
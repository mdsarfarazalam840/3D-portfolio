# Graph Report - .  (2026-05-09)

## Corpus Check
- 78 files · ~99,378 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 258 nodes · 333 edges · 29 communities detected
- Extraction: 93% EXTRACTED · 6% INFERRED · 1% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Portfolio UI System|Portfolio UI System]]
- [[_COMMUNITY_Caveman Skill Framework|Caveman Skill Framework]]
- [[_COMMUNITY_Compress Scripts|Compress Scripts]]
- [[_COMMUNITY_Hook Ecosystem|Hook Ecosystem]]
- [[_COMMUNITY_Validation Pipeline|Validation Pipeline]]
- [[_COMMUNITY_Agent Distribution Network|Agent Distribution Network]]
- [[_COMMUNITY_Verification Infrastructure|Verification Infrastructure]]
- [[_COMMUNITY_Benchmark Runner|Benchmark Runner]]
- [[_COMMUNITY_Compression Workflow|Compression Workflow]]
- [[_COMMUNITY_Hook Tests|Hook Tests]]
- [[_COMMUNITY_Evals Framework|Evals Framework]]
- [[_COMMUNITY_Measure Script|Measure Script]]
- [[_COMMUNITY_LLM Run Harness|LLM Run Harness]]
- [[_COMMUNITY_Plot Script|Plot Script]]
- [[_COMMUNITY_Config Hook|Config Hook]]
- [[_COMMUNITY_Eval Shared Data|Eval Shared Data]]
- [[_COMMUNITY_Taskflow Backend|Taskflow Backend]]
- [[_COMMUNITY_Live Data Generator|Live Data Generator]]
- [[_COMMUNITY_Vite Migration|Vite Migration]]
- [[_COMMUNITY_Benchmark Definition|Benchmark Definition]]
- [[_COMMUNITY_Assets|Assets]]
- [[_COMMUNITY_Compress Init|Compress Init]]
- [[_COMMUNITY_Payload Diff Demo|Payload Diff Demo]]
- [[_COMMUNITY_Todo List|Todo List]]
- [[_COMMUNITY_N+1 Problem|N+1 Problem]]
- [[_COMMUNITY_JWT Refresh|JWT Refresh]]
- [[_COMMUNITY_Brevity Paper|Brevity Paper]]
- [[_COMMUNITY_Default Mode|Default Mode]]
- [[_COMMUNITY_Portfolio Image|Portfolio Image]]

## God Nodes (most connected - your core abstractions)
1. `Caveman AI Communication Tool` - 15 edges
2. `Caveman Skill` - 14 edges
3. `App Component` - 13 edges
4. `main()` - 10 edges
5. `validate()` - 8 edges
6. `ensure()` - 8 edges
7. `section()` - 7 edges
8. `detect_file_type()` - 6 edges
9. `HookScriptTests` - 6 edges
10. `Caveman Evals Framework` - 6 edges

## Surprising Connections (you probably didn't know these)
- `App Component` --conceptually_related_to--> `Design System Document`  [INFERRED]
  src/App.tsx → DESIGN.md
- `Caveman Logo SVG` --shares_data_with--> `SRE Sarfaraz Resume`  [AMBIGUOUS]
  caveman/plugins/caveman/assets/caveman.svg → SRE-Sarfaraz.pdf
- `Webpack to Vite Migration` --rationale_for--> `Vite Configuration`  [EXTRACTED]
  caveman/tests/caveman-compress/todo-list.md → vite.config.ts
- `Vite Configuration` --conceptually_related_to--> `Static Preview Server`  [INFERRED]
  vite.config.ts → serve-preview.mjs
- `Caveman Skill` --conceptually_related_to--> `Caveman Commit Skill`  [INFERRED]
  caveman/skills/caveman/SKILL.md → caveman/skills/caveman-commit/SKILL.md

## Hyperedges (group relationships)
- **Animation System** — GSAP, ScrollTrigger, Lenis [EXTRACTED 1.00]
- **Live Data Integration** — App, Live_GitHub_Widget, GitHubCalendar [EXTRACTED 1.00]
- **Hero Visual System** — App, HeroScene, Custom_Cursor, Particle_Canvas [INFERRED 0.85]
- **Agent Distribution Network** — caveman, Claude_Code, Codex, Gemini_CLI, Cursor, Windsurf, Cline, Copilot, npx_skills [EXTRACTED 1.00]
- **Caveman Session Lifecycle Hook Chain** — caveman_activate_hook, caveman_mode_tracker_hook, caveman_statusline_script, caveman_flag_file [EXTRACTED 1.00]
- **Caveman Evals Three Arms Design** — evals_baseline_arm, evals_terse_arm, evals_skill_arm [EXTRACTED 1.00]
- **All Caveman Intensity Modes** — caveman_lite_mode, caveman_full_mode, caveman_ultra_mode, caveman_wenyan_lite_mode, caveman_wenyan_full_mode, caveman_wenyan_ultra_mode [EXTRACTED 1.00]
- **Full Caveman Skill Suite** — caveman_main_skill, caveman_commit_skill, caveman_review_skill, caveman_compress_skill, caveman_help_skill [EXTRACTED 1.00]
- **Caveman hooks ecosystem** — caveman_activate_js, caveman_mode_tracker_js, caveman_config_js, caveman_statusline_ps1, cavern_active_flag, settings_json [EXTRACTED 1.00]
- **Hook lifecycle management** — install_ps1, uninstall_ps1, caveman_activate_js, caveman_mode_tracker_js, cavern_active_flag [EXTRACTED 1.00]
- **Compression pipeline** — detect_py, compress_py, validate_py, should_compress, validate_function, extract_code_blocks [EXTRACTED 1.00]
- **Compress CLI integration** — cli_py, detect_py, compress_py [EXTRACTED 1.00]
- **Eval shared data** — measure_py, plot_py, snapshots_results_json [EXTRACTED 1.00]
- **Verification infrastructure** — verify_repo_py, test_hooks_py, caveman_activate_js, caveman_mode_tracker_js, caveman_config_js, validate_function, detect_file_type [EXTRACTED 1.00]
- **Caveman Compression Workflow** — compress, detect, validate, compress-cli, benchmark [EXTRACTED 1.00]
- **Taskflow Backend Architecture** — BullMQ, DashboardN1Problem, JWTRefreshTokens, SQLInjectionVulnerability [EXTRACTED 1.00]
- **Sprint 24 Active Tasks** — TF-456, TF-489, TF-445 [EXTRACTED 1.00]

## Communities (41 total, 11 thin omitted)

### Community 0 - "Portfolio UI System"
Cohesion: 0.07
Nodes (25): App Component, Azure AKS Platform, Command Palette Pattern, Custom Cursor System, Design System Document, GSAP Animation Library, react-github-calendar, HeroScene Component (+17 more)

### Community 1 - "Caveman Skill Framework"
Cohesion: 0.08
Nodes (27): Caveman Activate Hook, Caveman Commit Skill, Caveman Compress Skill, Caveman Docs Landing Page, Caveman Flag File, Caveman Full Mode, Caveman Help Skill, Caveman Lite Mode (+19 more)

### Community 2 - "Compress Scripts"
Cohesion: 0.13
Nodes (19): RuntimeError, main(), print_usage(), build_compress_prompt(), build_fix_prompt(), call_claude(), compress_file(), Strip outer ```markdown ... ``` fence when it wraps the entire output. (+11 more)

### Community 3 - "Hook Ecosystem"
Cohesion: 0.2
Nodes (8): .caveman-active flag file, compress_file function, detect_file_type function, extract_code_blocks function, Claude Code settings.json, should_compress function, caveman SKILL.md, validate function

### Community 4 - "Validation Pipeline"
Cohesion: 0.23
Nodes (14): count_bullets(), extract_code_blocks(), extract_headings(), extract_paths(), extract_urls(), Line-based fenced code block extractor.      Handles ``` and ~~~ fences with v, read_file(), validate() (+6 more)

### Community 5 - "Agent Distribution Network"
Cohesion: 0.13
Nodes (16): Caveman Hook System, Claude Code, Cline, Codex, GitHub Copilot, Cursor IDE, Gemini CLI, Windsurf IDE (+8 more)

### Community 6 - "Verification Infrastructure"
Cohesion: 0.36
Nodes (12): CheckFailure, ensure(), load_compress_modules(), read_json(), run(), section(), verify_compress_cli(), verify_compress_fixtures() (+4 more)

### Community 7 - "Benchmark Runner"
Cohesion: 0.29
Nodes (12): call_api(), compute_stats(), dry_run(), format_prompt_label(), format_table(), load_caveman_system(), load_prompts(), main() (+4 more)

### Community 8 - "Compression Workflow"
Cohesion: 0.29
Nodes (11): Compression Benchmark, Compression Orchestrator, Compress CLI, Compress Main Entry, Caveman Compress Scripts, File Type Detector, benchmark_pair(), count_tokens() (+3 more)

### Community 10 - "Evals Framework"
Cohesion: 0.29
Nodes (7): Caveman Evals Framework, Evals Baseline Arm, Evals Skill Arm, Evals Terse Arm, Measure Script, Prompts Test Set, Tiktoken Tokenizer

### Community 11 - "Measure Script"
Cohesion: 0.53
Nodes (5): count(), fmt_pct(), main(), Read evals/snapshots/results.json (produced by llm_run.py) and report real toke, stats()

### Community 12 - "LLM Run Harness"
Cohesion: 0.6
Nodes (4): claude_version(), main(), Run each prompt through Claude Code in three conditions and snapshot the real L, run_claude()

### Community 13 - "Plot Script"
Cohesion: 0.67
Nodes (3): count(), main(), Generate a boxplot showing the distribution of token compression per skill, com

### Community 14 - "Config Hook"
Cohesion: 0.83
Nodes (3): getConfigDir(), getConfigPath(), getDefaultMode()

### Community 16 - "Taskflow Backend"
Cohesion: 0.5
Nodes (4): BullMQ Background Job Processing, SQL Injection Vulnerability, Taskflow Project Notes, shadcn/ui with Radix Primitives

### Community 19 - "Vite Migration"
Cohesion: 0.67
Nodes (3): Webpack to Vite Migration, Static Preview Server, Vite Configuration

### Community 20 - "Benchmark Definition"
Cohesion: 0.67
Nodes (3): Caveman Benchmark Runner, Caveman Skill Definition, LLM Evaluation Harness

### Community 21 - "Assets"
Cohesion: 0.67
Nodes (3): SRE Sarfaraz Resume, Caveman Logo SVG, Caveman Logo Small SVG

## Ambiguous Edges - Review These
- `generate-live-data.mjs` → `results.json snapshot`  [AMBIGUOUS]
  scripts/generate-live-data.mjs · relation: conceptually_related_to
- `Caveman Logo SVG` → `SRE Sarfaraz Resume`  [AMBIGUOUS]
  caveman/plugins/caveman/assets/caveman.svg · relation: shares_data_with

## Knowledge Gaps
- **78 isolated node(s):** `Strip outer ```markdown ... ``` fence when it wraps the entire output.`, `Check if a line looks like code.`, `Check if content is valid JSON.`, `Heuristic: check if content looks like YAML.`, `Classify a file as 'natural_language', 'code', 'config', or 'unknown'.      Re` (+73 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `generate-live-data.mjs` and `results.json snapshot`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Caveman Logo SVG` and `SRE Sarfaraz Resume`?**
  _Edge tagged AMBIGUOUS (relation: shares_data_with) - confidence is low._
- **Are the 6 inferred relationships involving `Caveman Skill` (e.g. with `Caveman Commit Skill` and `Caveman Review Skill`) actually correct?**
  _`Caveman Skill` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `App Component` (e.g. with `Live GitHub Widget` and `Custom Cursor System`) actually correct?**
  _`App Component` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Strip outer ```markdown ... ``` fence when it wraps the entire output.`, `Check if a line looks like code.`, `Check if content is valid JSON.` to the rest of the system?**
  _78 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Portfolio UI System` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Caveman Skill Framework` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
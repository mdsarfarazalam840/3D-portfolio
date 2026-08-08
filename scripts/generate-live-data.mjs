import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const githubUsername = "mdsarfarazalam840";
const spotifyWidgetUrl =
  "https://spotify-recently-played-readme.vercel.app/api?user=oj1xerhb9fby7dckdhp0yw3no&unique=true";
const spotifyProfileUrl = "https://open.spotify.com/user/oj1xerhb9fby7dckdhp0yw3no";
const outputPath = resolve("public/generated/live-data.json");

const githubToken = process.env.GITHUB_TOKEN?.trim();

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "3d-portfolio-live-data-generator",
  ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
};

const fallbackPayload = {
  generatedAt: new Date().toISOString(),
  github: {
    latestPush: null,
    latestCommit: null,
    profileUrl: `https://github.com/${githubUsername}`,
  },
  projects: [],
  spotify: {
    widgetUrl: spotifyWidgetUrl,
    profileUrl: spotifyProfileUrl,
  },
};

function titleCase(value) {
  return value
    .split(/[\s/]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function prettifyRepoName(name) {
  return titleCase(name.replace(/[-_]+/g, " "));
}

function buildStack(repo) {
  const parts = [];

  if (repo.language) {
    parts.push(repo.language);
  }

  for (const topic of repo.topics ?? []) {
    if (parts.length >= 5) break;
    const label = titleCase(topic.replace(/[-_]+/g, " "));
    if (label && !parts.some((part) => part.toLowerCase() === label.toLowerCase())) {
      parts.push(label);
    }
  }

  return parts.length > 0 ? parts.join(" / ") : "Code";
}

async function fetchProjects() {
  const projects = [];
  const maxPages = 5;

  for (let page = 1; page <= maxPages; page += 1) {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=pushed&per_page=100&page=${page}&type=owner`,
      { headers: githubHeaders },
    );

    if (!response.ok) {
      throw new Error(`GitHub repos request failed: ${response.status}`);
    }

    const repos = await response.json();

    for (const repo of repos) {
      if (repo.fork || repo.archived) continue;

      projects.push({
        title: prettifyRepoName(repo.name),
        impact: repo.description?.trim() || `${repo.language ?? "Software"} project on GitHub.`,
        stack: buildStack(repo),
        href: repo.html_url,
      });
    }

    if (repos.length < 100) break;
  }

  return projects;
}

async function fetchGithubActivity() {
  const repoResponse = await fetch(
    `https://api.github.com/users/${githubUsername}/repos?sort=pushed&per_page=6&type=owner`,
    {
      headers: githubHeaders,
    },
  );

  if (!repoResponse.ok) {
    throw new Error(`GitHub repos request failed: ${repoResponse.status}`);
  }

  const repos = await repoResponse.json();
  const targetRepo = repos.find((repo) => !repo.fork) ?? repos[0];

  if (!targetRepo) {
    throw new Error("No GitHub repos found");
  }

  const commitsResponse = await fetch(`https://api.github.com/repos/${targetRepo.full_name}/commits?per_page=2`, {
    headers: githubHeaders,
  });

  if (!commitsResponse.ok) {
    throw new Error(`GitHub commits request failed: ${commitsResponse.status}`);
  }

  const commits = await commitsResponse.json();
  const latestCommit = commits[0];
  const previousCommit = commits[1] ?? commits[0];

  return {
    latestPush: {
      repo: targetRepo.full_name,
      message: latestCommit?.commit?.message?.split("\n")[0] ?? "Recent push",
      pushedAt: targetRepo.pushed_at,
      commitUrl: latestCommit?.html_url ?? targetRepo.html_url,
      repoUrl: targetRepo.html_url,
    },
    latestCommit: {
      repo: targetRepo.full_name,
      message: previousCommit?.commit?.message?.split("\n")[0] ?? "Latest commit",
      pushedAt: previousCommit?.commit?.committer?.date ?? targetRepo.pushed_at,
      commitUrl: previousCommit?.html_url ?? targetRepo.html_url,
      repoUrl: targetRepo.html_url,
    },
    profileUrl: `https://github.com/${githubUsername}`,
  };
}

async function main() {
  let github = fallbackPayload.github;
  let projects = fallbackPayload.projects;

  try {
    github = await fetchGithubActivity();
  } catch (error) {
    console.warn("live-data-generator github activity fallback:", error instanceof Error ? error.message : String(error));
  }

  try {
    projects = await fetchProjects();
  } catch (error) {
    console.warn("live-data-generator projects fallback:", error instanceof Error ? error.message : String(error));
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    github,
    projects,
    spotify: {
      widgetUrl: spotifyWidgetUrl,
      profileUrl: spotifyProfileUrl,
    },
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`live-data-generator wrote ${outputPath}`);
}

await main();

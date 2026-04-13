import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const githubUsername = "mdsarfarazalam840";
const spotifyWidgetUrl =
  "https://spotify-recently-played-readme.vercel.app/api?user=oj1xerhb9fby7dckdhp0yw3no&unique=true";
const spotifyProfileUrl = "https://open.spotify.com/user/oj1xerhb9fby7dckdhp0yw3no";
const outputPath = resolve("public/generated/live-data.json");

const fallbackPayload = {
  generatedAt: new Date().toISOString(),
  github: {
    latestPush: null,
    latestCommit: null,
    profileUrl: `https://github.com/${githubUsername}`,
  },
  spotify: {
    widgetUrl: spotifyWidgetUrl,
    profileUrl: spotifyProfileUrl,
  },
};

async function fetchGithubActivity() {
  const repoResponse = await fetch(
    `https://api.github.com/users/${githubUsername}/repos?sort=pushed&per_page=6&type=owner`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "3d-portfolio-live-data-generator",
      },
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
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "3d-portfolio-live-data-generator",
    },
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
  let payload = fallbackPayload;

  try {
    payload = {
      generatedAt: new Date().toISOString(),
      github: await fetchGithubActivity(),
      spotify: {
        widgetUrl: spotifyWidgetUrl,
        profileUrl: spotifyProfileUrl,
      },
    };
  } catch (error) {
    console.warn("live-data-generator fallback:", error instanceof Error ? error.message : String(error));
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`live-data-generator wrote ${outputPath}`);
}

await main();

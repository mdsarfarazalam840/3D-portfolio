# Implement Spotify "Last played" Live Audio Signal

## Problem

The Spotify widget in the "Live signal" section shows **no songs** because:
1. The third-party SVG service (`spotify-recently-played-readme.vercel.app`) returns "No Data"
2. There's no actual Spotify API integration — just a static `<img>` embed
3. The env var `VITE_SPOTIFY_NOW_PLAYING_URL` exists but is unused

## Goal

Replace the broken image widget with proper recently played tracks showing:
- Album art (60×60)
- Song title
- Artist name
- Relative timestamp ("2 hours ago")
- Link to track on Spotify

## Prerequisites

### 1. Spotify App Credentials (already created)

| Key | Value |
|-----|-------|
| Client ID | `249de3badf094d5fa87c306841a76b0b` |
| Client Secret | `86117e444d37431b8c575d54644f5a5b` |

### 2. Generate a Refresh Token

Spotify's API uses OAuth Authorization Code flow. The refresh token lets the Worker get access tokens without user interaction.

**Steps:**

1. Build this authorization URL (replace `YOUR_CLIENT_ID`):

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:8787/callback&scope=user-read-recently-played,user-read-currently-playing&show_dialog=true
```

2. Visit the URL in a browser → log in to Spotify → authorize the app
3. You'll be redirected to `http://localhost:8787/callback?code=...`
4. Exchange the code for tokens via:

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=CODE_FROM_REDIRECT" \
  -d "redirect_uri=http://localhost:8787/callback" \
  -d "client_id=249de3badf094d5fa87c306841a76b0b" \
  -d "client_secret=86117e444d37431b8c575d54644f5a5b"
```

5. Save the `refresh_token` from the response — it's needed in the Worker secrets.

### 3. Cloudflare Account

You need a Cloudflare account to deploy the Worker. Sign up at https://dash.cloudflare.com if you don't have one.

---

## Implementation

### Step 1: Create Cloudflare Worker

**File: `workers/spotify-proxy/wrangler.jsonc`**

```jsonc
{
  "name": "spotify-proxy",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01",
  "vars": {
    "SPOTIFY_CLIENT_ID": "249de3badf094d5fa87c306841a76b0b",
    "SPOTIFY_CLIENT_SECRET": "86117e444d37431b8c575d54644f5a5b"
  },
  "secrets": {
    "SPOTIFY_REFRESH_TOKEN": "<set via wrangler secret>"
  }
}
```

**File: `workers/spotify-proxy/src/index.ts`**

```ts
export interface Env {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REFRESH_TOKEN: string;
}

interface SpotifyTrack {
  title: string;
  artist: string;
  albumArt: string;
  playedAt: string;
  url: string;
}

interface SpotifyResponse {
  tracks: SpotifyTrack[];
  nowPlaying: SpotifyTrack | null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,OPTIONS" },
      });
    }

    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    const corsHeaders = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

    try {
      // 1. Get access token
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: env.SPOTIFY_REFRESH_TOKEN,
          client_id: env.SPOTIFY_CLIENT_ID,
          client_secret: env.SPOTIFY_CLIENT_SECRET,
        }),
      });

      if (!tokenRes.ok) {
        return new Response(JSON.stringify({ error: "Token refresh failed" }), { status: 502, headers: corsHeaders });
      }

      const { access_token } = (await tokenRes.json()) as { access_token: string };

      // 2. Fetch currently playing
      let nowPlaying: SpotifyTrack | null = null;
      const nowRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (nowRes.status === 200) {
        const nowData = (await nowRes.json()) as {
          item?: { name: string; artists: { name: string }[]; album: { images: { url: string }[] }; external_urls: { spotify: string } };
          is_playing: boolean;
        };
        if (nowData.item) {
          nowPlaying = {
            title: nowData.item.name,
            artist: nowData.item.artists.map((a) => a.name).join(", "),
            albumArt: nowData.item.album.images[1]?.url ?? nowData.item.album.images[0]?.url ?? "",
            playedAt: "now",
            url: nowData.item.external_urls.spotify,
          };
        }
      }

      // 3. Fetch recently played
      const recentRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=10", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!recentRes.ok) {
        return new Response(JSON.stringify({ error: "Recently played fetch failed" }), { status: 502, headers: corsHeaders });
      }

      const recentData = (await recentRes.json()) as {
        items: Array<{
          track: {
            name: string;
            artists: { name: string }[];
            album: { images: { url: string }[] };
            external_urls: { spotify: string };
          };
          played_at: string;
        }>;
      };

      const tracks: SpotifyTrack[] = recentData.items.map((item) => ({
        title: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(", "),
        albumArt: item.track.album.images[1]?.url ?? item.track.album.images[0]?.url ?? "",
        playedAt: item.played_at,
        url: item.track.external_urls.spotify,
      }));

      return new Response(JSON.stringify({ tracks, nowPlaying }), { headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
    }
  },
};
```

**Deploy:**
```bash
cd workers/spotify-proxy
npm create cloudflare@latest -- spotify-proxy --type=hello-world
# copy the src/index.ts above
npx wrangler secret put SPOTIFY_REFRESH_TOKEN
npx wrangler deploy
```

### Step 2: Update Frontend — `src/App.tsx`

**Add imports** (at top):
```ts
type SpotifyTrack = {
  title: string;
  artist: string;
  albumArt: string;
  playedAt: string;
  url: string;
};
```

**Add state** (near other useState calls):
```ts
const [spotifyTracks, setSpotifyTracks] = useState<SpotifyTrack[]>([]);
const [spotifyNowPlaying, setSpotifyNowPlaying] = useState<SpotifyTrack | null>(null);
const [spotifyError, setSpotifyError] = useState(false);
```

**Add fetch function** inside the useEffect (near `loadGithub`):
```ts
const loadSpotify = async () => {
  try {
    const endpoint = import.meta.env.VITE_SPOTIFY_NOW_PLAYING_URL?.trim();
    if (!endpoint) return;

    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) throw new Error("Spotify fetch failed");

    const data = (await res.json()) as { tracks: SpotifyTrack[]; nowPlaying: SpotifyTrack | null };
    if (!cancelled) {
      setSpotifyTracks(data.tracks);
      setSpotifyNowPlaying(data.nowPlaying);
      setSpotifyError(false);
    }
  } catch (err) {
    console.warn("Spotify fetch failed:", err);
    if (!cancelled) setSpotifyError(true);
  }
};
```

**Call it** alongside `loadGithub()`:
```ts
void loadGithub();
void loadSpotify();
```

**Add interval** (inside the same setInterval or a new one):
```ts
const spotifyInterval = window.setInterval(() => {
  void loadSpotify();
}, 60000);
```

**Clean up** in the return:
```ts
window.clearInterval(spotifyInterval);
```

**Replace the Spotify card content** (lines 1295–1310):
```tsx
{item.content === "spotify" && (
  <div className="spotify-widget spotify-widget--futuristic">
    <span className="spotify-widget__glow" aria-hidden="true" />
    <span className="spotify-widget__grid" aria-hidden="true" />
    <span className="spotify-widget__orbit" aria-hidden="true" />
    <div className="spotify-widget__chrome">
      <span className="spotify-pill">
        {spotifyNowPlaying ? "Now playing" : "Live audio signal"}
      </span>
    </div>
    <div className="spotify-tracklist">
      {spotifyNowPlaying && (
        <a className="spotify-entry spotify-entry--now" href={spotifyNowPlaying.url} target="_blank" rel="noopener noreferrer">
          {spotifyNowPlaying.albumArt ? (
            <img src={spotifyNowPlaying.albumArt} alt="" loading="lazy" />
          ) : (
            <span className="album-fallback">♪</span>
          )}
          <div>
            <strong>{spotifyNowPlaying.title}</strong>
            <small>{spotifyNowPlaying.artist}</small>
            <p>Now playing</p>
          </div>
        </a>
      )}
      {spotifyError ? (
        <div className="live-empty">Spotify data unavailable.</div>
      ) : spotifyTracks.length === 0 && !spotifyNowPlaying ? (
        <div className="live-empty">No recently played tracks.</div>
      ) : (
        spotifyTracks.map((track, i) => (
          <a
            key={`${track.url}-${i}`}
            className="spotify-entry"
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {track.albumArt ? (
              <img src={track.albumArt} alt="" loading="lazy" />
            ) : (
              <span className="album-fallback">♪</span>
            )}
            <div>
              <strong>{track.title}</strong>
              <small>{track.artist}</small>
              <p>{formatRelativeTime(track.playedAt)}</p>
            </div>
          </a>
        ))
      )}
    </div>
  </div>
)}
```

### Step 3: Update CSS — `src/styles.css`

Add after `.spotify-widget--futuristic` block (around line 1260):

```css
.spotify-tracklist {
  position: relative;
  z-index: 2;
  display: grid;
  gap: var(--spacing-micro);
  padding: var(--spacing-compact);
  max-height: 22rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
}

.spotify-tracklist::-webkit-scrollbar {
  width: 4px;
}

.spotify-tracklist::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

.spotify-entry {
  display: grid;
  grid-template-columns: 60px minmax(0, 1fr);
  align-items: center;
  gap: var(--spacing-standard);
  padding: var(--spacing-compact);
  border-radius: var(--radius-sm);
  transition: background 180ms ease, transform 180ms ease;
  text-decoration: none;
  color: inherit;
}

.spotify-entry:hover {
  background: rgba(255, 255, 255, 0.04);
  transform: translateX(4px);
}

.spotify-entry--now {
  background: rgba(29, 185, 84, 0.06);
  border: 1px solid rgba(29, 185, 84, 0.12);
  margin-bottom: var(--spacing-compact);
}

.spotify-entry img,
.album-fallback {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.spotify-entry strong {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spotify-entry small {
  font-size: 12px;
  color: var(--text-secondary);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spotify-entry p {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--text-secondary);
}
```

### Step 4: Update `.env.local`

```
VITE_SPOTIFY_NOW_PLAYING_URL=https://spotify-proxy.YOUR-ACCOUNT.workers.dev
```

### Step 5: Playwright Test

**File: `tests/spotify.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("Spotify card shows recently played tracks", async ({ page }) => {
  await page.goto("/");

  // Scroll to the Live signal section
  await page.getByText("Live signal.").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Check the Spotify card exists
  const spotifyCard = page.locator(".live-card--spotify");
  await expect(spotifyCard).toBeVisible();

  // Check it has a heading "Last played"
  await expect(spotifyCard.locator(".live-card__head span")).toContainText("Last played");

  // Wait for tracks to load
  await page.waitForTimeout(2000);

  // Should show either tracks or a fallback message (not a broken image)
  const hasTracks = await spotifyCard.locator(".spotify-entry").count();
  const hasFallback = await spotifyCard.locator(".live-empty").count();
  expect(hasTracks + hasFallback).toBeGreaterThan(0);

  // If tracks exist, verify each has album art, title, artist
  if (hasTracks > 0) {
    const firstTrack = spotifyCard.locator(".spotify-entry").first();
    await expect(firstTrack.locator("img")).toBeVisible();
    await expect(firstTrack.locator("strong")).toBeVisible();
  }
});
```

### Step 6: Build & Deploy

```bash
npm run build
# or for dev
npm run dev
```

---

## Debugging

- If tracks don't load, check the Worker logs in Cloudflare dashboard
- Test the Worker URL directly in browser — should return JSON with `tracks` array
- Check `VITE_SPOTIFY_NOW_PLAYING_URL` is set correctly in `.env.local`
- Verify the Spotify refresh token hasn't expired (re-generate if needed)

## How `formatRelativeTime` works

The existing helper `formatRelativeTime(track.playedAt)` takes an ISO date string and returns relative time like "2 hours ago" / "Yesterday" — already available in `App.tsx` and used by the GitHub section.

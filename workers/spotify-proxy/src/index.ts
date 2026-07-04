export interface Env {
  LISTENBRAINZ_USER: string;
  SPOTIFY_HISTORY: KVNamespace;
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

const HISTORY_KEY = "tracks";
const MAX_TRACKS = 5;
const FALLBACK_ART = "https://placehold.co/60x60/1a1a2e/ffffff?text=%E2%99%AA&font=playfair-display";

function fixTrackUrl(url: string): string {
  const prefix = "https://open.spotify.com/track/";
  if (url.startsWith(prefix + prefix)) {
    const match = url.slice(prefix.length).match(/track\/([a-zA-Z0-9]+)/);
    if (match) return prefix + match[1];
  }
  return url;
}

function cleanTrack(track: SpotifyTrack): SpotifyTrack {
  return {
    ...track,
    albumArt: track.albumArt || FALLBACK_ART,
    url: fixTrackUrl(track.url || ""),
  };
}

async function loadHistory(kv: KVNamespace): Promise<SpotifyTrack[]> {
  const stored = await kv.get(HISTORY_KEY, "text");
  if (!stored) return [];
  try {
    const raw: SpotifyTrack[] = JSON.parse(stored);
    const valid = raw.filter((t) => t && t.title && t.artist);
    const cleaned = valid.map(cleanTrack);

    const needsSave = cleaned.some((t, i) =>
      t.url !== valid[i]?.url || t.albumArt !== valid[i]?.albumArt
    );
    if (needsSave || cleaned.length !== raw.length) {
      await kv.put(HISTORY_KEY, JSON.stringify(cleaned.slice(0, MAX_TRACKS)));
    }

    return cleaned;
  } catch {
    return [];
  }
}

async function saveHistory(kv: KVNamespace, tracks: SpotifyTrack[]): Promise<void> {
  await kv.put(HISTORY_KEY, JSON.stringify(tracks.slice(0, MAX_TRACKS).map(cleanTrack)));
}

function coverArtUrl(mapping?: {
  release_mbid?: string;
  caa_id?: number;
  caa_release_mbid?: string;
}): string {
  if (mapping?.caa_release_mbid && mapping?.caa_id) {
    return `https://archive.org/download/${mapping.caa_release_mbid}/mbid-${mapping.caa_release_mbid}-${mapping.caa_id}_thumb250.jpg`;
  }
  return "";
}

async function fetchSpotifyAlbumArt(spotifyUrl: string): Promise<string> {
  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`);
    if (res.ok) {
      const data = (await res.json()) as { thumbnail_url?: string };
      if (data.thumbnail_url) return data.thumbnail_url;
    }
  } catch {
    // Silently fall back to placeholder
  }
  return "";
}

function spotifyTrackUrl(spotifyId?: string, title?: string, artist?: string): string {
  if (spotifyId) {
    // Handle both full URLs (https://open.spotify.com/track/xxx) and plain IDs
    const match = spotifyId.match(/track\/([a-zA-Z0-9]+)/);
    if (match) return `https://open.spotify.com/track/${match[1]}`;
    if (!spotifyId.startsWith("http")) return `https://open.spotify.com/track/${spotifyId}`;
    return spotifyId;
  }
  if (title && artist) return `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`;
  return "";
}

function tryParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return text; }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    const url = new URL(request.url);
    if (url.pathname === "/reset") {
      await env.SPOTIFY_HISTORY.delete(HISTORY_KEY);
      return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
    }

    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      if (!env.LISTENBRAINZ_USER) {
        return new Response(
          JSON.stringify({ error: "LISTENBRAINZ_USER not configured" }),
          { status: 500, headers: corsHeaders },
        );
      }

      // Debug endpoint
      if (url.pathname === "/_debug") {
        const lbRes = await fetch(
          `https://api.listenbrainz.org/1/user/${env.LISTENBRAINZ_USER}/listens?count=1`,
          { headers: { Accept: "application/json" } },
        );
        const body = await lbRes.text();
        return new Response(JSON.stringify({
          status: lbRes.status,
          body: tryParse(body),
        }, null, 2), { headers: corsHeaders });
      }

      // Fetch from ListenBrainz
      const lbRes = await fetch(
        `https://api.listenbrainz.org/1/user/${env.LISTENBRAINZ_USER}/listens?count=6`,
        { headers: { Accept: "application/json" } },
      );

      if (!lbRes.ok) {
        const body = await lbRes.text();
        throw new Error(`ListenBrainz fetch failed: ${lbRes.status} ${body}`);
      }

      const data = (await lbRes.json()) as {
        payload: {
          listens: Array<{
            track_metadata: {
              track_name: string;
              artist_name: string;
              release_name?: string;
              additional_info?: {
                spotify_id?: string;
                listening_from?: string;
              };
              mbid_mapping?: {
                release_mbid?: string;
                caa_id?: number;
                caa_release_mbid?: string;
              };
            };
            listened_at: number;
            playing_now: boolean;
          }>;
        };
      };

      const listens = data.payload.listens || [];
      const tracks: SpotifyTrack[] = [];
      let nowPlaying: SpotifyTrack | null = null;

      // Process new tracks from ListenBrainz
      for (const item of listens) {
        const meta = item.track_metadata;
        const trackUrl = spotifyTrackUrl(meta.additional_info?.spotify_id, meta.track_name, meta.artist_name);

        // Always try Spotify oEmbed first when we have a track URL
        let albumArt = "";
        if (trackUrl.startsWith("https://open.spotify.com/track/")) {
          albumArt = await fetchSpotifyAlbumArt(trackUrl);
        }

        // Fall back to Cover Art Archive if Spotify fails
        if (!albumArt) {
          albumArt = coverArtUrl(meta.mbid_mapping);
        }

        const track: SpotifyTrack = cleanTrack({
          title: meta.track_name,
          artist: meta.artist_name,
          albumArt,
          playedAt: item.playing_now ? "now" : new Date(item.listened_at * 1000).toISOString(),
          url: trackUrl,
        });

        if (item.playing_now) {
          nowPlaying = track;
        } else {
          tracks.push(track);
        }
      }

      // Merge with KV history, upgrading album art for old tracks
      const history = await loadHistory(env.SPOTIFY_HISTORY);
      const merged = [...tracks];

      for (const h of history) {
        const exists = merged.some((t) => t.title === h.title && t.artist === h.artist);
        if (!exists) {
          // Try to upgrade album art from Spotify if this KV track has no real art
          let upgraded = h;
          if (
            !h.albumArt.startsWith("https://image-cdn") &&
            h.url.startsWith("https://open.spotify.com/track/")
          ) {
            const spotifyArt = await fetchSpotifyAlbumArt(h.url);
            if (spotifyArt) {
              upgraded = { ...h, albumArt: spotifyArt };
            }
          }
          merged.push(upgraded);
        }
      }

      // Sort by playedAt descending (history entries last)
      merged.sort((a, b) => {
        if (a.playedAt === "now") return -1;
        if (b.playedAt === "now") return 1;
        return new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime();
      });

      // Persist merged history back to KV
      await saveHistory(env.SPOTIFY_HISTORY, merged);

      const response: SpotifyResponse = {
        tracks: merged.slice(0, MAX_TRACKS),
        nowPlaying,
      };

      return new Response(JSON.stringify(response), { headers: corsHeaders });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: String(err) }),
        { status: 500, headers: corsHeaders },
      );
    }
  },
};

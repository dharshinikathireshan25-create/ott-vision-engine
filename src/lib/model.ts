// Deterministic K-Means-inspired model: fixed trained centroids, standardized Euclidean distance.
export type Genre = "Action" | "Thriller" | "Comedy" | "Drama" | "Romance" | "Documentary" | "Sci-Fi" | "Animation";
export const GENRES: Genre[] = ["Action", "Thriller", "Comedy", "Drama", "Romance", "Documentary", "Sci-Fi", "Animation"];
export type VisitLevel = "Low" | "Medium" | "High";
export const VISIT_VALUE: Record<VisitLevel, number> = { Low: 1.5, Medium: 3.5, High: 5.5 };

export interface Segment {
  id: 0 | 1 | 2 | 3;
  name: string;
  short: string;
  pct: number;
  users: number;
  avgWatch: number;
  avgSession: number;
  genres: string[];
  engagement: "High" | "Medium" | "Low";
  traits: string[];
  centroid: { watch: number; session: number; visits: number; diversity: number; weekend: number };
}

export const SEGMENTS: Segment[] = [
  { id: 0, name: "High-Engagement Action Viewers", short: "Action Bingers", pct: 28, users: 2800, avgWatch: 34.2, avgSession: 88, genres: ["Action", "Thriller", "Sci-Fi"], engagement: "High", traits: ["High watch time", "Long sessions", "Strong Action/Thriller preference"], centroid: { watch: 34, session: 90, visits: 5.5, diversity: 2.5, weekend: 35 } },
  { id: 1, name: "Casual Short-Session Viewers", short: "Snackers", pct: 32, users: 3200, avgWatch: 12.4, avgSession: 22, genres: ["Comedy", "Animation", "Romance"], engagement: "Medium", traits: ["Short sessions", "Frequent but brief visits", "Mobile-first habits"], centroid: { watch: 12, session: 22, visits: 6, diversity: 3, weekend: 30 } },
  { id: 2, name: "Genre Explorers", short: "Explorers", pct: 24, users: 2400, avgWatch: 21.6, avgSession: 55, genres: ["Documentary", "Drama", "Sci-Fi", "Comedy"], engagement: "High", traits: ["High genre diversity", "Multiple genres watched", "Discovery-driven"], centroid: { watch: 22, session: 55, visits: 4, diversity: 6.5, weekend: 40 } },
  { id: 3, name: "Low-Activity Viewers", short: "Dormant", pct: 16, users: 1600, avgWatch: 4.8, avgSession: 38, genres: ["Drama", "Comedy"], engagement: "Low", traits: ["Low watch time", "Lower engagement", "Weekend-heavy usage"], centroid: { watch: 5, session: 38, visits: 1.2, diversity: 1.8, weekend: 75 } },
];

const SCALE = { watch: 10, session: 30, visits: 1.5, diversity: 1.5, weekend: 15 };

export interface UserInput {
  userId: string;
  watch: number;
  session: number;
  visits: VisitLevel;
  diversity: number;
  weekend: number;
  genres: Genre[];
}

export interface Analysis {
  input: UserInput;
  segment: Segment;
  distances: number[];
  confidence: number;
  features: { watch: number; session: number; visits: number; diversity: number; weekend: number };
}

export function analyzeUser(input: UserInput): Analysis {
  const f = { watch: input.watch, session: input.session, visits: VISIT_VALUE[input.visits], diversity: input.diversity, weekend: input.weekend };
  const action = input.genres.some((g) => g === "Action" || g === "Thriller");
  const distances = SEGMENTS.map((s) => {
    let d = Math.sqrt(
      (Object.keys(SCALE) as (keyof typeof SCALE)[]).reduce((acc, k) => acc + ((f[k] - s.centroid[k]) / SCALE[k]) ** 2, 0),
    );
    if (s.id === 0 && !action) d += 0.4;
    return Math.round(d * 1000) / 1000;
  });
  const best = distances.indexOf(Math.min(...distances));
  const confidence = Math.max(55, Math.min(98, Math.round(98 - distances[best] * 17.5)));
  return { input, segment: SEGMENTS[best]!, distances, confidence, features: f };
}

export interface Title { title: string; genre: string; duration: string; reason: string; type: "Movie" | "Series" }

export function recommend(a: Analysis): Title[] {
  const g = a.input.genres;
  const top = g[0] ?? a.segment.genres[0];
  switch (a.segment.id) {
    case 0:
      return [
        { title: "Shadow Protocol", genre: "Action", duration: "2h 12m", type: "Movie", reason: "You frequently watch Action and have long sessions." },
        { title: "Dark Pursuit", genre: "Thriller", duration: "1h 58m", type: "Movie", reason: "Thriller is in your top genres." },
        { title: "Code Red", genre: "Action", duration: "8 episodes · 52m", type: "Series", reason: "Long-form series suit your 85+ min sessions." },
        { title: "Iron Meridian", genre: "Sci-Fi Action", duration: "2h 24m", type: "Movie", reason: "Similar to titles watched by your cluster." },
        { title: "Blackout Line", genre: "Thriller", duration: "10 episodes · 48m", type: "Series", reason: "High-intensity binge pick for high-engagement viewers." },
        { title: "Vector Zero", genre: "Action", duration: "2h 05m", type: "Movie", reason: "Trending in High-Engagement Action Viewers this week." },
      ];
    case 1:
      return [
        { title: "Lunch Break Laughs", genre: "Comedy", duration: "22m", type: "Series", reason: "Short episodes match your ~20 min sessions." },
        { title: "Pixel Pals", genre: "Animation", duration: "1h 18m", type: "Movie", reason: "A short movie you can finish in one sitting." },
        { title: "Trending: Night Shift", genre: "Comedy", duration: "25m", type: "Series", reason: "#1 trending among frequent, brief visitors." },
        { title: "Two Coffees", genre: "Romance", duration: "1h 24m", type: "Movie", reason: "Easy-to-complete and highly rated." },
        { title: "Quick Bites", genre: "Documentary", duration: "15m", type: "Series", reason: "Bite-sized episodes for quick visits." },
        { title: "Sunday Swipe", genre: "Comedy", duration: "1h 31m", type: "Movie", reason: "Trending content under 95 minutes." },
      ];
    case 2:
      return [
        { title: "Deep Blue Atlas", genre: "Documentary", duration: "1h 46m", type: "Movie", reason: `Matches your preferred genre: ${top}.` },
        { title: "Echoes of Kyoto", genre: "Drama", duration: "6 episodes · 50m", type: "Series", reason: "Related genre to what you already enjoy." },
        { title: "The Last Orbit", genre: "Sci-Fi", duration: "2h 01m", type: "Movie", reason: "Highly rated by fellow Genre Explorers." },
        { title: "Folk & Fire", genre: "Musical Drama", duration: "1h 52m", type: "Movie", reason: "New genre discovery — you haven't tried this yet." },
        { title: "Kitchen Republic", genre: "Food Documentary", duration: "8 episodes · 35m", type: "Series", reason: "Your high genre diversity suggests openness to new formats." },
        { title: "Paper Moons", genre: "Animation", duration: "1h 39m", type: "Movie", reason: "Cross-genre pick bridging Animation and Drama." },
      ];
    default:
      return [
        { title: "City of Lights", genre: "Drama", duration: "1h 44m", type: "Movie", reason: "Most popular title on the platform this month." },
        { title: "Family Reunion", genre: "Comedy", duration: "1h 36m", type: "Movie", reason: "Easy-to-watch and great for weekends." },
        { title: "Trending Shorts", genre: "Mixed", duration: "12m", type: "Series", reason: "Short trending content to rebuild your habit." },
        { title: "The Weekend Heist", genre: "Comedy Thriller", duration: "1h 41m", type: "Movie", reason: "You mostly watch on weekends — a perfect Saturday pick." },
        { title: "Top 10 Today", genre: "Mixed", duration: "20m", type: "Series", reason: "Popular content curated for re-engagement." },
        { title: "Warm Hearts", genre: "Romance", duration: "1h 29m", type: "Movie", reason: "High completion rate among casual returners." },
      ];
  }
}

export interface MockUser {
  user_id: string; watch_time_hours: number; avg_session_mins: number; visit_frequency: number;
  genre_diversity: number; weekend_usage: number; top_genre: string; cluster: number; segment_name: string; confidence: number;
}

const raw: [number, number, number, number, number, string, number][] = [
  [36.4, 92, 5.8, 2, 32, "Action", 0], [11.2, 18, 6.4, 3, 28, "Comedy", 1], [23.5, 58, 4.1, 7, 41, "Documentary", 2],
  [4.2, 35, 1.1, 2, 78, "Drama", 3], [31.8, 84, 5.2, 3, 36, "Thriller", 0], [13.6, 24, 6.9, 2, 25, "Animation", 1],
  [20.1, 52, 3.8, 6, 44, "Sci-Fi", 2], [5.9, 41, 1.4, 1, 72, "Comedy", 3], [38.9, 97, 6.1, 2, 30, "Action", 0],
  [10.4, 20, 5.7, 3, 33, "Romance", 1], [24.7, 61, 4.4, 8, 38, "Drama", 2], [3.6, 32, 0.9, 2, 81, "Drama", 3],
  [33.2, 88, 5.5, 3, 37, "Action", 0], [12.9, 21, 6.2, 4, 29, "Comedy", 1], [19.4, 49, 3.6, 6, 46, "Documentary", 2],
  [6.4, 44, 1.6, 2, 69, "Comedy", 3], [35.0, 90, 5.9, 2, 34, "Thriller", 0], [14.1, 26, 6.6, 3, 31, "Animation", 1],
  [22.8, 56, 4.0, 7, 39, "Sci-Fi", 2], [4.9, 37, 1.2, 1, 76, "Romance", 3], [30.6, 81, 5.1, 3, 39, "Action", 0],
  [9.8, 17, 5.9, 2, 27, "Comedy", 1], [21.3, 54, 4.2, 6, 42, "Drama", 2], [5.1, 39, 1.0, 2, 74, "Drama", 3],
  [37.7, 95, 6.0, 2, 31, "Action", 0], [12.2, 23, 6.3, 3, 30, "Romance", 1], [25.6, 63, 4.6, 7, 37, "Documentary", 2],
  [3.9, 34, 1.3, 1, 79, "Comedy", 3], [32.4, 86, 5.4, 3, 35, "Thriller", 0], [11.7, 19, 6.8, 2, 26, "Animation", 1],
  [20.9, 51, 3.9, 8, 43, "Sci-Fi", 2], [6.0, 42, 1.5, 2, 70, "Drama", 3],
];

export const USERS: MockUser[] = raw.map((r, i) => ({
  user_id: `USR-${1001 + i}`, watch_time_hours: r[0], avg_session_mins: r[1], visit_frequency: r[2],
  genre_diversity: r[3], weekend_usage: r[4], top_genre: r[5], cluster: r[6], segment_name: SEGMENTS[r[6]]!.name,
  confidence: 78 + ((i * 7) % 19),
}));

export const K_SCORES = [
  { k: 2, score: 0.41, inertia: 2410.3 }, { k: 3, score: 0.52, inertia: 1786.2 }, { k: 4, score: 0.61, inertia: 1248.6 },
  { k: 5, score: 0.56, inertia: 1102.9 }, { k: 6, score: 0.49, inertia: 1011.4 },
];

export const DEMO_INPUT: UserInput = { userId: "USR-8192", watch: 32.5, session: 85, visits: "High", diversity: 2, weekend: 35, genres: ["Action", "Thriller"] };

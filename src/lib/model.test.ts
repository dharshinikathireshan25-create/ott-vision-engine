import { analyzeUser, DEMO_INPUT, USERS, recommend } from "./model";

test("demo user USR-8192 lands in Cluster 0 with 91% confidence", () => {
  const a = analyzeUser(DEMO_INPUT);
  expect(a.segment.id).toBe(0);
  expect(a.segment.name).toBe("High-Engagement Action Viewers");
  expect(a.confidence).toBe(91);
  expect(recommend(a).slice(0, 3).map((t) => t.title)).toEqual(["Shadow Protocol", "Dark Pursuit", "Code Red"]);
});

test("mock dataset has at least 30 users", () => {
  expect(USERS.length).toBeGreaterThanOrEqual(30);
});

test("low watch, weekend-heavy user is Low-Activity", () => {
  const a = analyzeUser({ userId: "x", watch: 4, session: 35, visits: "Low", diversity: 2, weekend: 80, genres: ["Drama"] });
  expect(a.segment.id).toBe(3);
});

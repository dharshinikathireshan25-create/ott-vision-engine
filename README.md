# AudiencePulse AI

Build a complete, modern, responsive hackathon prototype for an AI-Powered Audience Segmentation & Personalization System for OTT platforms.

The system analyzes OTT user behavior data, automatically groups similar users using K-Means clustering, converts clusters into human-readable audience segments, and provides transparent rule-based content recommendations.

IMPORTANT:

- Do NOT use OpenAI, Claude, Gemini, or any external LLM.

- The core AI concept must be K-Means unsupervised clustering.

- Use realistic mock data so the prototype works immediately without requiring external APIs.

- The prototype must look like a professional hackathon project, not a generic admin dashboard.

- Make all important buttons and interactions functional.

- Use a clean modern dark/light hybrid OTT analytics dashboard with attractive cards, charts, tables, badges, and smooth interactions.

- Make it fully responsive.

APPLICATION NAME

"AudienceIQ"

Subtitle:

"AI-Powered Audience Intelligence & Personalization"

MAIN NAVIGATION

Create these pages:

1. Dashboard

2. Audience Segments

3. User Analyzer

4. Recommendations

5. Model Evaluation

6. System Architecture

7. API Monitor

Use a professional sidebar navigation.

---

1. DASHBOARD

Create an "Audience Intelligence Dashboard".

Top metric cards:

- Total Users: 10,000

- Active Segments: 4

- Average Watch Time: 18.5 hrs

- Best Silhouette Score: 0.61

Add a small status indicator:

"Model Status: Active"

Create an "Audience Distribution" section showing:

High-Engagement Action Viewers — 28%

Casual Short-Session Viewers — 32%

Genre Explorers — 24%

Low-Activity Viewers — 16%

Use an attractive donut/pie chart.

Create a "Segment Performance" bar chart.

Create a "Recent User Analysis" table with:

User ID

Watch Time

Session Duration

Visit Frequency

Top Genre

Segment

Risk/Confidence indicator

Add sample users such as:

USR-1001

USR-1002

USR-1003

USR-1004

USR-1005

---

2. AUDIENCE SEGMENTS

Create a dedicated page showing the four automatically identified segments.

Segment 1:

"High-Engagement Action Viewers"

- 28% of users

- High watch time

- Long sessions

- Strong Action/Thriller preference

Segment 2:

"Casual Short-Session Viewers"

- 32% of users

- Short sessions

- Frequent but brief visits

Segment 3:

"Genre Explorers"

- 24% of users

- High genre diversity

- Multiple genres watched

Segment 4:

"Low-Activity Viewers"

- 16% of users

- Low watch time

- Lower engagement

- Weekend-heavy usage

For every segment show:

- User count

- Percentage

- Average watch time

- Average session duration

- Popular genres

- Engagement level

Add a "View Users" button for each segment.

---

3. USER ANALYZER

Create an interactive user analysis page.

Input fields:

User ID

Watch Time (hours)

Average Session Duration (minutes)

Visit Frequency

Genre Diversity

Weekend Usage (%)

Top Genres

Provide genre multi-select:

Action

Thriller

Comedy

Drama

Romance

Documentary

Sci-Fi

Animation

Add a large button:

"ANALYZE USER"

When clicked, calculate/assign the user's segment using a deterministic K-Means-inspired clustering logic based on the input features.

Show an animated analysis/loading state briefly.

Then display:

USER ANALYSIS RESULT

User ID

Predicted Segment:

"High-Engagement Action Viewers"

Show:

Cluster ID: Cluster 0

Engagement Level: High

Cluster Confidence: 91%

Show the user's behavioral profile.

Add a simple radar/bar visualization comparing the user with the selected segment.

---

4. PERSONALIZED RECOMMENDATIONS

After analyzing a user, show recommendations based on the identified segment.

Use transparent rule-based recommendation logic.

For High-Engagement Action Viewers:

- Action movies

- Thriller movies

- Long-form series

- Similar content

For Casual Short-Session Viewers:

- Short movies

- Trending content

- Easy-to-complete episodes

For Genre Explorers:

- Preferred genres

- Related genres

- New genre discovery

For Low-Activity Viewers:

- Popular content

- Easy-to-watch movies

- Trending short content

Create recommendation cards containing:

Movie/Series title

Genre

Duration

Why it is recommended

Example:

"Shadow Protocol"

Action • 2h 12m

"Recommended because you frequently watch Action and have long sessions."

Make recommendations dynamically change according to the selected segment.

---

5. MODEL EVALUATION

Create a professional "Model Evaluation" page.

Show:

Algorithm:

K-Means Clustering

Learning Type:

Unsupervised Learning

Best Number of Clusters:

4

Silhouette Score:

0.61

Inertia:

1248.6

Show a chart comparing:

K = 2 → 0.41

K = 3 → 0.52

K = 4 → 0.61

K = 5 → 0.56

K = 6 → 0.49

Highlight K=4 as the selected configuration.

Add evaluation cards:

Cluster Balance: Good

API Health: Passed

Invalid Input Handling: Passed

Reproducibility: Passed

Model Stability: Passed

Add a section:

"Why K-Means?"

Explain:

"K-Means is lightweight, CPU-friendly, interpretable, and suitable for grouping users based on behavioral similarity."

---

6. SYSTEM ARCHITECTURE

Create a visual architecture page.

Show this flow as connected cards:

USER ACTIVITY DATA

↓

DATA CLEANING

↓

FEATURE ENGINEERING

↓

STANDARDIZATION

↓

K-MEANS CLUSTERING

↓

AUDIENCE SEGMENTS

↓

PERSONALIZATION RULES

↓

REST API

↓

RECOMMENDATIONS

↓

EVALUATOR

↓

DOCKER DEPLOYMENT

Below it show three service cards:

TRAINER

- Data preprocessing

- Feature scaling

- K-Means training

- Model saving

API SERVICE

- REST API

- User prediction

- Segment assignment

- Recommendations

- Health check

EVALUATOR

- Silhouette score

- Cluster balance

- API testing

- Invalid input testing

- Reproducibility

Make the architecture visually impressive and easy for judges to understand.

---

7. API MONITOR

Create an API monitoring page.

Show endpoint cards:

GET /health

POST /recommend

For /health show:

Status: OK

Model Loaded: TRUE

Service: Running

For /recommend show an interactive JSON request example:

{

"user_id": "USR-8192",

"watch_time_hours": 32.5,

"top_genres": ["Action", "Thriller"],

"avg_session_mins": 85

}

Show a corresponding response:

{

"user_id": "USR-8192",

"segment_name": "High-Engagement Action Viewers",

"recommendations": [

"Shadow Protocol",

"Dark Pursuit",

"Code Red"

]

}

Add buttons:

"Send Request"

"Reset"

When "Send Request" is clicked, show:

HTTP 200 OK

Response Time: 42 ms

---

DATA MODEL

Create realistic mock OTT user data with at least 30 users.

Fields:

user_id

watch_time_hours

avg_session_mins

visit_frequency

genre_diversity

weekend_usage

top_genre

cluster

segment_name

Use realistic values that clearly represent the four audience segments.

---

VISUAL DESIGN

Use:

- Professional SaaS/AI analytics style

- Clean typography

- Modern cards

- Subtle gradients

- Rounded corners

- Good spacing

- Charts

- Segment badges

- Status indicators

- Smooth hover effects

- Responsive design

Primary visual theme:

deep navy / blue / purple / cyan accents.

Do not overcrowd the dashboard.

Make the most important information visible immediately.

---

DEMO FLOW

The prototype must support this exact demo:

1. Open Dashboard

2. Show 10,000 users and 4 segments

3. Open Audience Segments

4. Explain the four segments

5. Open User Analyzer

6. Enter:

   User ID: USR-8192

   Watch Time: 32.5

   Session Duration: 85

   Visit Frequency: High

   Genre Diversity: 2

   Weekend Usage: 35

   Genres: Action, Thriller

7. Click "ANALYZE USER"

8. Show:

   High-Engagement Action Viewers

   Cluster 0

   91% confidence

9. Open Recommendations

10. Show personalized content

11. Open Model Evaluation

12. Show K=4 and Silhouette Score 0.61

13. Open System Architecture

14. Explain Trainer → API → Evaluator

15. Open API Monitor

16. Demonstrate /recommend and /health

The entire prototype should feel like one connected AI system rather than separate static pages.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ott-vision-engine.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3ae03787-28cf-555d-8fda-7d5359851e2e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

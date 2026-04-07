# Maple Mentor

Interactive Canadian citizenship practice app with account-based progress tracking.

Official source:
https://www.canada.ca/content/dam/ircc/migration/ircc/english/pdf/pub/discover-large.pdf

## What it includes

- Responsive mobile and desktop layout
- Sign up and sign in flow for separate learner accounts
- Per-user saved progress, preferences, saved cards, and study stats
- Study Deck, Quiz Sprint, and Mock Test modes
- Built-in text-to-speech for reading questions aloud
- Optional voice command support in browsers that expose Web Speech recognition
- Questions aligned to the official Discover Canada study guide
- Spanish translation support for current cards plus Spanish read-aloud study help

## Files

- `index.html` - app shell
- `styles.css` - responsive styling
- `questions.js` - practice question bank
- `translations.js` - Spanish translations for the practice cards
- `app.js` - quiz logic, account flow, audio controls, and progress tracking
- `server.js` - static server plus account/session/progress API

## Run it

1. Start the server:
   `npm start`
2. Open `http://localhost:3000`

For the best audio experience, use a browser with Web Speech support such as current Edge or Chrome.

## Data storage

- By default the app stores account data in `./data`
- You can change that location with the `DATA_DIR` environment variable
- For Railway, mount a persistent volume and point `DATA_DIR` to that mounted path so user accounts and progress survive redeploys

## Next upgrade ideas

- Add French audio and bilingual question sets
- Expand the question bank and explanations
- Add a dedicated review mode for saved cards only
- Package it as a PWA for installable home screen use

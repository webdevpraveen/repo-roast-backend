# 🔥 Repo Roast Backend

The brutal brain behind Repo Roast. This Node.js/Express server analyzes GitHub repositories and generates devastatingly honest roasts using AI.

## 🚀 Features

- **GitHub Repository Analysis**: Fetches stats, commit history, and file structures using the GitHub API.
- **AI-Powered Roasting**: Leverages Groq (LLaMA 3) to generate witty, sarcastic, and brutal roasts.
- **Stat Tracking**: Extracts stars, issue counts, and "bad commit" patterns.
- **Secure**: Built with environment variable protection and rate limiting in mind.

## 🛠 Tech Stack

- **Server**: Express.js
- **AI Engine**: Groq SDK / OpenAI-compatible API
- **Data Fetching**: Axios
- **Environment**: Dotenv

## 📡 API Endpoints

### `POST /api/roast`
Analyzes a repo and returns a roast.
- **Body**: `{ "repoUrl": "https://github.com/user/repo" }`
- **Response**: `{ "success": true, "roast": "...", "stats": { ... } }`

## 🛡 License

MIT - Roast responsibly.

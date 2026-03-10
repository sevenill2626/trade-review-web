# Trade Review Web

A static, single-page trade review journal that saves records locally and optionally syncs to GitHub.

## Run locally

Open `index.html` directly in a browser, or use any static server.

Example (PowerShell):

```
python -m http.server 5173
```

Then open http://localhost:5173/trade-review-web/

## Deploy

Upload the `trade-review-web` folder to any static hosting provider (Netlify, Vercel static, GitHub Pages, Cloudflare Pages).

## GitHub sync

This project can sync records to a JSON file in your GitHub repo. It uses the GitHub API directly from the browser.

1. Create a fine-grained GitHub token with `Contents: Read and write` for the repo.
2. Fill in the GitHub section on the page (owner, repo, branch, file path).
3. Click "同步到 GitHub" to push records, or "从 GitHub 拉取" to load them.

Notes:
- The token is stored in your browser's local storage for convenience.
- Use a dedicated fine-grained token for this repo only.

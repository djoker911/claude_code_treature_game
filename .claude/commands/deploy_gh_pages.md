Deploy this project to GitHub Pages by following these steps carefully:

## 1. Check GitHub CLI

- Run `which gh` to check if GitHub CLI is installed.
- If not installed, tell the user to install it:
  - macOS: `brew install gh`
  - Windows: `winget install GitHub.cli`
  - Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md
- Then stop and ask them to re-run this command after installing.

## 2. Check GitHub authentication

- Run `gh auth status` to check if the user is logged in.
- If not logged in, guide them to authenticate:
  1. Run `gh auth login`
  2. Choose **GitHub.com**
  3. Choose **HTTPS**
  4. Choose **Login with a web browser** and follow the prompts
- After login, confirm with `gh auth status` before continuing.

## 3. Check for a local git repo and remote

- Run `git remote get-url origin` to check if a remote exists.
- **If a remote exists:** extract the owner and repo name from the URL and continue.
- **If no remote exists:**
  1. Check if a local git repo exists with `git status`. If not, run `git init && git add . && git commit -m "Initial commit"`.
  2. Ask the user what they want to name the GitHub repository.
  3. Create the repo on GitHub: `gh repo create REPO_NAME --public --source=. --remote=origin --push`
  4. Confirm the remote was set: `git remote get-url origin`

## 4. Derive deployment values

From the remote URL (`https://github.com/USER/REPO.git` or `git@github.com:USER/REPO.git`), extract:
- `GITHUB_USER` — the GitHub username/org
- `REPO_NAME` — the repository name (strip `.git` suffix)
- `HOMEPAGE` — `https://GITHUB_USER.github.io/REPO_NAME`

## 5. Install gh-pages package

- Check if `gh-pages` is in `package.json` devDependencies.
- If not installed, run `npm install --save-dev gh-pages`.

## 6. Configure package.json

- Check `package.json` for `"homepage"`, `"predeploy"`, and `"deploy"` fields.
- If any are missing, add them using the values derived in Step 4:
  - `"homepage"`: `"https://GITHUB_USER.github.io/REPO_NAME"`
  - `"predeploy"`: `"npm run build"`
  - `"deploy"`: `"gh-pages -d build"`
- Tell the user what will be added before making the changes.

> Note: This project has an Express + SQLite backend (`server/`) that cannot run on GitHub Pages. The deployment will be **frontend-only** (static site). The `/api` routes (auth, scores) will not be available. Inform the user of this limitation.

## 7. Configure Vite base path

- Read `vite.config.ts` and check if `base` is already set.
- If not set, add `base: '/REPO_NAME/'` using the repo name from Step 4.
- If it is set to a different repo name (e.g. from a previous owner's deployment), update it to the correct value.
- Tell the user what will be changed before editing.

## 8. Build and deploy

- Run `npm run deploy`.
- If it fails, stop and report the full error output.

## 9. Enable GitHub Pages (if needed)

- Run `gh api repos/GITHUB_USER/REPO_NAME --jq '.has_pages'` to check if Pages is enabled.
- If `false`, instruct the user to enable it:
  1. Go to: `https://github.com/GITHUB_USER/REPO_NAME/settings/pages`
  2. Under **Source**, select **Deploy from a branch**
  3. Set branch to **`gh-pages`** / `/ (root)`
  4. Click **Save**
- Tell the user the site may take 1-2 minutes to go live after enabling.

## 10. Post-deploy check

- Wait ~15 seconds for GitHub Pages to propagate, then run `curl -s -o /dev/null -w "%{http_code}" HOMEPAGE` to check the HTTP status.
- If 200: report success and the live URL.
- If 404: remind the user to enable GitHub Pages in settings (Step 9) and check back in 1-2 minutes.
- If other error: report the status and suggest checking the repo settings.

Deploy this project to Vercel by following these steps carefully:

## 1. Check prerequisites

- Run `which vercel || npm list -g vercel` to check if Vercel CLI is installed globally.
- If not installed, run `npm install -g vercel` and confirm with the user before proceeding.

## 2. Build the project

- Run `npm run build` and confirm it succeeds (output goes to `build/`).
- If the build fails, stop and report the errors.

## 3. Check for existing Vercel configuration

- Check if `vercel.json` exists in the project root.
- If it does not exist, create it with the following content to configure the Vite output directory and SPA routing:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> Note: This project has an Express + SQLite backend (`server/`) that cannot run on Vercel's serverless platform as-is. The deployment will be **frontend-only** (static site). The `/api` routes will not be available after deployment. Inform the user of this limitation.

## 4. Deploy

- Run `vercel --prod` and follow any interactive prompts (project name, scope, etc.).
- Report the deployment URL once complete.

## 5. Post-deploy check

- Run `curl -s <deployment-url> | head -c 200` to verify the site is reachable.
- Report success or any issues found.

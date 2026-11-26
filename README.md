# Wegomap Website (Frontend)

Next.js website for [wegomap.com](https://www.wegomap.com). The API is a separate project (the `server` folder next to this one).

- Repository: `github.com/alvindavisv2-stack/wegomap-client`
- Live branch: `main`
- Node.js: 22
- Hosting: Hostinger (Next.js standalone build)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API must be running too.

The API address is set in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Production uses `.env.production` (or the environment variables in the hosting panel). `.env*` files are not committed to Git.

## Redeploy the website

1. **Commit your changes**

   ```bash
   git status
   git add .
   git commit -m "short description of the change"
   ```

2. **Push to `main`**

   ```bash
   git push origin main
   ```

3. **Build on Hostinger.** If a build does not start on its own after the push, press **Redeploy** for the website in the hosting panel.

4. **Check the build log.** The host runs `npm install` and `npm run build`, publishes the new version and restarts the app. A good build ends with:

   ```
   Deployment completed
   ```

   Also check that the commit shown at the top of the log ("Checked out ...") is the one you just pushed.

5. **Check the live site.** Open the pages you changed and send one test enquiry.

### Redeploy without code changes

Press **Redeploy** in the hosting panel, or push an empty commit:

```bash
git commit --allow-empty -m "chore: redeploy"
git push origin main
```

A rebuild is needed after changing a `NEXT_PUBLIC_...` variable, because its value is built into the site.

### Roll back

Undo the bad commit and push again:

```bash
git revert <commit-id>
git push origin main
```

## Build problems

| Message in the log | Cause and fix |
| --- | --- |
| `OS can't spawn worker thread` | The host limits threads. Keep `experimental.cpus: 2` in `next.config.ts`. |
| `'cp' is not recognized` (Windows only) | The last build step uses Linux commands. The site has already compiled at that point, and the host (Linux) is not affected. |
| `ECONNREFUSED` while building | The API was not reachable during the build. Pages use fallback content. Start the API before building locally. |
| Sass `Deprecation Warning` | Warnings only. The build continues. |

## Redeploy the API (server project)

Only needed when the `server` project changes. Push it to `main`, then run on Hostinger, inside the API folder:

```bash
bash deploy.sh
```

Then restart the API app in the hosting panel.

## Landing pages

Ad landing pages live in `src/app/trips/` (for example `/trips/kerala-tour-packages` and `/trips/kerala-honeymoon-packages`). They have their own header, are hidden from search engines, and show the packages assigned to the matching category in the admin.

## Enquiries

Website forms send enquiries to the API (`POST /leads`). The API saves them, emails the admin and sends them to the CRM. If an enquiry shows in the admin but not in the CRM, check the API log for `CRM Sync` lines.

# Portfolio Deployment Guide

## Local Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder with:
- Minified HTML, CSS, and JavaScript
- Converted images to WebP/AVIF formats
- Proper asset hashing for cache busting

## Deploy to Cloudflare Pages

### Option 1: Using Wrangler CLI

```bash
# Install wrangler globally if not installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
npm run deploy
```

Or directly:
```bash
wrangler pages deploy dist
```

### Option 2: Using GitHub Actions (Recommended)

Add this workflow to `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          projectName: portfolio
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Option 3: Manual Upload

1. Build the project: `npm run build`
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Navigate to Workers & Pages → Create Application
4. Select Direct Upload and drag the `dist/` folder

## Image Optimization

```bash
# Optimize images for production
npm run optimize:images

# Or use the Node.js script
node scripts/optimize.mjs
```

This converts PNGs to WebP format (80% quality) for faster loading.

## Environment Variables

For production, create a `.env` file:
```
PUBLIC_WEB3FORMS_KEY=your_access_key
```

Note: For Cloudflare Pages, environment variables can be set in the dashboard under Settings → Environment Variables.
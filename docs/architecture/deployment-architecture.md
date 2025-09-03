# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**
- **Platform:** Netlify with Git-based continuous deployment
- **Build Command:** `npm run generate`
- **Output Directory:** `dist/`
- **CDN/Edge:** Netlify Edge Network with global distribution and automatic SSL

**Backend Deployment:**
- **Platform:** Build-time processing only (no runtime backend)
- **Build Command:** Content processing during `nuxt generate`
- **Deployment Method:** Static files deployed to Netlify CDN

## CI/CD Pipeline
```yaml
# .github/workflows/build-deploy.yml
name: Build and Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Generate static site
        run: npm run generate
        env:
          NODE_ENV: production
      
      - name: Deploy to Netlify
        if: github.ref == 'refs/heads/main'
        uses: netlify/actions/build@master
        with:
          publish-dir: dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Environments
| Environment | Frontend URL | Backend URL | Purpose |
|------------|--------------|-------------|---------|
| Development | http://localhost:3000 | Build-time only | Local development with hot reload |
| Staging | https://staging--ccm-website.netlify.app | Build-time only | Pre-production testing and content preview |
| Production | https://ccm-website.com | Build-time only | Live static site |

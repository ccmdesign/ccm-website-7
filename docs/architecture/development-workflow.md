# Development Workflow

## Local Development Setup

### Prerequisites
```bash
# Node.js 18+ and npm
node --version  # Should be 18+
npm --version   # Should be 8+

# Git for content management
git --version
```

### Initial Setup
```bash
# Clone repository and install dependencies
git clone <repository-url> ccm-website
cd ccm-website
npm install

# Copy environment template
cp .env.example .env.local

# Generate TypeScript types
npm run build
```

### Development Commands
```bash
# Start development server with hot reload
npm run dev

# Build static site for production
npm run generate

# Preview generated static site locally
npm run preview

# Run all tests
npm run test

# Run component tests only
npm run test:components

# Run E2E tests
npm run test:e2e

# Lint and format code
npm run lint
npm run lint:fix
```

## Environment Configuration

### Required Environment Variables
```bash
# Development (.env.local)
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_PUBLIC_SITE_NAME="CCM Website"

# Production (.env)
NUXT_PUBLIC_SITE_URL=https://your-domain.com
NUXT_PUBLIC_SITE_NAME="CCM Website"
NUXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Build Configuration
NODE_ENV=production
NITRO_PRESET=netlify
```

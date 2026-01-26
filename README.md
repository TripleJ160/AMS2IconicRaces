# AMS2 Iconic Races

A curated web gallery showcasing historical racing moments from motorsport history, providing Automobilista 2 sim racers with exact setup configurations to recreate these iconic races.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI (Radix UI primitives)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library + fast-check (property-based testing)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The development server includes:
- **Hot Module Replacement**: Instant updates without full page reload
- **Fast Refresh**: Preserves component state during edits
- **Error Overlay**: Detailed error messages in the browser
- **TypeScript Checking**: Real-time type checking

### Build

Build the production application:

```bash
npm run build
```

This command:
- Compiles TypeScript to JavaScript
- Optimizes and bundles all code
- Generates static pages where possible
- Optimizes images and assets
- Creates a production-ready `.next` directory

To test the production build locally:

```bash
npm run build
npm start
```

The production server will run on [http://localhost:3000](http://localhost:3000).

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Deployment

### Deploy to Vercel

This application is optimized for deployment on Vercel. Follow these steps:

#### Option 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI globally:

```bash
npm install -g vercel
```

2. Login to your Vercel account:

```bash
vercel login
```

3. Deploy to production:

```bash
vercel --prod
```

The CLI will guide you through the deployment process. On first deployment, you'll be asked to:
- Link to an existing project or create a new one
- Confirm the project settings (framework preset: Next.js)
- Set the root directory (leave as default)

#### Option 2: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Visit [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your Git repository

5. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: .next (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

6. Click "Deploy"

Vercel will automatically:
- Install dependencies
- Run the build command
- Deploy your application to a production URL
- Set up automatic deployments for future commits

#### Environment Variables

This project currently uses local JSON files for data and doesn't require environment variables. If you add external APIs or services in the future, configure them in the Vercel dashboard under:

**Project Settings → Environment Variables**

#### Custom Domain

To add a custom domain:

1. Go to your project in the Vercel dashboard
2. Navigate to **Settings → Domains**
3. Add your domain and follow the DNS configuration instructions

#### Preview Deployments

Vercel automatically creates preview deployments for:
- Every push to non-production branches
- Every pull request

Preview URLs are unique and allow you to test changes before merging to production.

### Deployment Configuration

The project includes:

- **vercel.json**: Custom Vercel configuration with security headers
- **next.config.js**: Optimized Next.js settings for production
  - Image optimization (AVIF, WebP)
  - React strict mode
  - Compression enabled
  - Security headers

### Performance Optimization

The application is configured for optimal performance:

- **Image Optimization**: Automatic image optimization via Next.js Image component
- **Code Splitting**: Route-based code splitting via App Router
- **Compression**: Gzip/Brotli compression enabled
- **Edge Network**: Deployed to Vercel's global edge network
- **GPU-Accelerated Animations**: All animations use transform and opacity

### Monitoring

After deployment, monitor your application:

- **Analytics**: Enable Vercel Analytics in project settings
- **Speed Insights**: Enable Vercel Speed Insights for real-user metrics
- **Logs**: View deployment and runtime logs in the Vercel dashboard

## Project Structure

```
app/                    # Next.js App Router pages
├── layout.tsx         # Root layout with fonts and theme
├── page.tsx           # Gallery page (home)
└── globals.css        # Global styles with custom utilities

components/            # React components
├── ui/               # Shadcn/UI base components
├── gallery/          # Gallery-specific components
├── race-detail/      # Race detail page components
└── shared/           # Shared components

data/                 # Data files
├── races.json        # Race data store
└── ams2_*.json       # AMS2 reference data

lib/                  # Utility functions and helpers
```

## Design System

### Colors

- **Background**: Deep blacks (#0a0a0a, #141414, #1a1a1a)
- **Accent**: Formula 1 red (#dc0000), Racing yellow (#ffd700)
- **Text**: White (#ffffff), Gray shades (#a3a3a3, #737373)

### Typography

- **Display Font**: Russo One (headers, titles)
- **Body Font**: Geist Sans (body text, UI)

### Visual Effects

- **Glassmorphism**: Backdrop blur with semi-transparent backgrounds
- **Aurora Gradients**: Animated gradient backgrounds
- **Noise Texture**: Subtle grain overlay
- **3D Tilt**: Mouse-reactive card tilting
- **Animated Borders**: Gradient border glow on hover

## License

Private project - All rights reserved

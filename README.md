# AMS2 Iconic Races

A cinematic web gallery showcasing legendary motorsport moments, designed to help Automobilista 2 sim racers recreate iconic races with exact setup configurations.

## 🏁 Project Vision

**AMS2 Iconic Races** bridges the gap between motorsport history and modern sim racing. Instead of endlessly browsing forums or YouTube for race ideas, this curated gallery presents historically significant races with:

- **Cinematic presentation** inspired by racing game menus
- **Complete AMS2 setup data** (track, car, weather, AI count)
- **Historical context** (race significance, key moments, podium results)
- **One-click race launching** (future feature)

The goal is to make it effortless to experience the greatest moments in racing history within Automobilista 2.

## ✨ Features

### Current Features

- **Cinematic Hero Section**: Featured race of the week with dramatic full-screen presentation
- **Responsive Masonry Grid**: Adaptive card layout that works on all screen sizes
- **Search & Filter**: Find races by driver, track, year, or vehicle class
- **Race Detail Pages**: Deep dive into race history, setup details, and context
- **Dark Racing Aesthetic**: Game-inspired UI with noise texture, vignette, and scanline effects
- **Image Positioning Controls**: Fine-tune hero images with zoom and pan controls
- **Performance Optimized**: GPU-accelerated animations, lazy loading, reduced motion support

### Planned Features

- **Direct AMS2 Integration**: One-click race launching via custom protocol
- **User Submissions**: Community-contributed iconic races
- **Race Collections**: Curated playlists (e.g., "Senna's Greatest Drives")
- **YouTube Integration**: Embedded race footage and onboard cameras
- **Telemetry Comparison**: Compare your lap to the historical driver

## 🎨 Design Philosophy

The UI is inspired by modern racing game menus (Gran Turismo, F1 series) with:

- **Cinematic scale**: Large hero images, dramatic typography
- **Racing DNA**: Red accents, skewed labels, HUD-style information
- **Game software texture**: Noise overlay, vignette, scanline effects
- **Fluid layout**: Edge-to-edge design that fills the screen
- **Subtle motion**: Hover effects, transitions, and micro-interactions

## 🛠️ Tech Stack

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

## 📁 Project Structure

```
app/                    # Next.js App Router pages
├── layout.tsx         # Root layout with fonts, analytics, and theme
├── page.tsx           # Homepage with hero, search, and gallery
└── race/[id]/         # Dynamic race detail pages
    ├── page.tsx       # Race detail view
    ├── loading.tsx    # Loading skeleton
    └── not-found.tsx  # 404 page

components/            # React components
├── ui/               # Shadcn/UI base components (button, card)
├── gallery/          # Gallery components (RaceCard, BentoGrid)
├── homepage/         # Homepage components (CinematicHero, HeroSection)
├── race-detail/      # Race detail components (MediaSection, WeatherTimeline)
├── search/           # Search and filter components
└── shared/           # Shared components (SiteHeader, NoiseTexture, BackButton)

data/                 # Data files
├── races/            # Individual race JSON files
│   ├── group-c.json
│   ├── f-classic-gen1.json
│   └── opala79.json
└── ams2_*.json       # AMS2 reference data (tracks, vehicles, weather)

lib/                  # Utility functions and helpers
├── raceData.ts       # Race data loading and validation
├── filterUtils.ts    # Search and filter logic
├── types.ts          # TypeScript interfaces
└── hooks/            # Custom React hooks
```

## 🎨 Design System

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
- **Noise Texture**: Subtle grain overlay for game software feel
- **Vignette**: Radial gradient darkening at screen edges
- **Scanline Animation**: White gradient sweep on card hover
- **Desaturation**: Images go from 80% to 100% saturation on hover
- **3D Transforms**: GPU-accelerated scale and translate effects

## 🖼️ Image Positioning System

Each race can have custom image positioning for optimal composition:

```json
{
  "imageScale": 1.3,        // Zoom level (1.0 = normal, 1.5 = 50% zoom)
  "imageOffsetX": -50,      // Horizontal offset in pixels (negative = left)
  "imageOffsetY": 20,       // Vertical offset in pixels (positive = down)
  "imagePosition": "center center"  // CSS object-position fallback
}
```

This allows precise control over how hero images are displayed without cropping important elements.

## 🧪 Testing

The project uses property-based testing with fast-check to ensure correctness:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
```

Tests cover:
- Search and filter logic with random inputs
- Race data validation
- Component rendering and interactions
- Performance benchmarks

## 🚀 Contributing

Want to add an iconic race? Here's the structure:

```json
{
  "id": "unique-race-id",
  "title": "Race Title",
  "driver": "Driver Name",
  "team": "Team Name",
  "year": "1988",
  "tags": ["Category", "Track Type", "Era"],
  "description": "Compelling race description",
  "heroImage": "/images/race-image.png",
  "imageScale": 1.2,
  "imageOffsetX": 0,
  "imageOffsetY": -30,
  "youtubeId": "VIDEO_ID",
  "raceContext": {
    "event": "Race Event Name",
    "circuit": "Circuit Name, Country",
    "laps": 50,
    "distance": "300 km",
    "conditions": "Weather conditions",
    "wikipediaUrl": "https://...",
    "podiumResults": [],
    "keyMoments": ["Moment 1", "Moment 2"],
    "significance": "Why this race matters"
  },
  "ams2": {
    "trackId": 123456,
    "trackName": "Track_Name",
    "vehicleClassId": 789012,
    "vehicleClassName": "Class Name",
    "vehicleId": 345678,
    "vehicleName": "Car Name",
    "date": "1988-05-08",
    "time": "14:00",
    "aiCount": 29,
    "raceLength": "50 laps",
    "weather": [
      { "slot": 1, "weatherId": 123, "weatherName": "Clear" }
    ]
  }
}
```

## 📝 License

Private project - All rights reserved

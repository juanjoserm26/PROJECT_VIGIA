# PROJECT VIGIA - Copilot Development Instructions

## Project Overview

PROJECT VIGIA is an intelligent surveillance SaaS platform built with Next.js 16, Tailwind CSS, and TypeScript. This file provides guidance for developers working on this project.

## Architecture

### Key Technologies
- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Build Tool**: Turbopack
- **Package Manager**: npm

### Directory Structure
```
src/
├── app/                 # App Router pages and API routes
│   ├── api/            # RESTful API endpoints
│   ├── checkout/       # Checkout page
│   ├── plans/          # Pricing plans page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
└── components/         # Reusable components
    ├── Header.tsx
    ├── HeroCanvas.tsx
    ├── Features.tsx
    ├── PricingPlans.tsx
    ├── Testimonials.tsx
    ├── QRCode.tsx
    └── Footer.tsx
```

## Development Guidelines

### Component Development
1. Use functional components with React hooks
2. Implement props interfaces with TypeScript
3. Use Tailwind CSS for styling (no CSS modules needed)
4. Add 'use client' directive for client-side components
5. Keep components focused and reusable

### Page Development
1. New pages go in `src/app/` directory
2. Use dynamic routes with `[slug]` syntax if needed
3. Export metadata for SEO in all pages
4. Implement responsive design using Tailwind breakpoints

### API Routes
1. Create API routes in `src/app/api/`
2. Use Next.js Request/Response objects
3. Implement proper error handling
4. Use POST/GET/PUT/DELETE methods appropriately
5. Return JSON responses

### Styling
- Use Tailwind CSS utility classes exclusively
- Mobile-first approach: start with base styles, add responsive variants
- Common breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Support dark mode with `dark:` prefix

## Common Tasks

### Adding a New Page
1. Create directory: `src/app/new-page/`
2. Create `page.tsx` file
3. Import Header and Footer components
4. Export metadata for SEO
5. Use consistent layout structure

### Adding a New Component
1. Create file in `src/components/ComponentName.tsx`
2. Define TypeScript interfaces for props
3. Add 'use client' if component uses hooks
4. Export as default export
5. Update imports in pages that use it

### Adding API Endpoint
1. Create directory: `src/app/api/endpoint-name/`
2. Create `route.ts` file
3. Export handler functions: `GET`, `POST`, `PUT`, `DELETE`
4. Use NextResponse for responses
5. Add error handling

### Testing Locally
```bash
npm run dev              # Start dev server
npm run build            # Build production
npm run lint             # Run ESLint
```

## Performance Optimization

### Best Practices
- Use dynamic imports for large components
- Implement image optimization with Next.js `Image` component
- Use Suspense for loading states
- Minimize client-side JavaScript
- Cache static pages where appropriate

### Monitoring
- Check bundle size with `npm run build`
- Use React DevTools for component debugging
- Monitor network requests in browser DevTools
- Check Lighthouse scores for performance

## Security Considerations

- Sanitize user inputs before processing
- Never expose API keys in client-side code
- Use environment variables for secrets
- Validate all API request data
- Implement CSRF protection for forms
- Add rate limiting for API endpoints

## Deployment

### Build Steps
1. `npm run lint` - Check for errors
2. `npm run build` - Create optimized build
3. Test in production mode: `npm start`
4. Deploy `.next` directory to hosting

### Environment Variables
Create `.env.local` for local development:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Code Quality

### TypeScript
- Use strict mode
- Define interfaces for all props
- Use proper type annotations
- Avoid `any` type unless absolutely necessary

### ESLint
- Follow existing configuration
- Run `npm run lint` before commits
- Fix auto-fixable issues with `npm run lint -- --fix`

## Features & Implementation Details

### Canvas Visualization (HeroCanvas.tsx)
- Creates animated surveillance network
- Updates on window resize
- Uses requestAnimationFrame for smooth animation
- Responsive to device pixel ratio

### QR Code Generator (QRCode.tsx)
- Generates pseudo-QR codes for display
- Based on data string hash
- Includes position markers and timing patterns
- Customizable size

### Purchase Flow
- Simulates payment with 1-second delay
- 95% success rate for demo
- Generates transaction IDs
- Returns confirmation with QR code

## Troubleshooting

### Build Fails
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 20+)

### Dev Server Won't Start
- Check if port 3000 is in use
- Kill process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)
- Clear npm cache: `npm cache clean --force`

### Component Not Rendering
- Check for 'use client' directive on client components
- Verify imports are correct
- Check browser console for errors
- Use React DevTools extension

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

## Team Practices

### Code Review
- Check TypeScript compilation
- Verify responsive design on multiple devices
- Test API endpoints with various inputs
- Review security implications

### Commit Messages
- Use descriptive commit messages
- Reference issue numbers when applicable
- Keep commits atomic and focused

---

**Project Started**: May 7, 2026
**Framework Version**: Next.js 16.2.6
**Node Version Required**: 20.0+

# PROJECT VIGIA - Intelligent Surveillance Platform

An enterprise-grade intelligent surveillance SaaS platform built with **Next.js 16**, **Tailwind CSS**, and **TypeScript**. Features real-time monitoring, AI-powered analytics, responsive design, and a complete simulated purchase flow.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 9+

### Installation & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Hot reload enabled for all changes

### Build for Production

```bash
npm run build  # Create optimized production build
npm start      # Start production server
```

## ✨ Key Features

- **🎬 Responsive Landing Page** - Hero section with animated Canvas visualization
- **📊 Pricing Plans** - Three-tier pricing (Starter, Professional, Enterprise)
- **🛒 Checkout Flow** - Simulated payment processing with order confirmation
- **⚡ QR Code Generator** - Dynamic QR codes for verification
- **👥 Testimonials** - Customer success stories
- **📱 Mobile Optimized** - Fully responsive on all devices
- **🔐 Secure by Design** - TypeScript for type safety

## 📂 Project Structure

```
src/
├── app/
│   ├── api/checkout/           # Payment simulation API
│   ├── checkout/page.tsx       # Checkout page
│   ├── plans/page.tsx          # Pricing page
│   ├── page.tsx                # Home/landing page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
└── components/
    ├── Header.tsx              # Navigation
    ├── HeroCanvas.tsx          # Animated visualization
    ├── Features.tsx            # Features section
    ├── PricingPlans.tsx        # Pricing display
    ├── Testimonials.tsx        # Customer testimonials
    ├── QRCode.tsx              # QR generator
    └── Footer.tsx              # Footer

```

## 🛣️ Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page - Landing page with all sections |
| `/plans` | Pricing page - Plan comparison |
| `/checkout?plan=<plan>` | Checkout - Purchase simulation |
| `POST /api/checkout` | Payment API endpoint |

## 📱 Responsive Design

- **Mobile First** - Optimized for small screens
- **Tailwind CSS** - Utility-first styling
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- **Features**: Auto-responsive layouts, mobile menus, adaptive typography

## 💳 Purchase Flow Demo

1. **Browse** - View pricing on `/plans`
2. **Select** - Choose plan and click "Get Started"
3. **Checkout** - Enter payment details on `/checkout`
4. **Confirm** - Order confirmation with transaction ID & QR code
5. **Error Handling** - Graceful error recovery

**Demo Success Rate**: 95% (intentional for testing)

## 🎨 Technologies

- **Framework**: [Next.js 16](https://nextjs.org) - React with server-side rendering
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS
- **Language**: [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- **Build**: Turbopack - Ultra-fast bundler
- **Runtime**: Node.js 20+

## 🔧 Available Commands

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Create production build
npm start         # Start production server
npm run lint      # Run ESLint checks
```

## 📖 Documentation

### Full Documentation
- See [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed development guidelines

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

## 🔒 Security Notes

This is a **demonstration application**. For production use:

- Replace simulated payment API with real payment processor (Stripe, PayPal, etc.)
- Implement proper authentication and user management
- Add database for data persistence
- Enable HTTPS for all connections
- Implement rate limiting and DDoS protection
- Add comprehensive logging and monitoring
- Follow security best practices for sensitive data

## 📊 API Endpoints

### POST /api/checkout
Processes simulated payment

**Request:**
```json
{
  "plan": "Professional",
  "email": "user@example.com",
  "card": "card_info"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "VIGIA-1234567890",
  "plan": "Professional",
  "timestamp": "2024-05-07T23:00:00Z"
}
```

## 🎯 Component Details

### HeroCanvas
- Interactive HTML5 Canvas animation
- Simulates surveillance network topology
- Responsive to window resize
- 12 animated nodes with connections

### QRCode
- Generates visual QR-like patterns
- Position markers and timing patterns
- Customizable size and data
- Canvas-based rendering

### Header
- Responsive navigation
- Mobile hamburger menu
- Sticky positioning
- Logo and CTA buttons

### PricingPlans
- Three pricing tiers
- Feature comparison
- "Most Popular" highlight
- Free trial messaging

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Environment: Node.js 20+

## 📝 Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Kill process: `lsof -ti:3000 \| xargs kill -9` |
| Build fails | Clear `.next`: `rm -rf .next && npm install` |
| TypeScript errors | Run `npm run lint -- --fix` |
| Module not found | Reinstall: `rm -rf node_modules && npm install` |

## 📄 License

This project is provided for educational and demonstration purposes.

---

**Project**: PROJECT VIGIA - Intelligent Surveillance Platform
**Version**: 1.0.0
**Framework**: Next.js 16.2.6
**Node**: 20.0+
**Created**: May 7, 2026

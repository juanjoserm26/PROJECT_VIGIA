# PROJECT VIGIA - Intelligent Surveillance Platform

An enterprise-grade intelligent surveillance SaaS platform built with **Next.js 16**, **Tailwind CSS**, and **TypeScript**. Features real-time monitoring, AI-powered analytics, responsive design, and a complete simulated purchase flow.

## 🚀 Features

### Core Features
- **🎬 Real-time Video Monitoring** - Support for unlimited camera streams with 4K and 8K resolution
- **🤖 AI-Powered Analytics** - Intelligent threat detection and behavioral monitoring
- **📱 Fully Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **☁️ Cloud & On-Premise Options** - Flexible deployment models
- **🔐 Enterprise Security** - Bank-level encryption and GDPR compliance

### Platform Features
- **📊 Comprehensive Dashboard** - Real-time analytics and reporting
- **⚡ Instant Alerts** - Immediate notifications for suspicious activity
- **🎯 Advanced Detection** - AI-powered crowd analysis and behavioral insights
- **🌐 RESTful API Routes** - Easy integration with external systems
- **💳 Simulated Purchase Flow** - Complete checkout experience with QR codes

## 📋 Project Structure

```
app/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── checkout/   # Simulated payment API
│   │   ├── plans/          # Pricing plans page
│   │   ├── checkout/       # Checkout/purchase page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home/landing page
│   │   └── globals.css     # Global styles
│   └── components/         # Reusable React components
│       ├── Header.tsx      # Navigation header
│       ├── HeroCanvas.tsx  # Animated canvas visualization
│       ├── Features.tsx    # Features section
│       ├── PricingPlans.tsx # Pricing plans display
│       ├── Testimonials.tsx # Customer testimonials
│       ├── QRCode.tsx      # QR code generator
│       └── Footer.tsx      # Footer component
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🛠️ Technology Stack

- **Frontend**: React 19 with TypeScript
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack
- **API**: Next.js API Routes
- **Canvas**: HTML5 Canvas for interactive visualizations

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (includes npm)
- Windows/Mac/Linux

### Installation

1. **Navigate to the app directory**:
   ```bash
   cd app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Visit `http://localhost:3000`
   - The application will hot-reload on file changes

### Build for Production

```bash
npm run build
npm start
```

This creates an optimized production build in the `.next` directory.

## 📱 Pages & Routes

### Public Pages
- **`/`** - Home page with hero section, features, pricing, and testimonials
- **`/plans`** - Detailed pricing plans page
- **`/checkout?plan=<plan-name>`** - Purchase checkout page with QR code
  - `?plan=starter` - Starter plan ($99/month)
  - `?plan=professional` - Professional plan ($299/month)
  - `?plan=enterprise` - Enterprise plan ($999/month)

### API Routes
- **`POST /api/checkout`** - Process simulated payment
  - Request body:
    ```json
    {
      "plan": "Professional",
      "email": "user@example.com",
      "card": "payment card info"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "transactionId": "VIGIA-XXXXX",
      "plan": "Professional",
      "timestamp": "2024-05-07T23:00:00.000Z"
    }
    ```

## 🎨 Components

### Header
- Responsive navigation with mobile menu
- Logo and brand identity
- CTA buttons and navigation links

### HeroCanvas
- Animated HTML5 Canvas visualization
- Simulates a surveillance network with nodes and connections
- Responsive and performs well on all devices

### PricingPlans
- Three-tier pricing structure (Starter, Professional, Enterprise)
- Feature comparison
- Popular plan highlighting
- Free trial information

### Testimonials
- Customer success stories
- Star ratings
- Professional avatars

### QRCode
- Generates pseudo-QR codes for payment verification
- Customizable size and data
- Used in checkout page for order information

### Footer
- Newsletter subscription
- Company and product links
- Legal links
- Social media connections

## 💳 Simulated Purchase Flow

1. **Browse Plans** (`/plans`) - View pricing and features
2. **Select Plan** - Click "Get Started" on desired plan
3. **Checkout** (`/checkout?plan=XXX`) - Enter payment details
4. **Payment Processing** - Simulated 1-second delay
5. **Order Confirmation** - Success page with transaction ID and QR code
6. **Error Handling** - Graceful error messages if payment fails

**Success Rate**: 95% (for demo purposes)

## 🎯 Key Features Implementation

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- All pages fully functional on all screen sizes

### Canvas Visualization
- Real-time animated surveillance network
- Rotating nodes representing camera positions
- Pulsing effects and connections
- Scales automatically with window size

### Dark Mode Ready
- Tailwind CSS classes support dark mode
- Can be enabled via `dark:` prefix utilities

### Performance
- Next.js 16 with Turbopack for fast builds
- Code splitting and lazy loading
- Optimized images and assets
- TypeScript for type safety

## 📝 Environment Setup

The project uses `npm` as the package manager. All configuration is in:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.ts` - Next.js configuration

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

## 🔒 Security Notes

This is a demonstration application. For production:
- Replace simulated payment API with real payment processor (Stripe, PayPal, etc.)
- Implement proper authentication and authorization
- Add rate limiting and CSRF protection
- Use HTTPS for all transactions
- Store sensitive data securely
- Implement proper error logging and monitoring

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🤝 Support

For issues, questions, or suggestions, please refer to the respective library documentation or create an issue in your version control system.

---

**Last Updated**: May 7, 2026
**Framework**: Next.js 16.2.6
**Node.js**: 20.0+

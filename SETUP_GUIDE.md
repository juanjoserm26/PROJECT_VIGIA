# PROJECT VIGIA Setup Guide

Welcome to PROJECT VIGIA - Intelligent Surveillance Platform!

## 📍 Project Location

Your project is located in: `D:\Users\JUAN JOSÉ\Desktop\PROJECT_VIGIA\app`

## 🚀 Quick Start (3 Steps)

### Step 1: Navigate to Project
```powershell
cd app
```

### Step 2: Start Development Server
```powershell
$env:Path += ";C:\Program Files\nodejs"
npm run dev
```

### Step 3: Open in Browser
- Go to [http://localhost:3000](http://localhost:3000)
- Application is now running!

## 📋 What's Included

✅ **Next.js 16** - Modern React framework with App Router
✅ **Tailwind CSS 4** - Utility-first styling framework
✅ **TypeScript** - Type-safe JavaScript
✅ **Responsive Design** - Mobile, tablet, and desktop optimized
✅ **API Routes** - Backend endpoints for payment simulation
✅ **Canvas Visualization** - Animated surveillance network display
✅ **QR Code Generator** - Dynamic QR code generation
✅ **Pricing Plans** - Three-tier subscription model
✅ **Checkout Flow** - Simulated purchase experience
✅ **Testimonials** - Customer success stories

## 📂 Project Structure

```
PROJECT_VIGIA/
└── app/                           # Main application directory
    ├── src/
    │   ├── app/
    │   │   ├── api/checkout/      # Payment API endpoint
    │   │   ├── plans/             # Pricing page
    │   │   ├── checkout/          # Checkout page
    │   │   ├── page.tsx           # Home page
    │   │   └── layout.tsx         # Root layout
    │   └── components/            # React components
    │       ├── Header.tsx
    │       ├── HeroCanvas.tsx
    │       ├── Features.tsx
    │       ├── PricingPlans.tsx
    │       ├── Testimonials.tsx
    │       ├── QRCode.tsx
    │       └── Footer.tsx
    ├── README.md                  # Project documentation
    ├── package.json               # Dependencies
    ├── tailwind.config.ts         # Tailwind configuration
    └── tsconfig.json              # TypeScript configuration
```

## 🎯 Pages to Explore

1. **Home** - [http://localhost:3000](http://localhost:3000)
   - Landing page with hero section
   - Features showcase
   - Pricing overview
   - Testimonials

2. **Plans** - [http://localhost:3000/plans](http://localhost:3000/plans)
   - Detailed pricing tiers
   - Feature comparison
   - Subscribe buttons

3. **Checkout** - [http://localhost:3000/checkout?plan=professional](http://localhost:3000/checkout?plan=professional)
   - Payment form simulation
   - Order summary
   - QR code display
   - Transaction confirmation

## 🛠️ Available Commands

```powershell
# From the 'app' directory:

npm run dev       # Start development server (port 3000)
npm run build     # Create production build
npm start         # Start production server
npm run lint      # Run code quality checks
npm run lint -- --fix  # Auto-fix linting issues
```

## 📚 Documentation

- **Development Guide**: See `app/.github/copilot-instructions.md`
- **Full Documentation**: See `app/README.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

## 🔐 Test Credentials (Demo)

You can use any test values in the checkout form:
- **Email**: test@example.com
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: 12/25
- **CVC**: 123

Success Rate: 95% (intentional for demo)

## 💡 Key Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- All pages fully functional on all devices

### Canvas Animation
- Animated surveillance network in hero section
- Shows connected camera nodes
- Pulsing effects and connections
- Responsive sizing

### QR Code
- Generated on checkout confirmation
- Contains order information
- Pseudo-QR pattern for demo
- Customizable data and size

### API Endpoint
- `POST /api/checkout` - Process payments
- Simulates 1-second processing delay
- 95% success rate for testing

## 🐛 Troubleshooting

### Issue: "npm is not recognized"
**Solution**: Add Node.js to PATH:
```powershell
$env:Path += ";C:\Program Files\nodejs"
```

### Issue: Port 3000 already in use
**Solution**: The dev server will use a different port, or kill the process on 3000

### Issue: Build errors
**Solution**: 
1. Delete `node_modules` and `.next`
2. Run `npm install`
3. Run `npm run build` again

### Issue: TypeScript errors
**Solution**: Run `npm run lint -- --fix` to auto-fix issues

## 🚀 Next Steps

1. **Explore the Code**: Open files in VS Code
2. **Make Changes**: Edit React components and see hot-reload
3. **Test Features**: Try the checkout flow
4. **Build for Production**: Run `npm run build`
5. **Deploy**: Use Vercel or your preferred hosting

## 📞 Support

- Check the README.md for detailed documentation
- Review .github/copilot-instructions.md for development guidelines
- Visit the respective library documentation sites

## 📝 Notes

- This is a demonstration/template project
- For production, replace simulated payment with real processor (Stripe, PayPal, etc.)
- Implement proper authentication and data persistence
- Add comprehensive error logging and monitoring
- Follow security best practices for production deployment

---

**Happy Coding! 🎉**

For more information, navigate to the `app` directory and check the README.md file.

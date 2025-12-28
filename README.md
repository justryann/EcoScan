<div align="center">

# 🌿 EcoScan

### AI-Powered Product Sustainability & Health Analyzer

*Make informed choices about what you buy with real-time barcode scanning and AI analysis*

[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Report Bug](https://github.com/yourusername/ecoscan/issues) | [Request Feature](https://github.com/yourusername/ecoscan/issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🌍 About

**EcoScan** is a modern web application that empowers consumers to make healthier and more sustainable purchasing decisions. By simply scanning a product's barcode or entering it manually, users receive instant AI-powered analysis covering:

- **Health Impact**: Nutritional breakdown, health scores, and concerning ingredients
- **Environmental Impact**: Sustainability insights and eco-grade ratings
- **Smart Alternatives**: AI-suggested healthier and more eco-friendly product alternatives
- **Scan History**: Track and review all your scanned products
- **Interactive AI Chat**: Ask questions about products and get expert advice

Built with cutting-edge technologies including React 19, TypeScript, Framer Motion, and Google's Gemini AI, EcoScan delivers a beautiful, fast, and intelligent user experience.

---

## ✨ Features

### Core Functionality

- 🔍 **Real-time Barcode Scanning**: Use your device camera to scan EAN-13, EAN-8, UPC-A, UPC-E, and CODE-128 barcodes
- ⌨️ **Manual Entry**: Enter barcodes manually if camera scanning isn't available
- 🤖 **AI-Powered Analysis**: Deep product analysis using Google Gemini AI models
- 📊 **Comprehensive Product Data**: Integration with Open Food Facts database
- 💚 **Health & Eco Scores**: Visual scoring system with animated score rings
- 🔄 **Product Alternatives**: AI-suggested better alternatives for each product
- ⚠️ **Ingredient Alerts**: Identification and explanation of concerning ingredients

### User Experience

- 🌓 **Dark/Light Theme**: Full theme support with smooth transitions
- 🌐 **Multi-language**: English and French language support
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ✨ **Smooth Animations**: Beautiful transitions using Framer Motion
- 💬 **AI Chatbot**: Interactive assistant for product questions
- 📚 **Scan History**: Review and manage all previously scanned products
- 🔗 **Share Results**: Share product audits via native share or custom modal

### Technical Features

- ⚡ **Lightning Fast**: Built with Vite for instant hot module replacement
- 🎨 **Modern UI**: Tailwind CSS with custom design system
- 💾 **State Management**: Efficient global state with Zustand
- 🔐 **Type Safety**: Full TypeScript implementation
- 🎯 **Error Handling**: Comprehensive error states and user feedback
- 🔄 **Fallback System**: Multi-model AI fallback for reliability

---

## 🎥 Demo

### Screenshots

*Coming Soon - Add screenshots of your app in action*

### Live Demo

Try it yourself: [Live Demo Link](#) *(Deploy and add link)*

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://reactjs.org/) | 19.2.3 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.8.2 | Type safety |
| [Vite](https://vitejs.dev/) | 6.2.0 | Build tool & dev server |
| [React Router](https://reactrouter.com/) | 7.11.0 | Client-side routing |
| [Framer Motion](https://www.framer.com/motion/) | 12.23.26 | Animations |
| [Tailwind CSS](https://tailwindcss.com/) | - | Styling |
| [Zustand](https://github.com/pmndrs/zustand) | 5.0.9 | State management |
| [Lucide React](https://lucide.dev/) | 0.562.0 | Icon library |

### AI & Data

| Service | Purpose |
|---------|---------|
| [Google Gemini AI](https://ai.google.dev/) | Product analysis & chatbot |
| [Open Food Facts API](https://world.openfoodfacts.org/) | Product database |
| [html5-qrcode](https://github.com/mebjas/html5-qrcode) | Barcode scanning |

### Development Tools

- **Node.js**: Runtime environment
- **npm**: Package manager
- **ESLint**: Code linting
- **Git**: Version control

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.19.0 or higher recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
  
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

- **Git** (optional, for cloning)
  - Download from [git-scm.com](https://git-scm.com/)

- **Google Gemini API Key** (required)
  - Get your free key at [ai.google.dev](https://ai.google.dev/gemini-api/docs/api-key)

### Installation

1. **Clone the repository** (or download ZIP)

```bash
git clone https://github.com/yourusername/ecoscan.git
cd ecoscan
```

2. **Install dependencies**

```bash
npm install
```

This will install all required packages listed in `package.json`.

### Configuration

1. **Set up environment variables**

   Create or edit the `.env.local` file in the root directory:

   ```bash
   # Open .env.local in your editor
   ```

2. **Add your Gemini API key**

   Replace `PLACEHOLDER_API_KEY` with your actual API key:

   ```env
   # Get your free API key from: https://ai.google.dev/gemini-api/docs/api-key
   GEMINI_API_KEY=your_actual_api_key_here
   ```

   > ⚠️ **Important**: Never commit your actual API key to version control. The `.env.local` file is already in `.gitignore`.

3. **Save the file** and you're ready to go!

---

## 💻 Usage

### Running the Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

### Using the Application

1. **Homepage**: View dashboard with scan statistics and quick tips
2. **Scan Product**: 
   - Click "Nouveau Scan" / "New Scan"
   - Allow camera permissions
   - Point camera at product barcode OR click "Enter Manual" to type barcode
3. **View Results**: See health scores, eco-grades, and AI insights
4. **Explore Details**: Switch between Health, Eco, and Nutrition tabs
5. **Chat with AI**: Click the chat button to ask questions about the product
6. **View History**: Check all previously scanned products in the Journal
7. **Settings**: Toggle dark/light theme and switch languages (EN/FR)

---

## 📁 Project Structure

```
ecoscan/
│
├── .env.local              # Environment variables (API keys)
├── .gitignore             # Git ignore rules
├── index.html             # HTML entry point
├── index.tsx              # React entry point
├── App.tsx                # Main app component
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── README.md              # This file
│
├── components/            # Reusable React components
│   ├── FloatingChatbot.tsx    # AI chatbot interface
│   ├── Layout.tsx             # Main app layout & navigation
│   ├── LoadingAudit.tsx       # Loading state component
│   ├── Onboarding.tsx         # First-time user guide
│   ├── ScoreRing.tsx          # Animated score display
│   └── ShareModal.tsx         # Share functionality modal
│
├── pages/                 # Main application pages
│   ├── Home.tsx               # Dashboard/homepage
│   ├── Scan.tsx               # Barcode scanning page
│   ├── Result.tsx             # Product analysis results
│   └── History.tsx            # Scan history page
│
├── services/              # External service integrations
│   ├── gemini.ts              # Google Gemini AI integration
│   ├── off.ts                 # Open Food Facts API
│   └── translations.ts        # i18n translations
│
├── store.ts               # Zustand global state
├── types.ts               # TypeScript type definitions
│
└── node_modules/          # Installed dependencies (ignored by git)
```

### Key Files Explained

- **`App.tsx`**: Main application component with routing
- **`store.ts`**: Global state management (scan history, current product, user preferences)
- **`types.ts`**: TypeScript interfaces for Product, AIAnalysis, etc.
- **`services/gemini.ts`**: AI integration with fallback logic
- **`services/off.ts`**: Product data fetching from Open Food Facts
- **`vite.config.ts`**: Build configuration and environment variable mapping

---

## 🔌 API Integration

### Google Gemini AI

**Purpose**: Product analysis, alternative suggestions, and chatbot

**Models Used**:
- Primary: `gemini-3-flash-preview`
- Fallback: `gemini-flash-lite-latest`

**Features**:
- JSON schema validation for structured responses
- Automatic fallback on quota limits (429 errors)
- Error handling for safety filters
- Optional DeepSeek fallback

**Usage**:
```typescript
import { analyzeProduct, chatWithGemini, getQuickTip } from './services/gemini';

// Analyze a product
const analysis = await analyzeProduct(productData);

// Chat with AI
const response = await chatWithGemini(messages, context);

// Get eco tip
const tip = await getQuickTip();
```

### Open Food Facts API

**Purpose**: Product database lookup by barcode

**Endpoint**: `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`

**Data Retrieved**:
- Product name and brand
- Ingredients list
- Nutri-Score (health grade A-E)
- Eco-Score (environmental grade A-F)
- Nutritional information
- Product images

**Usage**:
```typescript
import { fetchProductData } from './services/off';

const product = await fetchProductData('3017620422003');
```

---

## 🔧 Development

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **State**: Zustand for global state, useState for local state
- **Routing**: React Router v7 with hash routing

### Environment Variables

The application uses Vite's environment variable system:

```typescript
// In vite.config.ts
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

Access in code:
```typescript
const apiKey = process.env.API_KEY;
```

### Adding New Features

1. **Create component** in `components/` or `pages/`
2. **Add route** in `App.tsx` if needed
3. **Update types** in `types.ts`
4. **Add to store** if global state is needed
5. **Test thoroughly** before committing

### Common Development Tasks

**Add a new page**:
```typescript
// pages/NewPage.tsx
import React from 'react';

const NewPage: React.FC = () => {
  return <div>New Page Content</div>;
};

export default NewPage;

// Add route in App.tsx
<Route path="/new-page" element={<NewPage />} />
```

**Add translation**:
```typescript
// services/translations.ts
export const translations = {
  en: {
    // ... existing
    newKey: 'English text'
  },
  fr: {
    // ... existing
    newKey: 'Texte français'
  }
};
```

**Add store state**:
```typescript
// store.ts
interface StoreState {
  // ... existing
  newValue: string;
  setNewValue: (val: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  // ... existing
  newValue: '',
  setNewValue: (val) => set({ newValue: val }),
}));
```

---

## 🚢 Deployment

### Build Process

```bash
# Create production build
npm run build

# Output is in dist/ directory
# dist/index.html - entry point
# dist/assets/ - bundled JS, CSS, and assets
```

### Deployment Options

#### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add `GEMINI_API_KEY` in Vercel dashboard → Settings → Environment Variables

#### Netlify

1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable `GEMINI_API_KEY`

#### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json:
   ```json
   "scripts": {
     "deploy": "vite build && gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`
4. Note: Environment variables must be in client-side code for static hosting

#### Docker

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t ecoscan .
docker run -p 8080:80 ecoscan
```

---

## 🐛 Troubleshooting

### Common Issues

#### "Analysis Error" after scanning

**Cause**: Gemini API key not configured or invalid

**Solution**:
1. Check `.env.local` has correct API key
2. Verify no extra spaces or quotes around the key
3. Restart dev server: `Ctrl+C` then `npm run dev`
4. Check API key is valid at [ai.google.dev](https://ai.google.dev/gemini-api/docs/api-key)

#### Camera not working

**Cause**: Browser permissions or HTTPS required

**Solution**:
1. Allow camera permissions when prompted
2. Use HTTPS in production (camera APIs require secure context)
3. Try "Enter Manual" option to type barcode

#### "Product not found in database"

**Cause**: Barcode not in Open Food Facts database

**Solution**:
1. Verify barcode is correct
2. Try a different product
3. Contribute to Open Food Facts to add missing products

#### Module not found errors

**Cause**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript errors

**Cause**: Type mismatches or missing type definitions

**Solution**:
1. Check `tsconfig.json` settings
2. Ensure all imports have correct types
3. Run `npm install` to get latest type definitions

#### Build fails

**Cause**: Various build-time issues

**Solution**:
```bash
# Clear cache and rebuild
rm -rf dist node_modules .vite
npm install
npm run build
```

### Debug Mode

Enable verbose logging:

```typescript
// In gemini.ts, set verbose: true
const ai = new GoogleGenAI({ 
  apiKey,
  verbose: true 
});
```

Check browser console for detailed error messages.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Code Guidelines

- Follow existing code style
- Add TypeScript types for all new code
- Write meaningful commit messages
- Test thoroughly before submitting PR
- Update documentation if needed

### Reporting Issues

Use GitHub Issues to report bugs or request features. Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node version)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 EcoScan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **[Google Gemini AI](https://ai.google.dev/)** - For powerful AI capabilities
- **[Open Food Facts](https://world.openfoodfacts.org/)** - For comprehensive product database
- **[React Team](https://react.dev/)** - For the amazing framework
- **[Vercel](https://vercel.com/)** - For Vite and deployment platform
- **[Tailwind CSS](https://tailwindcss.com/)** - For utility-first CSS
- **[Framer](https://www.framer.com/motion/)** - For smooth animations
- **[Lucide Icons](https://lucide.dev/)** - For beautiful icons

---

## 📞 Contact & Support

- **GitHub**: [Your GitHub Profile](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/ecoscan/issues)

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with 💚 by the EcoScan Team

*Empowering sustainable choices, one scan at a time.*

</div>

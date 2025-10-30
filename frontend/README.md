# Indian Spice Hub - Frontend

A modern React-based frontend application for an Indian restaurant food delivery platform built with Vite, React Router, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone and navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5174/`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── Logo.png               # Application logo
│   └── vite.svg               # Vite default icon
├── src/                       # Source code
│   ├── components/            # React components
│   │   ├── BuildUrPizza.jsx   # Custom meal builder (placeholder)
│   │   ├── Cart.jsx           # Shopping cart (placeholder)
│   │   ├── CheckLogin.jsx     # Login verification (placeholder)
│   │   ├── Homes.jsx          # Restaurant listing page
│   │   ├── Landing.jsx        # Landing/home page
│   │   ├── Login.jsx          # User login form
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── OrderPizza.jsx     # Menu page (placeholder)
│   │   ├── ProtectedRoute.jsx # Route protection wrapper
│   │   ├── Register.jsx       # User registration form
│   │   └── RestaurantCard.jsx # Restaurant display card
│   ├── data/                  # Static data
│   │   └── restaurants.jsx    # Restaurant listings data
│   ├── pages/                 # Page components
│   │   ├── Cart.jsx           # Cart page
│   │   ├── Checkout.jsx       # Checkout page
│   │   ├── Home.jsx           # Home page
│   │   ├── Login.jsx          # Login page
│   │   └── OrderSuccess.jsx   # Order confirmation page
│   ├── App.jsx                # Main app component
│   ├── AuthContext.jsx        # Authentication context
│   ├── index.css              # Global styles (Tailwind directives)
│   └── main.jsx               # Application entry point
├── dist/                      # Production build output
├── node_modules/              # Dependencies
├── .gitignore                 # Git ignore rules
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML template
├── package.json               # Project dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

## 🛠️ Technology Stack

### Core Technologies
- **React 19.1.1** - UI library with latest features
- **Vite 7.1.7** - Fast build tool and dev server
- **React Router DOM 7.9.5** - Client-side routing
- **Axios 1.13.1** - HTTP client for API requests

### Styling & UI
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

### Development Tools
- **ESLint 9.36.0** - Code linting
- **Vite Plugin React 5.1.0** - React support for Vite
- **TypeScript Types** - Type definitions for React

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |

## 🎨 Styling Architecture

### Tailwind CSS Setup
- **Configuration**: `tailwind.config.js`
- **PostCSS**: `postcss.config.js`
- **Global Styles**: `src/index.css`

### Design System
- **Color Palette**: Orange/red theme for Indian cuisine branding
- **Typography**: System fonts with responsive sizing
- **Components**: Utility-first approach with Tailwind classes
- **Responsive**: Mobile-first responsive design

## 🔐 Authentication System

### AuthContext (`src/AuthContext.jsx`)
- Centralized authentication state management
- Login/logout functionality
- Protected route access control

### Protected Routes
- `ProtectedRoute.jsx` - Wrapper for authenticated-only pages
- Automatic redirect to login for unauthenticated users
- Context-based authentication state

## 🧭 Routing Structure

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Landing | Public | Landing page with hero section |
| `/Login` | Login | Public | User login form |
| `/Register` | Register | Public | User registration form |
| `/Homes` | Homes | Public | Restaurant listings |
| `/Menu` | OrderPizza | Protected | Restaurant menu (placeholder) |
| `/BuildUrPizza` | BuildUrPizza | Protected | Custom meal builder (placeholder) |
| `/Cart` | Cart | Protected | Shopping cart (placeholder) |
| `/CheckLogin` | CheckLogin | Protected | Login verification (placeholder) |

## 📱 Key Features

### Landing Page (`Landing.jsx`)
- Hero section with animated elements
- Interactive mouse-following gradient background
- Animated statistics counters
- Call-to-action buttons
- Responsive design with mobile optimization

### Restaurant Listings (`Homes.jsx`)
- Grid layout of restaurant cards
- Restaurant information display
- Responsive card layout
- Integration with restaurant data

### Authentication Forms
- **Login**: Username/password authentication
- **Register**: Full user registration with validation
- Form validation and error handling
- Success/error messaging
- Automatic redirects after actions

### Navigation (`Navbar.jsx`)
- Responsive navigation bar
- Logo integration
- Authentication-aware menu items
- Mobile-friendly design
- Context-based user state

## 🔧 Configuration Files

### Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### PostCSS Configuration (`postcss.config.js`)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 🌐 API Integration

### Backend Communication
- **Base URL**: `http://localhost:8080`
- **Authentication**: `/login`, `/register`, `/logout`
- **HTTP Client**: Axios with JSON content-type
- **Error Handling**: Comprehensive error states and user feedback

### API Endpoints Used
- `POST /login` - User authentication
- `POST /register` - User registration  
- `GET /logout` - User logout

## 📊 Data Management

### Restaurant Data (`src/data/restaurants.jsx`)
- Static restaurant information
- Restaurant cards with ratings, distance, delivery time
- Image URLs for restaurant photos
- Pricing and promotional information

### State Management
- React Context for authentication
- Component-level state with useState hooks
- Form state management
- Loading and error states

## 🎯 User Experience Features

### Responsive Design
- Mobile-first approach
- Breakpoint-based responsive utilities
- Touch-friendly interface elements
- Optimized for various screen sizes

### Interactive Elements
- Hover effects and transitions
- Loading states and spinners
- Form validation feedback
- Animated counters and elements
- Mouse-following background effects

### Accessibility
- Semantic HTML structure
- Proper form labels and ARIA attributes
- Keyboard navigation support
- Screen reader friendly content

## 🚀 Deployment

### Production Build
```bash
npm run build
```
Generates optimized static files in the `dist/` directory.

### Build Output
- Minified JavaScript and CSS
- Optimized images and assets
- Production-ready HTML
- Source maps for debugging

## 🔍 Development Guidelines

### Code Style
- ESLint configuration for code quality
- Consistent component structure
- Functional components with hooks
- Modern JavaScript/ES6+ features

### Component Architecture
- Reusable component design
- Props-based component communication
- Context for global state
- Separation of concerns

### File Naming Conventions
- PascalCase for component files (`.jsx`)
- camelCase for utility files
- kebab-case for configuration files
- Descriptive and meaningful names

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Vite will automatically try alternative ports (5174, 5175, etc.)
   - Or manually specify: `npm run dev -- --port 3000`

2. **Tailwind Styles Not Loading**
   - Ensure PostCSS configuration is correct
   - Check Tailwind directives in `index.css`
   - Verify content paths in `tailwind.config.js`

3. **Build Errors**
   - Check for TypeScript errors: `npm run lint`
   - Ensure all imports are correct
   - Verify environment compatibility

### Development Server Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version compatibility

## 📈 Performance Optimization

### Build Optimizations
- Vite's built-in code splitting
- Tree shaking for unused code elimination
- Asset optimization and compression
- Modern JavaScript output

### Runtime Performance
- React 19 optimizations
- Efficient re-rendering with proper key props
- Lazy loading for route-based code splitting
- Optimized images and assets

## 🔮 Future Enhancements

### Planned Features
- Complete menu system implementation
- Shopping cart functionality
- Order management system
- Payment integration
- User profile management
- Order history and tracking

### Technical Improvements
- TypeScript migration
- Unit and integration testing
- Progressive Web App (PWA) features
- Advanced state management (Redux/Zustand)
- Real-time features with WebSockets

## 📞 Support

For development issues or questions:
1. Check the troubleshooting section above
2. Review Vite documentation: https://vitejs.dev/
3. Check React documentation: https://react.dev/
4. Review Tailwind CSS docs: https://tailwindcss.com/

---

**Built with ❤️ using modern web technologies for the best Indian food delivery experience.**
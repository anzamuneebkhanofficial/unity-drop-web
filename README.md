# Unity Drop Web - Frontend Application

## What This Frontend Does

Unity Drop Web is the user-facing part of our blood donation system. It provides a beautiful, easy-to-use interface for donors, patients, and administrators to interact with the blood donation platform.

### Main Features:
- **User Registration & Login**: Simple forms for new users to sign up and existing users to log in
- **Role-Based Dashboards**: Different interfaces for donors, patients, and admins
- **Blood Request Management**: Patients can create and track blood requests
- **Donor Response System**: Donors can view and respond to blood requests
- **Admin Control Panel**: Admins can manage users and view system statistics
- **Real-Time Updates**: Live status updates and notifications
- **Mobile-Friendly Design**: Works perfectly on phones and tablets

## How Users Interact With It

### 1. Landing Page
- Welcome screen explaining the blood donation system
- Easy navigation to register or login
- Information about how the platform works

### 2. User Registration
- Simple form to create new account
- Email verification with OTP
- Profile setup with blood type and location

### 3. Dashboard for Each Role

#### Donor Dashboard
- View nearby blood requests
- See donation history
- Update personal information
- Receive notifications for matching requests

#### Patient Dashboard
- Create new blood requests
- Track request status in real-time
- View donor responses
- Manage medical information

#### Admin Dashboard
- View system statistics and charts
- Approve new user registrations
- Manage all users and requests
- Send system-wide announcements

### 4. Common Features
- Profile management for all users
- Secure logout functionality
- Help and support sections
- Responsive design for all devices

## Technology Used

- **Next.js 15**: Modern React framework for fast web apps
- **React 19**: Latest version with improved performance
- **Tailwind CSS**: For beautiful, responsive styling
- **Framer Motion**: For smooth animations and transitions
- **Zustand**: For managing application state
- **React Hook Form**: For form handling and validation
- **Axios**: For communicating with the backend API
- **Recharts**: For data visualization and charts
- **Lucide React**: For beautiful icons

## Project Structure

```
unity-drop-web/
├── src/
│   ├── app/                   # Next.js app router pages
│   ├── components/            # Reusable UI components
│   ├── features/              # Feature-specific components
│   │   ├── auth/             # Authentication related
│   │   ├── donor/            # Donor-specific features
│   │   ├── patient/          # Patient-specific features
│   │   └── admin/            # Admin-specific features
│   ├── lib/                  # Utility functions and helpers
│   ├── hooks/                # Custom React hooks
│   ├── store/                # State management
│   └── styles/               # Global styles and configurations
├── public/                   # Static assets
└── components.json          # Component configuration
```

## Key Components

### Authentication Components
- Login and registration forms
- OTP verification
- Password reset
- Protected routes

### Dashboard Components
- Statistics cards and charts
- User lists and tables
- Request status displays
- Real-time notifications

### Form Components
- Blood request forms
- Profile update forms
- Search and filter forms
- Validation and error handling

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Unity Drop
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Run the Development Server
```bash
npm run dev
```

The app will start at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Design Features

### User Experience
- **Mobile-First Design**: Works great on all screen sizes
- **Dark/Light Mode**: Easy on the eyes in any lighting
- **Smooth Animations**: Pleasant transitions and micro-interactions
- **Loading States**: Clear feedback during data loading
- **Error Handling**: User-friendly error messages

### Accessibility
- **Keyboard Navigation**: Works without a mouse
- **Screen Reader Support**: Compatible with assistive technologies
- **High Contrast**: Clear text for better readability
- **Semantic HTML**: Proper structure for search engines

### Performance
- **Code Splitting**: Loads only what's needed
- **Image Optimization**: Fast loading images
- **Caching**: Stores frequently used data
- **Lazy Loading**: Loads content as needed

## Security Features

- **Input Validation**: All user inputs are checked
- **XSS Protection**: Prevents cross-site scripting
- **Secure Cookies**: Safe session management
- **API Security**: Protected communication with backend

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Touch-friendly buttons
- Simplified navigation
- Optimized forms

### Tablet (768px - 1024px)
- Two-column layouts
- Enhanced navigation
- Better use of screen space

### Desktop (> 1024px)
- Full multi-column layouts
- Hover states and tooltips
- Rich data visualizations
- Keyboard shortcuts

## Browser Support

Works perfectly on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Common Issues and Solutions

### Development Issues
- **Port Already in Use**: The app will automatically find an available port
- **API Connection Error**: Check that backend is running on port 8000
- **Build Errors**: Clear node_modules and reinstall dependencies

### Performance Issues
- **Slow Loading**: Check network connection and API response times
- **Memory Usage**: Close unused browser tabs
- **Battery Usage**: Reduce animations on mobile devices

## How to Add New Features

1. Create components in the appropriate feature folder
2. Add routes in the app directory
3. Update state management if needed
4. Add tests for new functionality
5. Update documentation

## Testing

- Component testing with React Testing Library
- End-to-end testing with Cypress (if needed)
- Performance testing with Lighthouse
- Accessibility testing with axe-core

## Deployment

### Vercel (Recommended)
- Connect your GitHub repository
- Automatic deployments on push
- Built-in performance monitoring

### Other Platforms
- Export static files with `npm run build`
- Deploy to any static hosting service
- Configure environment variables

## Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify backend connection
3. Clear browser cache and cookies
4. Check environment variables
5. Review the documentation

## Contributing

1. Follow the existing code style
2. Use TypeScript for new components
3. Add proper error handling
4. Test on multiple devices
5. Update documentation

## License

This project is licensed under the ISC License.

---

*Building a better way to connect blood donors with those in need* 🩸

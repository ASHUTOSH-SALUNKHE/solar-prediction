# SolarPrediction - AI-Powered Solar Panel Recommendation System

A modern web application that leverages artificial intelligence to provide personalized solar panel recommendations based on user location, energy consumption, and environmental factors. Built with Next.js, Convex, and integrated AI services for a seamless user experience.

## � Features

### Core Functionality
- **AI Voice Consultant**: Interactive voice conversations with an AI solar expert using Vapi AI
- **Location-Based Analysis**: Precise solar recommendations based on geographical coordinates and weather data
- **Personalized Plans**: Detailed solar panel configurations including capacity, panel count, tilt angles, and cost estimates
- **Real-Time Weather Integration**: Fetches historical weather data from Open-Meteo API for accurate calculations
- **Cost-Benefit Analysis**: Comprehensive financial projections including monthly savings, payback periods, and ROI

### Technical Features
- **User Authentication**: Secure authentication using Clerk
- **Real-Time Database**: Convex for scalable data management
- **AI-Powered Generation**: Google Gemini AI for intelligent solar plan creation
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI components
- **Voice Integration**: Seamless voice interactions for natural user experience

##  Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Beautiful icons

### Backend & Database
- **Convex** - Real-time database and serverless functions
- **Clerk** - User authentication and management

### AI & Integrations
- **Google Generative AI (Gemini)** - AI-powered solar plan generation
- **Vapi AI** - Voice conversation platform
- **Open-Meteo API** - Weather data provider
- **OpenStreetMap Nominatim** - Reverse geocoding for location names

##  Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   \\\ash
   git clone https://github.com/your-username/solarprediction.git
   cd solarprediction
   \\\

2. **Install dependencies**
   \\\ash
   npm install
   \\\

3. **Environment Setup**
   Create a \.env.local\ file in the root directory with the following variables:

   \\\env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

   # Convex Database
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   CONVEX_DEPLOYMENT=your_convex_deployment

   # AI Services
   GEMINI_API_KEY=your_google_gemini_api_key
   NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id
   \\\

4. **Convex Setup**
   \\\ash
   npx convex dev
   \\\

5. **Run the development server**
   \\\ash
   npm run dev
   \\\

   Open [http://localhost:3000](http://localhost:3000) to view the application.

##  Project Structure

\\\
solarprediction/
 app/                          # Next.js App Router
    (auth)/                   # Authentication pages
    about/                    # About page
    generate-program/         # AI voice consultation
    locationEntry/            # Location input
    profile/                  # User dashboard
    globals.css               # Global styles
    layout.tsx                # Root layout
    page.tsx                  # Home page
 components/                   # Reusable components
    ui/                       # UI components (Radix)
    Navbar.tsx                # Navigation
    Footer.tsx                # Footer
    ...
 convex/                       # Backend functions
    auth.config.ts            # Authentication config
    http.ts                   # HTTP routes & webhooks
    plans.ts                  # Solar plan mutations/queries
    schema.ts                 # Database schema
    users.ts                  # User management
 lib/                          # Utility libraries
    utils.ts                  # Helper functions
    vapi.ts                   # Vapi AI configuration
 providers/                    # Context providers
 public/                       # Static assets
\\\

##  Database Schema

### Users Table
\\\	ypescript
{
  name: string,
  email: string,
  image?: string,
  clerkId: string
}
\\\

### Plans Table
\\\	ypescript
{
  userId: string,
  recommended_capacity_kw: number,
  total_solar_panel: number,
  panel_rating: number,
  tilt_angle: number,
  solar_panel_type: string,
  location: string,
  required_area_sq_m: number,
  estimated_monthly_generation_kwh: number,
  estimated_monthly_savings_inr: number,
  estimated_cost_inr: number,
  payback_period_years: number,
  maintenance_advice: string,
  notes?: string,
  isActive: boolean
}
\\\

### Weather Data Table
\\\	ypescript
{
  userId: string,
  Latitude: number,
  Longitude: number,
  userLocation: string,
  monthly_data: Array<{
    month: number,
    min_temperature?: number,
    max_temperature?: number,
    average_humidity?: number,
    average_windspeed?: number,
    average_radiation?: number
  }>
}
\\\

##  API Endpoints

### Convex HTTP Routes
- \POST /clerk-webhook\ - Handle Clerk authentication webhooks
- \POST /vapi/generate-program\ - Generate solar plans via AI

### Key Mutations & Queries
- \plans.createPlan\ - Create new solar plan
- \plans.getUserPlans\ - Retrieve user's solar plans
- \plans.createWeatherData\ - Store weather data
- \plans.getWeather\ - Fetch weather data for user

##  Usage Flow

1. **User Registration**: Sign up/login via Clerk authentication
2. **Location Entry**: Input latitude/longitude coordinates
3. **Weather Data Fetching**: System retrieves historical weather data
4. **AI Consultation**: Voice conversation with AI solar consultant
5. **Plan Generation**: AI analyzes data and creates personalized plan
6. **Profile View**: User can view and manage their solar plans

##  AI Integration

### Google Gemini AI
- Generates personalized solar recommendations
- Considers weather data, energy consumption, shade conditions, and environmental factors
- Provides detailed technical specifications and financial analysis

### Vapi AI
- Enables natural voice conversations for data collection
- Handles complex user queries about solar requirements
- Provides real-time responses and clarifications

##  Key Calculations

### Solar Capacity Estimation
- Based on monthly electricity consumption
- Adjusted for shade, weather conditions, and seasonal variations
- Considers system losses (dust, heat, wiring efficiency)

### Financial Analysis
- Monthly savings calculated using local electricity rates
- Payback period based on installation costs vs. savings
- ROI projections over 25-year panel lifetime

### Weather Impact Analysis
- Radiation data for solar irradiance calculations
- Temperature adjustments for panel efficiency
- Humidity and wind considerations for maintenance recommendations

##  Development

### Available Scripts
\\\ash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
\\\

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (via ESLint)

##  Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Convex Deployment
\\\ash
npx convex deploy
\\\

##  Contributing

1. Fork the repository
2. Create a feature branch (\git checkout -b feature/amazing-feature\)
3. Commit your changes (\git commit -m 'Add amazing feature'\)
4. Push to the branch (\git push origin feature/amazing-feature\)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- **Ashutosh Narendra Salunkhe** - Project Founder & Developer
- Open-source libraries and frameworks used
- AI service providers (Google, Vapi)
- Weather data providers (Open-Meteo, OpenStreetMap)

##  Contact

For questions or support, please contact the project maintainer.

---

**Built with  for a sustainable future**


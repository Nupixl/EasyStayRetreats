# Easy Stay Retreats - Property Search Platform

A modern property search and booking platform built with Webflow Cloud and Next.js, featuring an interactive map and advanced search filters.

## Features

- 🏠 **Property Search**: Simple filtering by location, dates, and guest count
- 🗺️ **Interactive Google Maps**: Visual property browsing with security-radius markers
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Webflow Integration**: Seamless component syncing with Webflow Designer
- 🎨 **Modern UI**: Clean, minimalistic interface with Tailwind CSS
- 🔒 **Security-First**: Property locations shown with radius for privacy protection

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Design**: Webflow Cloud with DevLink
- **Mapping**: Interactive map component (ready for Google Maps/Mapbox integration)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Webflow account with Cloud access
- Webflow project ID: `609dfa12a141dd6e70976d48`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EasyStayRetreats
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # Google Maps API Key (required for map functionality)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   
   # Supabase Configuration (optional, for additional data)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Webflow Configuration
   NEXT_PUBLIC_WEBFLOW_SITE_ID=609dfa12a141dd6e70976d48
   ```

4. **Authenticate with Webflow**
   ```bash
   npm run webflow:auth
   ```

5. **Sync Webflow components**
   ```bash
   npm run webflow:sync
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
EasyStayRetreats/
├── app/                    # Next.js app directory
│   ├── search-properties/  # Property search page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Custom React components
│   └── InteractiveMap.tsx # Map component
├── devlink/              # Webflow synced components
│   ├── PropertyCard.tsx  # Property listing card
│   └── EnhancedSearchFilters.tsx # Search filters
├── lib/                  # Utilities and types
│   └── types.ts         # TypeScript definitions
└── styles/              # Global styles
```

## Webflow Integration

This project uses Webflow DevLink to sync components between Webflow Designer and the React application.

### Available Components

- **Property Card**: Displays property information with image, price, and amenities
- **Enhanced Search Filters**: Advanced filtering interface with location, dates, and amenities
- **Interactive Map**: Map component for visual property browsing

### Syncing Components

To sync the latest components from Webflow:

```bash
npm run webflow:sync
```

This will update the components in the `devlink/` directory with the latest designs from your Webflow project.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run webflow:sync` - Sync Webflow components
- `npm run webflow:auth` - Authenticate with Webflow

### Adding New Features

1. **Design in Webflow**: Create new components in the Webflow Designer
2. **Sync Components**: Run `npm run webflow:sync` to import components
3. **Implement Logic**: Add React logic and state management
4. **Test**: Verify functionality across different screen sizes

## Deployment

### Webflow Cloud

This project is configured for deployment on Webflow Cloud:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Webflow Cloud**
   ```bash
   webflow cloud deploy
   ```

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_WEBFLOW_SITE_ID=609dfa12a141dd6e70976d48
NEXT_PUBLIC_MAP_API_KEY=your_map_api_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@easystayretreats.com or join our Slack channel.

---

Built with ❤️ using Webflow Cloud and Next.js

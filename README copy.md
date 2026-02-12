# Vercera 5.0 - Technical Fest Website

A modern, minimal, and fully-featured website for Vercera 5.0, a national-level technical fest showcasing hackathons, robotics, gaming, and other innovative events.

## Features

### Core Features
- **Modern Dark Theme**: Premium dark aesthetic with teal/cyan accents
- **Responsive Design**: Fully mobile-friendly with adaptive layouts
- **Event Management**: Browse, filter, and register for events
- **User Authentication**: Login/Signup system with persistent sessions
- **Event Registration**: Seamless registration workflow with multiple events
- **Payment Integration**: Razorpay integration for secure payments
- **User Dashboard**: View registrations, track payments, and manage profile
- **FAQ Section**: Comprehensive Q&A about the fest
- **Contact Page**: Direct communication with organizers

### Event Features
- **Event Listings**: Browse all technical and non-technical events
- **Event Details**: Comprehensive information including rules, prize breakdown, and venue details
- **Registration Progress**: Visual indicators showing registration capacity
- **Multiple Event Categories**: Technical and non-technical event separation
- **Prize Pool Display**: Clear prize breakdown for each event

### User Features
- **Secure Authentication**: Email-based login/signup with validation
- **User Profile**: Store college affiliation, phone number, and other details
- **Registration Tracking**: View all registered events with payment status
- **Dashboard**: Personalized user dashboard with event management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **Database Ready**: Prepared for Supabase, Neon, or other databases
- **Payment**: Razorpay integration for payments

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx                 # Home/Landing page
│   ├── layout.tsx               # Root layout with theme setup
│   ├── globals.css              # Global styles and dark theme
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── dashboard/               # User dashboard
│   ├── events/
│   │   ├── page.tsx             # Events listing page
│   │   └── [id]/                # Event detail page
│   ├── checkout/[eventId]/      # Payment/checkout page
│   ├── contact/                 # Contact us page
│   ├── terms/                   # Terms of service
│   └── privacy/                 # Privacy policy
├── components/
│   ├── navbar.tsx               # Navigation bar
│   ├── hero.tsx                 # Hero section
│   ├── events-section.tsx       # Featured events section
│   ├── faq-section.tsx          # FAQ section
│   ├── footer.tsx               # Footer
│   └── ui/                      # shadcn/ui components
├── lib/
│   └── events.ts                # Event data and types
└── package.json                 # Dependencies

```

## Getting Started

### Installation

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

## Features Documentation

### Landing Page
- Eye-catching hero section with gradient text
- Impressive stats (50+ events, 5000+ participants, 50L+ prize pool)
- Featured events showcase
- FAQ section
- Call-to-action buttons

### Events Page
- Filter events by category (Technical/Non-Technical)
- Event cards with quick stats
- Registration progress indicators
- Direct links to event details

### Event Details
- Complete event information
- Rules and guidelines
- Prize breakdown
- Registration form
- Real-time spot availability

### Authentication
- Email-based signup with validation
- Secure login with password
- Persistent sessions using localStorage (upgrade to secure cookies in production)
- Redirect to previous page after login

### Payment Flow
1. User clicks "Register Now" on event
2. Redirected to login if not authenticated
3. Filled registration details on checkout page
4. Razorpay payment processing (mock in development)
5. Confirmation and redirect to dashboard

### User Dashboard
- Profile information display
- Registration history
- Payment status tracking
- Quick access to registered events
- Logout functionality

## Customization

### Colors and Theme
Edit `/app/globals.css` to customize the color scheme:
- `--primary`: Main accent color (currently: teal #06b6d4)
- `--secondary`: Secondary background color
- `--accent`: Highlight color for interactive elements

### Events Data
Modify `/lib/events.ts` to:
- Add new events
- Update prize pools and registration fees
- Change event details and rules

### Navigation and Routes
Update `/components/navbar.tsx` to add/remove navigation links

## Future Enhancements

1. **Database Integration**
   - Connect to Supabase or Neon for persistent data storage
   - Store user profiles and registrations

2. **Real Razorpay Integration**
   - Implement server-side payment verification
   - Handle webhooks for payment status updates
   - Implement refund system

3. **Enhanced Authentication**
   - OAuth integration (Google, GitHub)
   - Email verification
   - Password reset functionality
   - Two-factor authentication

4. **Admin Panel**
   - Event management
   - Registration tracking
   - Payment analytics
   - Participant management

5. **Email System**
   - Confirmation emails for registration
   - Payment receipts
   - Event reminders
   - Important announcements

6. **Analytics**
   - Event analytics dashboard
   - Registration trends
   - Payment tracking
   - User engagement metrics

## Environment Variables

Currently uses localStorage for development. For production, add these to your `.env.local`:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## API Routes (Ready for Implementation)

Recommended API routes to implement:

```
POST /api/auth/signup           # User registration
POST /api/auth/login            # User login
POST /api/events                # Get events
GET  /api/events/[id]           # Get event details
POST /api/checkout/create-order # Create payment order
POST /api/checkout/verify       # Verify payment
GET  /api/user/profile          # Get user profile
GET  /api/user/registrations    # Get user registrations
```

## Security Considerations

1. **Current State (Development)**
   - Uses localStorage for authentication (NOT secure)
   - Payment flow is mocked

2. **Production Requirements**
   - Move auth to secure httpOnly cookies
   - Implement server-side session management
   - Validate all inputs server-side
   - Use HTTPS only
   - Implement CORS properly
   - Add rate limiting
   - Validate payments server-side with Razorpay webhook

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- Build: `pnpm build`
- Start: `pnpm start`
- Node.js 18+ required

## Support

For issues or questions:
- Email: info@vercera.com
- Phone: +91 9999 999 999
- Website: https://vercera5.0

## License

All rights reserved. Vercera 5.0 - Technical Fest 2024

## Credits

Built with:
- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Razorpay

# Vercera 5.0 Quick Start Guide

Get the Vercera 5.0 website up and running in minutes!

## 1. Installation (2 minutes)

```bash
# Clone or download the project
cd vercera-5.0

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

## 2. First-Time Login

### Create an Account
1. Click **"Sign Up"** in the navbar
2. Fill in your details:
   - Full Name
   - Email
   - College Name
   - Password
3. Click **"Create Account"**
4. You'll be redirected to dashboard

### Test Login
1. Click **"Login"** in the navbar
2. Use credentials from signup
3. Click **"Sign In"**

## 3. Browse Events

1. Click **"Explore Events"** on homepage or navigate to `/events`
2. See all 6 sample events
3. Filter by category:
   - All Events
   - Technical Events
   - Non-Technical Events

## 4. Register for an Event

1. Click any event or **"View Details"**
2. Scroll to the event details page
3. Click **"Register Now"** button
4. Fill in registration form:
   - Team Name (optional)
   - Member Emails (if team event)
   - Additional Info
5. Check the agreement checkbox
6. Click **"Pay & Register"**
7. Payment form appears (mock payment in development)
8. Click **"Pay ₹XXX & Register"**
9. After payment, you'll be redirected to dashboard

## 5. Check Your Dashboard

1. Click your profile or go to `/dashboard`
2. See your profile information
3. View registration history
4. Track payment status
5. See total amount spent

## 6. Customize Events

Edit the events data in `/lib/events.ts`:

```typescript
// Add new event
{
  id: '7',
  name: 'Your Event Name',
  category: 'technical',
  description: 'Short description',
  longDescription: 'Detailed description...',
  image: '/images/event.jpg',
  date: 'Date and time',
  time: 'Time duration',
  venue: 'Venue name',
  registrationFee: 1500,
  prizePool: 100000,
  maxParticipants: 50,
  registeredCount: 0,
  rules: ['Rule 1', 'Rule 2'],
  prizes: [
    { position: '1st Prize', amount: 50000 },
  ],
}
```

## 7. Customize Theme

Edit `/app/globals.css` to change colors:

```css
:root {
  /* Change primary accent color */
  --primary: 188 94% 38%;  /* Currently: teal */
  
  /* Change secondary background */
  --secondary: 20 14% 12%; /* Currently: dark gray */
  
  /* Change accent color */
  --accent: 188 94% 38%;   /* Currently: teal */
}
```

**Color Format**: `hue saturation lightness` (HSL)

### Popular Color Combinations

**Purple & Lavender**
```css
--primary: 280 85% 55%;
--accent: 280 85% 55%;
```

**Blue & Cyan**
```css
--primary: 210 100% 50%;
--accent: 210 100% 50%;
```

**Orange & Yellow**
```css
--primary: 30 100% 50%;
--accent: 30 100% 50%;
```

**Green & Mint**
```css
--primary: 160 100% 40%;
--accent: 160 100% 40%;
```

## 8. Customize College Info

Update navigation in `/components/navbar.tsx`:
```typescript
<Link href="/" className="flex items-center gap-2">
  <span>Your College Name</span>
</Link>
```

Update footer in `/components/footer.tsx`:
```typescript
<h4>Contact Us</h4>
<p>Your College Name</p>
<p>Your Location</p>
<p>+91 YOUR PHONE</p>
<p>your-email@college.edu</p>
```

## 9. Test Different Scenarios

### Test User Registration
1. Create multiple accounts
2. Register for different events
3. Verify dashboard shows all registrations

### Test Event Filtering
1. Go to `/events`
2. Click "Technical" filter
3. Click "Non-Technical" filter
4. Click "All Events"

### Test Form Validation
1. Try to submit empty forms
2. Try invalid email format
3. Try password mismatch
4. See error messages appear

### Test Logout
1. Go to dashboard
2. Click "Logout" button
3. You'll be redirected to homepage
4. Try to access `/dashboard` (redirects to login)

## 10. Next Steps - Implement Backend

### Set up Database (Choose One)

**Option A: Supabase**
```bash
npm install @supabase/supabase-js
```

**Option B: Neon**
```bash
npm install @neondatabase/serverless
```

**Option C: MongoDB**
```bash
npm install mongodb
```

### Implement Razorpay Payments
See `RAZORPAY_SETUP.md` for detailed guide

### Add Email Service
```bash
npm install nodemailer  # or your preferred service
```

## Common Tasks

### Change Fest Name
1. Update in `app/layout.tsx` (title)
2. Update in `components/navbar.tsx` (logo)
3. Update in `components/hero.tsx` (heading)
4. Update in `components/footer.tsx` (footer text)

### Change Event Venue Location
1. Edit `/lib/events.ts`
2. Update `venue` field in each event
3. Update in `/components/footer.tsx`

### Add New Pages
1. Create new folder in `/app`
2. Add `page.tsx` file
3. Import navbar and footer
4. Route automatically available

### Add New Navigation Links
1. Edit `/components/navbar.tsx`
2. Add new Link in the navigation menu
3. Update both desktop and mobile menus

## Project Structure Quick Reference

```
/
├── app/
│   ├── page.tsx              # Home page
│   ├── events/               # Events pages
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── dashboard/            # User dashboard
│   ├── checkout/             # Payment page
│   └── globals.css           # Theme colors
├── components/
│   ├── navbar.tsx            # Top navigation
│   ├── hero.tsx              # Hero section
│   ├── events-section.tsx    # Events grid
│   ├── footer.tsx            # Footer
│   └── ui/                   # UI components
├── lib/
│   └── events.ts             # Event data
└── README.md                 # Full documentation
```

## Build & Deploy

### Build for Production
```bash
pnpm build
```

### Run Production Build Locally
```bash
pnpm start
```

### Deploy to Vercel
1. Push code to GitHub
2. Connect to Vercel.com
3. Vercel auto-detects Next.js
4. Click Deploy
5. Done! 🎉

### Deploy to Other Platforms

**Docker**
```bash
docker build -t vercera .
docker run -p 3000:3000 vercera
```

**Traditional Node.js Hosting**
```bash
pnpm build
npm install -g pm2
pm2 start npm --name "vercera" -- start
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Use different port
pnpm dev -p 3001
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Styles Not Loading
```bash
# Rebuild Tailwind CSS
npm run build
```

### Login Redirect Loop
- Check if userToken is stored in localStorage
- Open DevTools > Application > Local Storage
- Verify userToken exists

## Tips & Tricks

### Quick Feature Testing
1. **Edit event**: Change `/lib/events.ts`
2. **Change color**: Modify `--accent` in `globals.css`
3. **Add button**: Use existing `Button` from shadcn
4. **Change text**: Find and replace in IDE

### Development Shortcuts
- `Cmd/Ctrl + K` - Quick command palette in VS Code
- `Cmd/Ctrl + Shift + P` - Open settings
- `Cmd/Ctrl + /` - Quick comment/uncomment

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
```

## Need Help?

- **React**: https://react.dev
- **Next.js**: https://nextjs.org
- **Tailwind**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev

## Success Checklist

- [ ] Project runs locally at localhost:3000
- [ ] Can create account and login
- [ ] Can browse all events
- [ ] Can register for events
- [ ] Can see dashboard with registrations
- [ ] Theme colors customized to your preference
- [ ] College name and details updated
- [ ] Events customized with your fest details
- [ ] Ready to implement backend features

Congratulations! You have a fully functional Vercera website! 🎉

---

**Questions?** Check `README.md` or `IMPLEMENTATION.md` for more details.

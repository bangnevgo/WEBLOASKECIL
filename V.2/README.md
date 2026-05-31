# Hukum Asumsi - Learning Management System

Platform pembelajaran modern untuk menguasai Hukum Asumsi (Law of Assumption) berdasarkan ajaran Neville Goddard.

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase PostgreSQL
- **Content Management**: Sanity CMS (headless)
- **Authentication**: JWT + Bcrypt
- **Payment**: Midtrans (Indonesia payment gateway)
- **Real-time**: Socket.io, WebSocket
- **State Management**: Zustand, SWR

## Features

- ✅ **User Authentication**: Registration, Login, Profile Management
- 🎓 **Learning Platform**: 49 Lessons in 10 Courses
- 📊 **Progress Tracking**: Monitor learning progress and earn certificates
- 👥 **Community Forum**: Discussion and knowledge sharing
- 🎥 **Live Classes**: Interactive learning sessions with instructors
- 🤖 **AI Tutoring**: Personalized recommendations and chatbot assistance
- 📈 **Analytics Dashboard**: Track student progress and course performance
- 💳 **Subscription System**: Monthly/Yearly plans via Midtrans
- 🌙 **Dark Mode**: Automatic light/dark theme support

## Setup Instructions

### Prerequisites

- Node.js 18+ (use pnpm)
- Supabase account (free tier available)
- Sanity account (free tier available)
- Midtrans merchant account (Indonesia payments)

### 1. Clone & Install

```bash
git clone <repository>
cd hukum-asumsi
pnpm install
```

### 2. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy the SQL from `database.sql` and run it in Supabase SQL Editor
3. This creates all necessary tables and RLS policies

```bash
# Tables created:
- users
- courses
- lessons
- user_progress
- course_enrollments
- certificates
- forum_categories, forum_topics, forum_replies, forum_likes
- live_sessions, live_session_attendance
- ai_chat_sessions, ai_messages
- payments
- user_analytics, course_analytics
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity project ID
- `SANITY_API_TOKEN`: Sanity API token
- `NEXTAUTH_SECRET`: 32+ character random string
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`: Midtrans client key
- `MIDTRANS_SERVER_KEY`: Midtrans server key

### 4. Sanity Setup (Content Management)

```bash
# Initialize Sanity in your project
npx sanity@latest init -d --create-project "Hukum Asumsi" --dataset production --visibility private

# Start Sanity Studio
npx sanity dev
```

Create Sanity schemas for:
- Courses
- Lessons
- Blog posts
- Media library

### 5. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## Project Structure

```
.
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── courses/            # Course management
│   │   ├── forum/              # Forum endpoints
│   │   └── users/              # User management
│   ├── dashboard/              # Protected dashboard pages
│   │   ├── courses/            # Browse & learn courses
│   │   ├── forum/              # Forum discussion
│   │   ├── classes/            # Live classes
│   │   └── profile/            # User profile
│   ├── auth/                   # Auth pages (login, register)
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── supabase/               # Supabase client setup
│   ├── sanity/                 # Sanity client setup
│   ├── types/                  # TypeScript types
│   └── auth.ts                 # JWT utilities
├── database.sql                # Database schema
└── .env.example                # Environment variables template
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/users/profile` - Get current user profile
- `PATCH /api/users/profile` - Update user profile

### Courses
- `GET /api/courses` - List all published courses (paginated)
- `GET /api/courses/[slug]` - Get course details with lessons

### Forum
- `GET /api/forum/categories` - Get forum categories
- `GET /api/forum/topics` - List forum topics
- `POST /api/forum/topics` - Create new topic
- `POST /api/forum/replies` - Reply to topic

### Payments
- `POST /api/payments/create-token` - Create Midtrans token
- `POST /api/payments/webhook` - Midtrans webhook handler

## Database Schema

### Users Table
```sql
id, email, name, password_hash, avatar_url, bio, role, 
subscription_status, subscription_plan, 
subscription_start_date, subscription_end_date,
midtrans_customer_id, is_active, created_at, updated_at
```

### Courses Table
```sql
id, title, slug, description, category, level,
instructor_id, thumbnail_url, cover_image_url,
total_lessons, estimated_duration, is_published,
order_index, created_at, updated_at
```

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only view/modify their own data
- Published courses visible to all users
- Forum topics visible to all, editable only by author
- Progress tracked per user

## Development Guide

### Adding New Features

1. **Database Changes**:
   - Update `database.sql`
   - Run migrations in Supabase
   - Update TypeScript types in `lib/types/api.ts`

2. **API Routes**:
   - Create route in `app/api/[feature]/route.ts`
   - Add error handling and validation
   - Implement proper authentication checks

3. **Components**:
   - Use shadcn/ui components from `components/ui/`
   - Follow existing styling patterns
   - Use Tailwind CSS for responsive design

4. **State Management**:
   - Use SWR for data fetching
   - Use Zustand for global state if needed
   - Leverage React Query for complex data

### Authentication Flow

1. User registers/logs in
2. API generates JWT token
3. Token stored in HTTP-only cookie
4. Middleware verifies token on protected routes
5. Client-side SWR validates token and refreshes if needed

### Testing

```bash
# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# Push to main branch to auto-deploy
```

### Manual Deployment

1. Build the project: `pnpm build`
2. Deploy to your server with Node.js 18+
3. Set environment variables
4. Run `pnpm start`

## Security Considerations

- ✅ Password hashing with bcryptjs
- ✅ JWT tokens with secure headers
- ✅ CSRF protection via SameSite cookies
- ✅ SQL injection prevention via parameterized queries
- ✅ Row Level Security on all tables
- ✅ Input validation with Zod schemas
- ✅ CORS configured for API routes

## Performance Optimization

- Server-side rendering with Next.js
- Image optimization with next/image
- Database indexing on frequently queried columns
- API route caching with SWR
- CSS-in-JS minification with Tailwind
- Code splitting and lazy loading

## Troubleshooting

### Database Connection Issues
```bash
# Check Supabase connection in lib/supabase/server.ts
# Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Authentication Errors
```bash
# Ensure NEXTAUTH_SECRET is set (min 32 characters)
# Check JWT token expiration in lib/auth.ts
```

### Midtrans Payment Issues
```bash
# Verify merchant keys in .env.local
# Check Midtrans dashboard for transaction status
```

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Midtrans Documentation](https://docs.midtrans.com)
- [shadcn/ui Components](https://ui.shadcn.com)

## License

MIT

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Contact

For questions or support, reach out to the development team.

---

**Built with ❤️ for the Hukum Asumsi community**

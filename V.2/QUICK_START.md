# Quick Start Guide - Hukum Asumsi LMS

## 5-Minute Setup

### 1. Install Dependencies (Already Done ✅)
```bash
pnpm install
```

### 2. Setup Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to SQL Editor and create a new query
4. Copy the entire contents of `/database.sql` into the editor
5. Click "Run"
6. Copy these values from Supabase Settings → API:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Secret → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Create .env.local

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Minimum required for basic functionality:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXTAUTH_SECRET=generate-32-char-random-string
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit: http://localhost:3000

## Testing the App

### 1. **Landing Page**
- Navigate to http://localhost:3000
- See the beautiful hero section with features
- Test responsive design (resize browser)

### 2. **Register Account**
- Click "Daftar" (Register) button
- Fill in:
  - Nama: "Test User"
  - Email: "test@example.com"
  - Password: "password123"
  - Konfirmasi: "password123"
- Click "Daftar"

### 3. **Login**
- Click "Masuk" (Login)
- Use credentials from step 2
- Should redirect to dashboard

### 4. **Dashboard**
- See your profile name
- View statistics cards (0 courses initially)
- Click "Jelajahi Kursus" to see courses page

### 5. **Courses Page**
- Empty initially (no courses in database yet)
- Search functionality works
- Ready for course management

### 6. **Profile Page**
- View your profile information
- Edit name and bio
- See subscription status
- Check security options

## Adding Sample Data

### Add a Test Course

Use Supabase dashboard to insert data:

```sql
INSERT INTO courses (title, slug, description, level, total_lessons, estimated_duration, is_published)
VALUES (
  'Pengenalan Hukum Asumsi',
  'pengenalan-hukum-asumsi',
  'Pelajari fondasi dasar Hukum Asumsi dari Neville Goddard',
  'beginner',
  10,
  300,
  true
);
```

Then add lessons for that course (get course_id from previous insert):

```sql
INSERT INTO lessons (course_id, title, slug, description, order_index, is_free, is_published)
VALUES (
  'COURSE_ID_HERE',
  'Apa itu Hukum Asumsi?',
  'apa-itu-hukum-asumsi',
  'Pengenalan konsep fundamental Hukum Asumsi',
  1,
  true,
  true
);
```

After adding data, refresh the courses page in the app.

## Important Notes

### Environment Variables Priority
1. `.env.local` (local development)
2. `.env.production` (production)
3. System environment variables

### Database Setup
- All tables created with RLS (Row Level Security)
- Users can only access their own data
- Published courses visible to all users

### Authentication
- Passwords hashed with bcryptjs (10 rounds)
- Tokens expire after 24 hours
- Cookies are HTTP-only and secure

### Troubleshooting

**"Supabase connection failed"**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure your IP is not blocked (check Supabase dashboard)

**"Email already exists"**
- Use a different email address or delete the user from Supabase

**"Invalid token"**
- Clear browser cookies
- Re-login to get a new token
- Check that NEXTAUTH_SECRET is set

**"Course page shows no results"**
- Add sample data using Supabase SQL Editor
- Ensure `is_published` is true for courses

## Next Steps

1. **Setup Sanity CMS** (Optional for now)
   - Visit [sanity.io](https://sanity.io)
   - Create project
   - Setup schemas for courses

2. **Add Payment Gateway**
   - Create Midtrans account
   - Add `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` and `MIDTRANS_SERVER_KEY`
   - Implement payment API

3. **Create Sample Content**
   - Add courses to database
   - Add lessons for each course
   - Upload course thumbnails

4. **Deploy to Vercel**
   - Connect GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy with one click

## File Locations

Important files to know:

```
Authentication:
- /app/api/auth/login/route.ts
- /app/api/auth/register/route.ts
- /lib/auth.ts

Database:
- /database.sql
- /lib/supabase/server.ts
- /lib/supabase/client.ts

Pages:
- /app/page.tsx (landing)
- /app/auth/login/page.tsx
- /app/auth/register/page.tsx
- /app/dashboard/page.tsx

Styling:
- /app/globals.css (design tokens)
- tailwind.config.ts

Configuration:
- .env.example
- next.config.mjs
- tsconfig.json
```

## API Testing

Test authentication flow:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Profile
curl http://localhost:3000/api/users/profile \
  -H "Cookie: auth-token=YOUR_TOKEN_HERE"
```

## Performance Tips

1. **Enable Image Optimization**
   - Add course thumbnails as base64 or URLs
   - Next.js will optimize automatically

2. **Database Query Optimization**
   - Indexes are already created
   - Limit queries to needed columns

3. **Frontend Optimization**
   - Images use responsive sizes
   - Components are code-split automatically
   - CSS is minified by Tailwind

## Security Best Practices

✅ **Implemented:**
- Password hashing
- JWT tokens
- HTTP-only cookies
- CORS protection
- Input validation
- SQL injection prevention

📋 **To Do:**
- Enable HTTPS in production
- Setup rate limiting
- Configure firewall rules
- Regular security audits

## Support

Refer to main README.md for:
- Full feature list
- Database schema documentation
- API endpoint documentation
- Deployment instructions

---

**Ready to develop!** 🚀

Start by adding content through Supabase, then customize components and add features as needed.

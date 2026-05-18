# Student Enrollment & Sectioning System

PIT Project | React.js + React Native + Django REST + Render

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend (Web) | React.js, Axios, React Query, Tailwind CSS, React Router |
| Mobile | React Native (Expo), NativeWind |
| Backend | Django 4.2, Django REST Framework, SimpleJWT |
| Database | SQLite (dev) → PostgreSQL on Render (prod) |
| File Storage | Cloudinary |
| Email | Gmail SMTP (via Django) |
| Deployment | Render (backend), Vercel (frontend), Expo EAS (mobile) |
| Chatbot | Claude API (Anthropic) |

---

## Project Structure

```
enrollment-system/
├── backend/
│   ├── enrollment_system/       # Django project config
│   │   ├── settings.py
│   │   └── urls.py
│   ├── apps/
│   │   ├── accounts/            # Users, auth, email verification
│   │   ├── students/            # Student CRUD + photo upload
│   │   ├── subjects/            # Subject management
│   │   ├── sections/            # Section + capacity control
│   │   └── enrollments/         # Enrollment logic + validation
│   ├── templates/               # Email templates
│   ├── requirements.txt
│   └── build.sh                 # Render deployment script
├── frontend/
│   └── src/
│       ├── api/axios.js         # Axios with JWT refresh
│       ├── context/AuthContext.js
│       ├── components/
│       │   ├── Chatbot.js       # AI enrollment assistant
│       │   └── PrivateRoute.js
│       └── pages/
│           ├── Dashboard.js
│           ├── Login.js / Register.js / VerifyEmail.js
│           ├── Students.js / Subjects.js / Sections.js
│           ├── Enrollments.js / EnrollmentForm.js
│           └── Profile.js
└── mobile/                      # React Native app (same API)
```

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file:
echo "SECRET_KEY=your-secret-key" > .env
echo "DEBUG=True" >> .env
echo "EMAIL_HOST_USER=your@gmail.com" >> .env
echo "EMAIL_HOST_PASSWORD=your-app-password" >> .env

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local      # Set REACT_APP_API_URL=http://localhost:8000/api
npm start
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

---

## Key API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register/ | Register user |
| GET | /api/auth/verify/{token}/ | Verify email |
| POST | /api/auth/login/ | Login (returns JWT) |
| GET/PUT | /api/auth/profile/ | View/update profile |
| POST | /api/auth/change-password/ | Change password |

### Core
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/students/ | List / create students |
| GET/PUT/DELETE | /api/students/{id}/ | Student detail |
| GET/POST | /api/subjects/ | List / create subjects |
| GET/POST | /api/sections/ | List / create sections |
| GET/POST | /api/enrollments/ | Enroll student |
| GET | /api/enrollments/summary/?student={id} | Student enrollment summary |
| GET | /api/enrollments/dashboard-stats/ | Dashboard statistics |

---

## Enrollment Business Rules

1. **Max capacity**: Section rejects enrollment if `enrolled_count >= max_students`
2. **No duplicates**: Student cannot enroll in the same subject twice (even in different sections)
3. **Unit calculation**: `total_units = sum(subject.units for enrolled subjects)`
4. **Status flow**: `enrolled` → `dropped` or `completed`
5. **Email verification**: Users must verify email before first login

---

## Roles & Permissions

| Feature | Admin | Staff | Student |
|---------|-------|-------|---------|
| Add/edit students | ✅ | ✅ | ❌ |
| Add/edit subjects | ✅ | ✅ | ❌ |
| Create sections | ✅ | ✅ | ❌ |
| Enroll students | ✅ | ✅ | ✅ (self) |
| View all enrollments | ✅ | ✅ | ❌ |
| View dashboard stats | ✅ | ✅ | ❌ |

---

## Deployment on Render

1. Push backend to GitHub
2. Create **Web Service** on Render:
   - Build command: `./build.sh`
   - Start command: `gunicorn enrollment_system.wsgi:application`
   - Add env vars: `SECRET_KEY`, `DATABASE_URL`, `ALLOWED_HOSTS`, `FRONTEND_URL`, `EMAIL_*`, `CLOUDINARY_*`
3. Create **PostgreSQL** database on Render, copy `DATABASE_URL`
4. Deploy frontend to Vercel: set `REACT_APP_API_URL` to your Render URL

---

## Rubric Checklist

- [x] **Project Structure** — modular Django apps + React page/component separation
- [x] **CRUD** — all 5 apps have full CRUD via DRF ViewSets
- [x] **Authentication** — JWT login/register + email verification
- [x] **Email Activation** — sends verification link on register
- [x] **Input Validation** — DRF serializer validation + frontend form validation
- [x] **Chatbot** — Claude AI chatbot embedded in web + mobile
- [x] **Role-Based Access** — Admin / Staff / Student permissions
- [x] **Dashboard** — stats cards + quick actions
- [x] **Profile** — user detail + photo upload
- [x] **File Upload** — Cloudinary for student photos + profile pics
- [x] **Responsive UI** — Tailwind CSS grid + flexbox
- [x] **State Management** — React Context (auth) + local state
- [x] **API Integration** — Axios with JWT interceptors + refresh
- [x] **Performance** — lazy loading routes, select_related on queries
- [x] **Security** — password hashing, protected routes, CORS, HTTPS
- [x] **Deployment** — Render (backend) + Vercel (frontend)
- [x] **Error Handling** — serializer errors → frontend display
- [x] **Git** — use feature branches (feature/enrollment-logic, etc.)

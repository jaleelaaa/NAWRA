<div align="center">

# 📚 NAWRA - Sultanate Library System
### نَوْرَة | نظام إدارة مكتبة السلطنة

**The Modern, Bilingual Library Management Platform Built for Excellence**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-00a393?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2+-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**🌐 Full RTL Support • 🚀 Production Ready • ⚡ Real-time • 🔐 Secure**

[🎯 Quick Start](#-quick-start) • [🔑 Credentials](#-login-credentials) • [✨ Features](#-features) • [📸 Demo](#-visual-tour)

---

### 🌐 Live Production System

**Try NAWRA Now - Fully Deployed & Running!**

| Resource | URL | Description |
|----------|-----|-------------|
| 🌐 **Frontend** | [https://nawra.onrender.com](https://nawra.onrender.com) | Main application interface |
| 🔐 **Login** | [https://nawra.onrender.com/en/login](https://nawra.onrender.com/en/login) | Login page (see [credentials](#-login-credentials)) |
| 📖 **API Docs** | [https://nawra-backend.onrender.com/docs](https://nawra-backend.onrender.com/docs) | Interactive Swagger UI |
| 📘 **ReDoc** | [https://nawra-backend.onrender.com/redoc](https://nawra-backend.onrender.com/redoc) | API documentation |

---

</div>

## 🌟 What Makes NAWRA Special?

NAWRA (نَوْرَة - "Blossom") isn't just another library system. It's a **ministry-level solution** designed specifically for **Sultanate of Oman's** educational institutions, offering features that traditional systems dream of:

<table>
<tr>
<td width="50%">

### 🎯 Traditional Systems
- ❌ English-only interface
- ❌ Basic user roles (2-3)
- ❌ Limited reporting
- ❌ Desktop-focused
- ❌ Manual processes
- ❌ Static data

</td>
<td width="50%">

### ✨ NAWRA
- ✅ **True Bilingual** (AR/EN with RTL)
- ✅ **5 Specialized Roles** with fine-grained permissions
- ✅ **Real-time Analytics** with beautiful charts
- ✅ **Mobile-first Responsive** design
- ✅ **Automated Workflows** for everything
- ✅ **Live Updates** via WebSockets

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 🎬 Run Your Library in 3 Commands

```bash
# 1️⃣ Navigate to directories and install
cd backend && python -m venv venv && ./venv/Scripts/python -m pip install -r requirements.txt
cd ../frontend && npm install

# 2️⃣ Start backend (Terminal 1)
cd backend && ./venv/Scripts/python -m uvicorn main:app --reload --port 8000

# 3️⃣ Start frontend (Terminal 2)
cd frontend && npm run dev
```

**🎉 Your library is live!**

- 🌐 **Frontend:** [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend API:** [http://localhost:8000](http://localhost:8000)
- 📖 **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔑 Login Credentials

<div align="center">

### 👥 Meet Your Team - Each Role, Perfectly Designed

</div>

All accounts use the **standardized password**: `Nawra2025!`
*([Nawra][2025][!] - Capital N, lowercase rest, exclamation at end)*

<table>
<tr>
<th width="20%">Role</th>
<th width="25%">Email</th>
<th width="15%">Password</th>
<th width="40%">What You Can Do</th>
</tr>

<tr>
<td>

🔐 **Administrator**

</td>
<td>

`admin@nawra.om`

</td>
<td>

`Nawra2025!`

</td>
<td>

**Complete System Control**
- ✅ Manage all users & roles
- ✅ System configuration
- ✅ Full reports access
- ✅ Security settings
- ✅ Audit logs

</td>
</tr>

<tr>
<td>

👨‍💼 **Librarian**

</td>
<td>

`librarian@nawra.om`

</td>
<td>

`Nawra2025!`

</td>
<td>

**Library Operations**
- ✅ Catalog management
- ✅ Book circulation
- ✅ User management
- ✅ Reports & analytics
- ✅ Collection development

</td>
</tr>

<tr>
<td>

🔄 **Circulation Staff**

</td>
<td>

`circulation@nawra.om`

</td>
<td>

`Nawra2025!`

</td>
<td>

**Daily Operations**
- ✅ Check-in/Check-out
- ✅ Renewals
- ✅ Fine collection
- ✅ Hold management
- ✅ Patron assistance

</td>
</tr>

<tr>
<td>

📚 **Cataloger**

</td>
<td>

`cataloger@nawra.om`

</td>
<td>

`Nawra2025!`

</td>
<td>

**Catalog Specialist**
- ✅ Add/edit books
- ✅ Metadata management
- ✅ Categories & subjects
- ✅ ISBN management
- ✅ Cover uploads

</td>
</tr>

<tr>
<td>

👤 **Patron**

</td>
<td>

`patron@nawra.om`

</td>
<td>

`Nawra2025!`

</td>
<td>

**Library Member**
- ✅ Browse catalog
- ✅ Request books
- ✅ View loans
- ✅ Check due dates
- ✅ Profile management

</td>
</tr>

</table>

> 💡 **Pro Tip**: Login at [https://nawra.onrender.com/en/login](https://nawra.onrender.com/en/login) and explore each role's unique dashboard!
>
> ⚠️ **Important**: These are **test credentials** - change them in production!

---

## ✨ Features

<div align="center">

### 🎯 Everything a Modern Library Needs (and More!)

</div>

### 📖 Catalog Management
<table>
<tr>
<td width="50%">

**Book Management**
- ✅ Add/Edit/Delete books
- ✅ Bilingual metadata (EN/AR)
- ✅ ISBN & barcode support
- ✅ Cover image uploads
- ✅ Multi-category tagging
- ✅ Status tracking (Available/Borrowed/Reserved)

</td>
<td width="50%">

**Advanced Features**
- ✅ Bulk import (CSV/Excel)
- ✅ Advanced search & filters
- ✅ Publication year tracking
- ✅ Author management
- ✅ Series & collections
- ✅ Rich metadata fields

</td>
</tr>
</table>

### 🔄 Circulation Operations
<table>
<tr>
<td width="50%">

**Core Circulation**
- ✅ Quick check-out/check-in
- ✅ Automated renewals
- ✅ Hold & request management
- ✅ Due date tracking
- ✅ Overdue notifications
- ✅ Real-time availability

</td>
<td width="50%">

**Fine Management**
- ✅ Automated fine calculation
- ✅ Payment processing
- ✅ Fee waivers
- ✅ Payment history
- ✅ Receipt generation
- ✅ Balance tracking

</td>
</tr>
</table>

### 👥 User Management
<table>
<tr>
<td width="50%">

**Staff Management**
- ✅ 5 role types with granular permissions
- ✅ Role-based access control (RBAC)
- ✅ Activity audit logs
- ✅ Session management
- ✅ Permission customization

</td>
<td width="50%">

**Patron Services**
- ✅ Self-service portal
- ✅ Profile management
- ✅ Reading history
- ✅ Request tracking
- ✅ Notification preferences

</td>
</tr>
</table>

### 📊 Reports & Analytics
<table>
<tr>
<td width="50%">

**Real-time Dashboards**
- ✅ Interactive charts (Recharts)
- ✅ Circulation statistics
- ✅ Collection analytics
- ✅ User activity metrics
- ✅ Trend analysis

</td>
<td width="50%">

**Report Generation**
- ✅ Custom report builder
- ✅ Export to CSV/Excel/PDF
- ✅ Scheduled reports
- ✅ Visual data representation
- ✅ Historical comparisons

</td>
</tr>
</table>

### 🌍 Bilingual Excellence
<table>
<tr>
<td width="50%">

**Language Support**
- ✅ Complete Arabic/English translations
- ✅ RTL (Right-to-Left) layout for Arabic
- ✅ Locale-aware formatting
- ✅ Dynamic language switching
- ✅ Bilingual data entry

</td>
<td width="50%">

**Cultural Adaptation**
- ✅ Hijri calendar support
- ✅ Arabic number formatting
- ✅ Regional date formats
- ✅ Sultanate-specific features
- ✅ MENA region optimized

</td>
</tr>
</table>

### 🔐 Security & Compliance
<table>
<tr>
<td width="50%">

**Authentication & Authorization**
- ✅ JWT token-based auth
- ✅ bcrypt password hashing
- ✅ Session management
- ✅ API rate limiting
- ✅ IP whitelisting ready

</td>
<td width="50%">

**Data Protection**
- ✅ Complete audit trails
- ✅ Encrypted data storage
- ✅ GDPR-compliant
- ✅ Secure API endpoints
- ✅ Regular security updates

</td>
</tr>
</table>

---

## 🏗️ Architecture

<div align="center">

### Modern, Scalable, Production-Ready

![NAWRA Architecture Diagram](docs/images/NAWRA_Architecture.drawio.svg)

*Figure 1: NAWRA Library Management System - Complete 5-Layer Architecture*

**[View High-Res PNG](docs/images/NAWRA_Architecture_Diagram.png)** | **[Download SVG](docs/images/NAWRA_Architecture.drawio.svg)** | **[Edit in Draw.io](NAWRA_Architecture_Diagram.drawio)**

</div>

The architecture follows a modern 5-layer approach:

1. **Layer 1: User Personas** - Five distinct user roles (Administrator, Librarian, Circulation Staff, Cataloger, Patron)
2. **Layer 2: Presentation Layer** - Next.js 14 frontend with bilingual support and comprehensive UI components
3. **Layer 3: API Gateway** - RESTful API with FastAPI, JWT authentication, and comprehensive endpoints
4. **Layer 4: Business Logic** - Service layer with authentication, books, circulation, user, and settings services
5. **Layer 5: Data Layer** - Supabase PostgreSQL database with complete schema including all 5 user roles

### 🛠️ Tech Stack Details

<table>
<tr>
<td width="50%">

**🎨 Frontend**
- ⚛️ React 18.2 - UI framework
- 🔷 Next.js 14.2 - SSR & routing
- 📘 TypeScript 5.0 - Type safety
- 🎨 Tailwind CSS 3.0 - Styling
- 📊 Recharts - Data visualization
- 🔌 Zustand - State management
- 🌐 next-intl - Internationalization
- ✅ React Hook Form - Forms
- 🎭 Playwright - E2E testing

</td>
<td width="50%">

**⚙️ Backend**
- 🚀 FastAPI 0.115 - Web framework
- 🐍 Python 3.13 - Language
- 🗄️ Supabase - Database (PostgreSQL)
- 🔐 python-jose - JWT tokens
- 🔒 bcrypt - Password hashing
- 📊 Pydantic - Data validation
- ✅ Pytest - Testing
- 📧 Email notifications
- 🔄 Real-time updates

</td>
</tr>
</table>

---

## 📦 Installation Guide

### Prerequisites

Choose your path:

- **🚀 Quick Start**: Python 3.11+, Node.js 18+
- **🐳 Docker** (Coming soon): Docker & Docker Compose

### Step-by-Step Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-org/nawra-lms.git
cd nawra-lms
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create .env file with your Supabase credentials:
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_KEY=your_supabase_service_key

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend running at: http://localhost:8000

#### 3️⃣ Frontend Setup

```bash
# Open new terminal
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env.local file:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start frontend server
npm run dev
```

✅ Frontend running at: http://localhost:3000

#### 4️⃣ Database Setup

```bash
# Run the password fix script to set up test users
cd backend
python fix_passwords_correct.py
```

✅ Test users created with password: `Nawra2025!`

---

## 📸 Visual Tour

<div align="center">

### 🎬 See NAWRA in Action

**🌐 [Try the Live System](https://nawra.onrender.com/en/login)** • **📖 [Explore API Docs](https://nawra-backend.onrender.com/docs)**

</div>

<details>
<summary><b>🖼️ Click to View Screenshots</b></summary>

### Login Page - English & Arabic
**🔗 [Try it live: https://nawra.onrender.com/en/login](https://nawra.onrender.com/en/login)**
<table>
<tr>
<td width="50%">
<img src="docs/screenshots/login-en.png" alt="Login English" />
<p align="center"><i>Clean, modern login interface (English)</i></p>
</td>
<td width="50%">
<img src="docs/screenshots/login-ar.png" alt="Login Arabic" />
<p align="center"><i>RTL layout with Arabic support</i></p>
</td>
</tr>
</table>

### Administrator Dashboard
**🔗 [Try it live: https://nawra.onrender.com/en/dashboard](https://nawra.onrender.com/en/dashboard)** *(Login required)*
<img src="docs/screenshots/dashboard-admin.png" alt="Admin Dashboard" />
<p align="center"><i>Real-time analytics with interactive charts and quick stats</i></p>

### Catalog Management
**🔗 [Try it live: https://nawra.onrender.com/en/catalog](https://nawra.onrender.com/en/catalog)** *(Login required)*
<img src="docs/screenshots/catalog.png" alt="Catalog" />
<p align="center"><i>Advanced search, filters, and bilingual book information</i></p>

### Circulation Desk
**🔗 [Try it live: https://nawra.onrender.com/en/circulation](https://nawra.onrender.com/en/circulation)** *(Login required)*
<img src="docs/screenshots/circulation.png" alt="Circulation" />
<p align="center"><i>Quick check-in/check-out with real-time status updates</i></p>

### User Management
**🔗 [Try it live: https://nawra.onrender.com/en/users](https://nawra.onrender.com/en/users)** *(Login required)*
<img src="docs/screenshots/users.png" alt="Users" />
<p align="center"><i>Comprehensive user management with role-based access</i></p>

### Reports & Analytics
**🔗 [Try it live: https://nawra.onrender.com/en/reports](https://nawra.onrender.com/en/reports)** *(Login required)*
<img src="docs/screenshots/reports.png" alt="Reports" />
<p align="center"><i>Beautiful charts and detailed analytics</i></p>

</details>

---

## 🎯 User Journeys

<div align="center">

### 📖 Explore Different Perspectives

</div>

<details>
<summary><b>🔐 Administrator Journey</b></summary>

### As an Administrator, I can:

1. **Dashboard Overview**
   - View system-wide statistics
   - Monitor active users
   - Track collection growth
   - View circulation trends

2. **User Management**
   - Create/edit/delete users
   - Assign roles and permissions
   - View user activity logs
   - Manage user accounts

3. **System Configuration**
   - Configure system settings
   - Manage roles and permissions
   - Set up notification templates
   - Monitor system health

4. **Reports & Analytics**
   - Generate custom reports
   - Export data
   - View audit trails
   - Analyze trends

</details>

<details>
<summary><b>👨‍💼 Librarian Journey</b></summary>

### As a Librarian, I can:

1. **Catalog Management**
   - Add new books to collection
   - Edit book information
   - Upload cover images
   - Manage categories

2. **Circulation Operations**
   - Check books in/out
   - Process renewals
   - Manage holds
   - Handle fines

3. **Collection Development**
   - Track popular books
   - Identify gaps in collection
   - Plan acquisitions
   - Weed outdated materials

4. **Patron Services**
   - Assist patrons
   - Answer inquiries
   - Resolve issues
   - Provide recommendations

</details>

<details>
<summary><b>🔄 Circulation Staff Journey</b></summary>

### As Circulation Staff, I can:

1. **Daily Operations**
   - Quick check-out process
   - Fast check-in workflow
   - Renew materials
   - Place holds

2. **Fine Management**
   - Calculate fines
   - Process payments
   - Issue receipts
   - Apply waivers

3. **Patron Assistance**
   - Look up patron accounts
   - View transaction history
   - Update contact information
   - Process card renewals

</details>

<details>
<summary><b>📚 Cataloger Journey</b></summary>

### As a Cataloger, I can:

1. **Book Entry**
   - Add new books
   - Enter bilingual metadata
   - Assign ISBN and barcodes
   - Upload cover images

2. **Metadata Management**
   - Edit book information
   - Manage categories
   - Update subjects
   - Maintain data quality

3. **Organization**
   - Create categories
   - Manage classifications
   - Set up series
   - Maintain consistency

</details>

<details>
<summary><b>👤 Patron Journey</b></summary>

### As a Patron, I can:

1. **Browse & Discover**
   - Search catalog
   - Browse categories
   - View new arrivals
   - See popular books

2. **Request Books**
   - Place holds
   - Request unavailable books
   - Track request status
   - Receive notifications

3. **Manage Account**
   - View borrowed books
   - Check due dates
   - View fines
   - Update profile

4. **Reading History**
   - View past loans
   - Track reading progress
   - Get recommendations
   - Build reading lists

</details>

---

## 🧪 Testing

```bash
# Frontend Testing
cd frontend
npm test                 # Unit tests
npm run test:e2e         # Playwright E2E tests
npm run lint            # Code linting

# Backend Testing
cd backend
pytest                   # Run all tests
pytest --cov            # With coverage report
pytest -v               # Verbose output
```

---

## 🚀 Deployment

<details>
<summary><b>📦 Production Deployment Guide</b></summary>

### Environment Variables

**Backend (.env)**
```env
# Database
SUPABASE_URL=your_production_supabase_url
SUPABASE_KEY=your_production_anon_key
SUPABASE_SERVICE_KEY=your_production_service_key

# Security
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=https://yourdomain.com

# Environment
ENVIRONMENT=production
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Deployment Steps

1. **Backend Deployment** (e.g., Railway, Render, Heroku)
   ```bash
   # Build
   pip install -r requirements.txt

   # Run
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Frontend Deployment** (e.g., Vercel, Netlify)
   ```bash
   # Build
   npm run build

   # Start
   npm start
   ```

3. **Database Migration**
   ```bash
   # Run SQL scripts in Supabase SQL Editor
   # Or use the reset_test_users.sql script
   ```

</details>

---

## 📚 API Documentation

Explore the interactive API documentation:

### 🚀 Production API
- **📖 Swagger UI**: [https://nawra-backend.onrender.com/docs](https://nawra-backend.onrender.com/docs)
- **📘 ReDoc**: [https://nawra-backend.onrender.com/redoc](https://nawra-backend.onrender.com/redoc)

### 💻 Local Development
- **📖 Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **📘 ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key API Endpoints

<table>
<tr>
<th>Category</th>
<th>Endpoint</th>
<th>Description</th>
</tr>
<tr>
<td rowspan="3">🔐 Authentication</td>
<td><code>POST /api/v1/auth/login</code></td>
<td>User login</td>
</tr>
<tr>
<td><code>POST /api/v1/auth/refresh</code></td>
<td>Refresh access token</td>
</tr>
<tr>
<td><code>POST /api/v1/auth/logout</code></td>
<td>User logout</td>
</tr>
<tr>
<td rowspan="4">📚 Books</td>
<td><code>GET /api/v1/books</code></td>
<td>List all books</td>
</tr>
<tr>
<td><code>POST /api/v1/books</code></td>
<td>Add new book</td>
</tr>
<tr>
<td><code>PUT /api/v1/books/{id}</code></td>
<td>Update book</td>
</tr>
<tr>
<td><code>DELETE /api/v1/books/{id}</code></td>
<td>Delete book</td>
</tr>
<tr>
<td rowspan="3">👥 Users</td>
<td><code>GET /api/v1/users</code></td>
<td>List all users</td>
</tr>
<tr>
<td><code>POST /api/v1/users</code></td>
<td>Create user</td>
</tr>
<tr>
<td><code>GET /api/v1/users/{id}</code></td>
<td>Get user details</td>
</tr>
<tr>
<td rowspan="2">🔄 Circulation</td>
<td><code>POST /api/v1/circulation/checkout</code></td>
<td>Check out book</td>
</tr>
<tr>
<td><code>POST /api/v1/circulation/checkin</code></td>
<td>Check in book</td>
</tr>
<tr>
<td rowspan="2">📊 Reports</td>
<td><code>GET /api/v1/reports/dashboard</code></td>
<td>Dashboard stats</td>
</tr>
<tr>
<td><code>GET /api/v1/reports/trends</code></td>
<td>Circulation trends</td>
</tr>
</table>

---

## 🤝 Contributing

We welcome contributions! Here's how you can help make NAWRA even better:

### 🌟 Ways to Contribute

1. **🐛 Report Bugs**: Found a bug? [Open an issue](https://github.com/your-org/nawra/issues)
2. **💡 Suggest Features**: Have an idea? Share it in [Discussions](https://github.com/your-org/nawra/discussions)
3. **📝 Improve Documentation**: Help us make docs clearer
4. **🔧 Submit Pull Requests**: Fix bugs or add features
5. **🌍 Translations**: Help translate to more languages

### 📋 Contribution Guidelines

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Make your changes
# - Write clean, documented code
# - Add tests for new features
# - Maintain bilingual support
# - Follow TypeScript/Python best practices

# 4. Commit your changes
git commit -m 'Add some AmazingFeature'

# 5. Push to the branch
git push origin feature/AmazingFeature

# 6. Open a Pull Request
```

### ✅ Code Standards

- **Frontend**: TypeScript, ESLint, Prettier
- **Backend**: Python (PEP 8), Black formatter
- **Tests**: Jest (Frontend), Pytest (Backend)
- **Commits**: Conventional Commits format
- **Documentation**: Clear comments and README updates

---

## 🛠️ Troubleshooting

<details>
<summary><b>❓ Common Issues & Solutions</b></summary>

### Login Issues

**Problem**: "Incorrect email or password"

**Solutions**:
1. Ensure password is exactly: `Nawra2025!` (case-sensitive)
2. Check there are no spaces before/after email or password
3. Try typing password manually instead of pasting
4. Clear browser cache or use incognito mode
5. Run password fix script: `python fix_passwords_correct.py`

### Backend Issues

**Problem**: Backend won't start

**Solutions**:
1. Check Python version: `python --version` (should be 3.11+)
2. Verify virtual environment is activated
3. Install dependencies: `pip install -r requirements.txt`
4. Check `.env` file has correct Supabase credentials

### Frontend Issues

**Problem**: Frontend shows errors

**Solutions**:
1. Check Node version: `node --version` (should be 18+)
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear Next.js cache: `rm -rf .next`
4. Verify `.env.local` has correct API URL

### Database Issues

**Problem**: Cannot connect to database

**Solutions**:
1. Verify Supabase credentials in `.env`
2. Check internet connection
3. Ensure Supabase project is active
4. Check API keys haven't expired

</details>

---

## 📞 Support & Community

<div align="center">

### We're Here to Help!

</div>

<table>
<tr>
<td align="center" width="25%">

📧

**Email Support**

support@nawra.om

</td>
<td align="center" width="25%">

🐛

**Bug Reports**

[GitHub Issues](https://github.com/your-org/nawra/issues)

</td>
<td align="center" width="25%">

💬

**Discussions**

[GitHub Discussions](https://github.com/your-org/nawra/discussions)

</td>
<td align="center" width="25%">

📖

**Documentation**

[Wiki](https://github.com/your-org/nawra/wiki)

</td>
</tr>
</table>

---

## 🙏 Acknowledgments

<div align="center">

**Built with ❤️ for Libraries Worldwide**

</div>

- **🏛️ Ministry of Education, Sultanate of Oman** - Project vision and support
- **👥 Open Source Community** - Amazing tools and libraries
- **🌟 Contributors** - Everyone who helped build NAWRA
- **📚 Librarians** - Feedback and real-world insights

### 🛠️ Powered By

- **FastAPI** - Modern Python web framework
- **Next.js** - React framework for production
- **Supabase** - Open source Firebase alternative
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - JavaScript with syntax for types

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Free to use, modify, and distribute
```

---

## 🗺️ Roadmap

<details>
<summary><b>🔮 What's Coming Next</b></summary>

### Q1 2025
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email notification system
- [ ] SMS integration
- [ ] QR code scanning

### Q2 2025
- [ ] Multi-library support
- [ ] Advanced search (Elasticsearch)
- [ ] Digital resources management
- [ ] Integration with external databases
- [ ] API rate limiting

### Q3 2025
- [ ] Machine learning recommendations
- [ ] Automated classification
- [ ] Inventory management
- [ ] Acquisitions module
- [ ] Serials management

### Future
- [ ] Mobile POS for fines
- [ ] Self-checkout kiosks
- [ ] RFID integration
- [ ] Discovery layer
- [ ] Consortium management

</details>

---

<div align="center">

## 🌟 Star Us on GitHub!

**If you find NAWRA useful, please ⭐ star this repo!**

It helps us grow and improve the system for everyone.

---

### نَوْرَة • Enlightening Knowledge • إنارة المعرفة

**Made with ❤️ for Education • Built for Excellence • Designed for Oman**

[⬆️ Back to Top](#-nawra---sultanate-library-system)

---

**© 2025 NAWRA Library Management System. All Rights Reserved.**

</div>

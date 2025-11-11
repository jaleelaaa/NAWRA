<div align="center">

# 📚 NAWRA Library Management System

### نَوْرَة - نظام إدارة المكتبة | Modern. Bilingual. Open Source.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-00a393.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2+-61dafb.svg?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178c6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg?logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg?logo=postgresql)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg?logo=docker)](https://www.docker.com)

**🌍 Full Arabic/English Support • 🚀 Production Ready • ⚡ Real-time Updates • 🎯 Role-Based Access Control**

[Live Demo](#-quick-start) • [Features](#-features) • [Test Credentials](#-test-credentials) • [Documentation](#-documentation) • [Contributing](#-contributing)

---

</div>

## ⭐ Why NAWRA?

NAWRA (نَوْرَة - meaning "blossom" in Arabic) is a **next-generation library management system** built for the **Ministry of Education, Sultanate of Oman**. Unlike traditional library systems, NAWRA offers:

| Traditional LMS | 🎯 NAWRA |
|----------------|----------|
| English only | ✅ **Full Bilingual** (English/Arabic with RTL support) |
| Basic permissions | ✅ **82+ Granular Permissions** across 5 roles |
| Single tenant | ✅ **Multi-tenant Architecture** ready |
| Delayed updates | ✅ **Real-time WebSocket Notifications** |
| Limited search | ✅ **Elasticsearch Full-text Search** |
| Monolithic | ✅ **Microservices-Ready API-First Design** |
| Legacy UI | ✅ **Modern React 18 + Next.js 15 Interface** |
| Basic reporting | ✅ **Advanced Analytics Dashboard** with real-time charts |

<div align="center">

### 🏆 Perfect for Schools, Universities & Public Libraries in MENA Region

</div>

---

## 🚀 Quick Start

### ⚡ Run in 60 Seconds with Docker

```bash
# Clone the repository
git clone https://github.com/your-username/nawra-lms.git
cd nawra-lms

# Start everything with one command
docker-compose up -d
```

**That's it!** 🎉 Your library system is now running at:

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8000
- 📖 **API Docs**: http://localhost:8000/docs
- 📊 **Admin Dashboard**: http://localhost:3000/en/dashboard

---

## 🔑 Test Credentials

<div align="center">

### 👤 Ready-to-Use Test Accounts

</div>

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| 🔐 **Administrator** | `admin@nawra.om` | `Admin@123` | Full system access |
| 👨‍💼 **Librarian** | `librarian@ministry.om` | `Librarian@123` | Catalog & circulation management |
| 📋 **Circulation Staff** | `circulation@ministry.om` | `Circ@123` | Check-in/out, renewals |
| 📚 **Cataloger** | `cataloger@ministry.om` | `Cataloger@123` | Catalog management only |
| 👥 **Patron** | `patron@student.om` | `Patron@123` | End-user book browsing |

> **💡 Pro Tip**: Login at http://localhost:3000/en/login and explore different role capabilities!
>
> **⚠️ Security Note**: Change these default passwords in production environments.

---

## ✨ Features

<details open>
<summary><b>📖 Catalog Management</b></summary>

- ✅ Multi-level inventory (Instance → Holdings → Items)
- ✅ MARC record support (MARC21, MARCXML)
- ✅ Multiple cataloging standards (RDA, AACR2)
- ✅ Classification systems (Dewey Decimal, Library of Congress)
- ✅ Advanced search with facets and filters
- ✅ Bulk import/export (CSV, Excel, MARC)
- ✅ Barcode/QR code generation
- ✅ Cover image management
- ✅ Authority control

</details>

<details open>
<summary><b>🔄 Circulation Operations</b></summary>

- ✅ Quick check-out/check-in with barcode scanning
- ✅ Automated renewals with configurable limits
- ✅ Hold/request queue management
- ✅ Overdue notifications (Email/SMS)
- ✅ Fine calculation and payment processing
- ✅ Multiple pickup locations
- ✅ Course reserves management
- ✅ Real-time availability status

</details>

<details open>
<summary><b>👥 User Management</b></summary>

- ✅ Role-based access control (RBAC)
- ✅ 5 predefined roles with 82+ permissions
- ✅ Patron self-service portal
- ✅ User groups (Undergraduate/Graduate/Faculty/Staff)
- ✅ Activity audit logs
- ✅ Customizable loan policies
- ✅ Patron communication tools

</details>

<details open>
<summary><b>💰 Financial Management</b></summary>

- ✅ Automated fine/fee calculation
- ✅ Payment processing integration
- ✅ Fee waivers and adjustments
- ✅ Financial reports and analytics
- ✅ Budget tracking
- ✅ Vendor management
- ✅ Purchase order processing

</details>

<details open>
<summary><b>📊 Reporting & Analytics</b></summary>

- ✅ Real-time dashboard with interactive charts
- ✅ Circulation statistics
- ✅ Collection analytics
- ✅ User activity reports
- ✅ Custom report builder
- ✅ Scheduled report generation
- ✅ Export to CSV/Excel/PDF
- ✅ Visual data representation

</details>

<details open>
<summary><b>🌍 Bilingual Interface</b></summary>

- ✅ Complete Arabic/English translation
- ✅ RTL (Right-to-Left) layout support
- ✅ Locale-aware date/number formatting
- ✅ Dynamic language switching
- ✅ Bilingual data entry
- ✅ Cultural customization for MENA region

</details>

<details>
<summary><b>🔍 Advanced Search</b></summary>

- ✅ Elasticsearch-powered full-text search
- ✅ Advanced query builder
- ✅ Faceted search navigation
- ✅ Search result highlighting
- ✅ Saved searches
- ✅ Boolean operators support
- ✅ Fuzzy matching

</details>

<details>
<summary><b>🔔 Real-time Notifications</b></summary>

- ✅ WebSocket-based instant updates
- ✅ Email notifications
- ✅ In-app notification center
- ✅ Customizable notification preferences
- ✅ Due date reminders
- ✅ Hold availability alerts
- ✅ System announcements

</details>

<details>
<summary><b>🔒 Security & Compliance</b></summary>

- ✅ JWT authentication
- ✅ Password encryption (bcrypt)
- ✅ API rate limiting
- ✅ Complete audit trails
- ✅ Data encryption at rest
- ✅ GDPR-compliant data handling
- ✅ Session management
- ✅ IP whitelisting

</details>

---

## 🏗️ Architecture & Tech Stack

<div align="center">

### Modern, Scalable, Production-Ready

</div>

```
┌─────────────────────────────────────────────────────────────┐
│                      NAWRA LMS Architecture                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Frontend   │ ◄─────► │   Backend    │                 │
│  │              │         │              │                 │
│  │  Next.js 15  │         │  FastAPI     │                 │
│  │  React 18    │         │  Python 3.11 │                 │
│  │  TypeScript  │         │  SQLAlchemy  │                 │
│  │  Tailwind    │         │  Alembic     │                 │
│  └──────────────┘         └───────┬──────┘                 │
│                                    │                         │
│                           ┌────────┴────────┐               │
│                           │                 │               │
│                    ┌──────▼──────┐   ┌─────▼──────┐        │
│                    │  PostgreSQL │   │ Supabase   │        │
│                    │   Database  │   │   (BaaS)   │        │
│                    └─────────────┘   └────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 🛠️ Technology Stack

**Frontend:**
- ⚛️ **React 18** - Modern UI framework
- 🔷 **Next.js 15** - Server-side rendering & routing
- 📘 **TypeScript 5** - Type safety
- 🎨 **Tailwind CSS** - Utility-first styling
- 📊 **Recharts** - Data visualization
- 🔌 **Zustand** - State management
- ✅ **React Hook Form** - Form handling
- 🎭 **Playwright** - E2E testing

**Backend:**
- 🚀 **FastAPI** - Modern Python web framework
- 🐘 **PostgreSQL 15** - Relational database
- 🗄️ **Supabase** - Backend-as-a-Service
- 🔐 **JWT** - Authentication
- 📝 **Alembic** - Database migrations
- ✅ **Pytest** - Testing framework

**DevOps:**
- 🐳 **Docker** - Containerization
- 🔄 **GitHub Actions** - CI/CD ready
- 📊 **Health Checks** - System monitoring

---

## 📦 Installation

### Prerequisites

- 🐳 Docker & Docker Compose (Recommended)
- OR: Node.js 18+, Python 3.11+, PostgreSQL 15+

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/nawra-lms.git
cd nawra-lms

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### Option 2: Manual Installation

<details>
<summary>Click to expand manual installation steps</summary>

**Backend Setup:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn main:app --reload --port 8000
```

**Frontend Setup:**
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

**Database Setup:**
```bash
# Create PostgreSQL database
createdb nawra_lms

# Or use psql
psql -U postgres
CREATE DATABASE nawra_lms;
\q
```

</details>

---

## 📸 Screenshots

<details>
<summary><b>🖼️ View Screenshots</b></summary>

### Dashboard - English

![Dashboard English](docs/screenshots/dashboard-en.png)
*Real-time analytics with interactive charts and statistics*

### Dashboard - Arabic (RTL)

![Dashboard Arabic](docs/screenshots/dashboard-ar.png)
*Complete RTL layout with Arabic translation*

### Catalog Management

![Catalog](docs/screenshots/catalog.png)
*Advanced search and filtering capabilities*

### Circulation

![Circulation](docs/screenshots/circulation.png)
*Quick check-in/check-out interface*

### User Management

![Users](docs/screenshots/users.png)
*Role-based access control management*

</details>

---

## 📚 Documentation

<div align="center">

| Documentation | Description |
|--------------|-------------|
| [📖 API Documentation](http://localhost:8000/docs) | Interactive Swagger UI |
| [📘 User Manual](docs/user-manual/) | Complete user guides |
| [🏗️ Architecture Guide](docs/architecture.md) | System design & architecture |
| [🔧 Developer Guide](docs/developer-guide.md) | Contributing guidelines |
| [🌐 Deployment Guide](docs/deployment.md) | Production deployment |

</div>

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **🍴 Fork** the repository
2. **🌿 Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push** to the branch (`git push origin feature/AmazingFeature`)
5. **🔀 Open** a Pull Request

### 📋 Development Guidelines

- ✅ Write tests for new features
- ✅ Follow TypeScript/Python best practices
- ✅ Maintain bilingual support
- ✅ Update documentation
- ✅ Ensure accessibility (WCAG 2.1)

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test                          # Unit tests
npm run test:e2e                  # Playwright E2E tests

# Backend tests
cd backend
pytest                            # All tests
pytest --cov                      # With coverage
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Ministry of Education, Sultanate of Oman** - Project sponsor
- **Open Source Community** - Amazing libraries and tools
- **Contributors** - Everyone who helped build NAWRA

---

## 📞 Support

- 📧 **Email**: support@nawra.om
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/nawra-lms/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/nawra-lms/discussions)

---

<div align="center">



**Made with ❤️ for libraries worldwide**

**نُوَّرَة • Enlightening Knowledge • إنارة المعرفة**

[⬆ Back to Top](#-nawra-library-management-system)

</div>

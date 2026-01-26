# Premium Car Rental Platform

A professional, full-featured car rental management system built with modern web technologies. This platform provides a seamless booking experience for customers and a powerful dashboard for administrators.

## 🚀 Features

### For Customers
- **Elegant Vehicle Showcase**: Browse cars with high-quality image galleries and detailed specifications.
- **Advanced Filtering**: Filter vehicles by category, price, and features.
- **Real-Time Availability**: View up-to-date availability and book instantly.
- **Dynamic Pricing**: Get accurate price estimates based on rental duration and selected options.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

### For Administrators
- **Comprehensive Dashboard**: View key metrics, upcoming bookings, and fleet status at a glance.
- **Fleet Management**: Easily add, edit, and remove vehicles with drag-and-drop image uploads.
- **Booking Management**: View and manage customer reservations.
- **Pricing Configuration**: Set base rates, tax rates, insurance costs, and delivery fees.
- **Content Management**: Update website settings, contact info, and "Terms & Conditions" directly from the admin panel.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Vercel Blob Storage (Production) / Local Filesystem (Development)
- **Build Tool**: Vite
- **Deployment**: Optimized for Vercel

## 📦 Installation Guide

Follow these steps to set up the project locally.

### Prerequisites
- Node.js 18+ installed
- A Firebase project (for database)
- *Optional*: Vercel account (for production deployment)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cars
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory by copying the example:
```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase configuration keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Database Setup
The application uses Firebase Firestore. You can seed the database with initial data:
```bash
npm run seed:firebase
```

### 5. Run Development Server
Start the application in development mode:
```bash
npm run dev
```
The app will be available at `http://localhost:5000`.

## 🚢 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2.  Import the project into Vercel.
3.  Add the environment variables from your `.env` file to the Vercel project settings.
4.  **Important**: For image uploads in production, you must set up Vercel Blob Storage and add the `BLOB_READ_WRITE_TOKEN` environment variable.

## 📂 Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Home, Admin, etc.)
│   │   ├── lib/         # Utility functions & Firebase config
│   │   └── App.tsx      # Main application entry & routing
├── server/              # Backend Express server
│   ├── routes.ts        # API endpoints
│   └── upload.ts        # Image upload logic
└── shared/              # Shared TypeScript schemas (Zod)
```

## 📄 License

This project is available for purchase on CodeCanyon. Please refer to the license terms included with your purchase.

## 🤝 Support

For support, please contact us via our CodeCanyon profile page.

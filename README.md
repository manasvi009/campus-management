# Campus Management System

A comprehensive MERN stack application for managing campus operations including student management, faculty management, attendance tracking, results management, and more.

## Features

### User Roles
- **Admin**: Full system access and management
- **Faculty**: Access to assigned subjects, attendance, and results
- **Student**: Personal profile, attendance, and results access
- **Alumni**: Career and mentorship features
- **Staff**: Administrative support functions

### Modules
- **Authentication & User Management**: JWT-based authentication with role-based access
- **Student Management**: Complete student lifecycle management
- **Faculty Management**: Faculty profiles, assignments, and timetables
- **Department & Course Management**: Academic structure management
- **Attendance Tracking**: Daily attendance marking and reporting
- **Results & Grading**: Academic performance management
- **Fee Management**: Fee structure and payment tracking
- **Hostel Management**: Room allocation and management
- **Transport Management**: Bus routes and student assignments
- **Notice Board**: Announcements and communications
- **Library Management**: Book inventory and issue tracking
- **Placement Services**: Job postings and career guidance
- **Communication**: Internal messaging system

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **multer** for file uploads
- **nodemailer** for email services

### Frontend
- **React.js** with **Vite**
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/campus_management
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory (optional):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Change password

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Students
- `GET /api/students` - Get students (role-based access)
- `POST /api/students` - Create student (Admin)
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student (Admin)

### Faculty
- `GET /api/faculty` - Get faculty (Admin)
- `POST /api/faculty` - Create faculty (Admin)
- `PUT /api/faculty/:id` - Update faculty
- `DELETE /api/faculty/:id` - Delete faculty (Admin)

## Database Models

The application uses the following MongoDB collections:
- `users` - User accounts and authentication
- `students` - Student profiles and information
- `faculty` - Faculty profiles and assignments
- `departments` - Academic departments
- `courses` - Course information
- `subjects` - Subject details
- `attendance` - Attendance records
- `results` - Academic results
- `feepayments` - Fee payment records
- `hostels` - Hostel information
- `roomallocations` - Room assignments
- `transports` - Transport services
- `notices` - Announcements
- `exams` - Exam schedules
- `examschedules` - Detailed exam timings
- `books` - Library books
- `bookissues` - Book lending records
- `alumni` - Alumni information
- `jobpostings` - Job opportunities
- `studentapplications` - Job applications
- `messages` - Internal communications
- `adminsettings` - System configuration
- `activitylogs` - User activity tracking

## Project Structure

```
campus-management/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Database configuration
│   ├── utils/               # Utility functions
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utilities and context
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   └── package.json
└── README.md
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Deployment

### Backend Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Configure MongoDB connection string
4. Set up SSL certificates

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve static files using nginx or similar
3. Configure API proxy for production API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.
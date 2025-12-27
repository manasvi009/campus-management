const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      // Port is busy, try next
      resolve(findAvailablePort(startPort + 1));
    });
  });
};

// Connect to database
connectDB();

// Create default data if not exists
const createDefaultData = async () => {
  try {
    const User = require('./models/User');
    const Department = require('./models/Department');
    const Course = require('./models/Course');

    // Create default admin user
    const existingAdmin = await User.findOne({ email: 'admin@admin.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Default admin user created: admin@admin.com / admin123');
    }

    // Create default departments
    const existingDepartments = await Department.countDocuments();
    if (existingDepartments === 0) {
      const departments = [
        {
          departmentName: 'Computer Science',
          departmentCode: 'CS',
          description: 'Department of Computer Science and Engineering',
          contactEmail: 'cs@campus.edu',
          contactPhone: '+1-123-456-7890'
        },
        {
          departmentName: 'Information Technology',
          departmentCode: 'IT',
          description: 'Department of Information Technology',
          contactEmail: 'it@campus.edu',
          contactPhone: '+1-123-456-7891'
        },
        {
          departmentName: 'Mechanical Engineering',
          departmentCode: 'ME',
          description: 'Department of Mechanical Engineering',
          contactEmail: 'me@campus.edu',
          contactPhone: '+1-123-456-7892'
        }
      ];

      await Department.insertMany(departments);
      console.log('Default departments created');
    }

    // Create default courses
    const existingCourses = await Course.countDocuments();
    if (existingCourses === 0) {
      const csDept = await Department.findOne({ departmentCode: 'CS' });
      const itDept = await Department.findOne({ departmentCode: 'IT' });
      const meDept = await Department.findOne({ departmentCode: 'ME' });

      const courses = [
        {
          courseName: 'B.Tech Computer Science',
          courseCode: 'BTECH-CS',
          duration: 4,
          departmentId: csDept._id,
          totalSemesters: 8,
          courseType: 'UG'
        },
        {
          courseName: 'M.Tech Computer Science',
          courseCode: 'MTECH-CS',
          duration: 2,
          departmentId: csDept._id,
          totalSemesters: 4,
          courseType: 'PG'
        },
        {
          courseName: 'B.Tech Information Technology',
          courseCode: 'BTECH-IT',
          duration: 4,
          departmentId: itDept._id,
          totalSemesters: 8,
          courseType: 'UG'
        },
        {
          courseName: 'B.Tech Mechanical Engineering',
          courseCode: 'BTECH-ME',
          duration: 4,
          departmentId: meDept._id,
          totalSemesters: 8,
          courseType: 'UG'
        }
      ];

      await Course.insertMany(courses);
      console.log('Default courses created');
    }
  } catch (error) {
    console.error('Error creating default data:', error);
  }
};

createDefaultData();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow localhost on any port for development
    if (origin.startsWith('http://localhost:')) return callback(null, true);
    // Allow the specified CLIENT_URL
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/courses', require('./routes/courses'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Campus Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server on available port
const startServer = async () => {
  const desiredPort = parseInt(process.env.PORT) || 5000;
  const port = await findAvailablePort(desiredPort);
  
  const server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();

module.exports = app;
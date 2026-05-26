import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import trainRoutes from './routes/trainRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Integrate Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware configuration
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for local testing and loading unsplash images
  })
);
app.use(cors());
app.use(express.json());

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/complaints', complaintRoutes);

// Announcements API endpoint
app.get('/api/announcements', (req, res) => {
  res.json([
    {
      id: 1,
      text: '📢 Notice: Apex Hyperloop Bullet Train (99999) running on MMCT-SBC route is running 5 minutes ahead of schedule today.',
      type: 'info',
    },
    {
      id: 2,
      text: '⚠️ Technical Update: Platform change for Vande Bharat Express (22436) at New Delhi station. Now departing from Platform 12.',
      type: 'warning',
    },
    {
      id: 3,
      text: '🎉 Smart Railway: Festival vacation booking season is now open with zero additional convenience charges.',
      type: 'success',
    },
  ]);
});

// Root check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Smart Railway Reservation System API is running...' });
});

// Real-time seat updates simulation using Socket.io
io.on('connection', (socket) => {
  console.log(`Socket Client Connected: ${socket.id}`);

  // Emit a mock seat availability change every 12 seconds to connected clients
  const interval = setInterval(() => {
    const randomTrain = ['22436', '12952', '12008', '99999', '12274'][
      Math.floor(Math.random() * 5)
    ];
    const randomClass = ['1A', '2A', '3A', 'SL'][Math.floor(Math.random() * 4)];
    const randomChange = Math.random() > 0.6 ? 1 : -1; // random gain or loss of seat

    socket.emit('realtimeSeatUpdate', {
      trainNumber: randomTrain,
      seatClass: randomClass,
      change: randomChange,
    });
  }, 12000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log(`Socket Client Disconnected: ${socket.id}`);
  });
});

// Central Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Express API Server Running on port ${PORT}`);
});

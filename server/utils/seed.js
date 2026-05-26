import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Train from '../models/Train.js';
import Review from '../models/Review.js';
import Complaint from '../models/Complaint.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { maharashtraTrains } from './maharashtraTrains.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await User.deleteMany();
    await Train.deleteMany();
    await Review.deleteMany();
    await Complaint.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();

    console.log('Database cleared.');

    // Seed Users
    const adminUser = await User.create({
      fullName: 'System Administrator',
      email: 'admin@smartrail.com',
      password: 'adminpassword',
      phone: '9876543210',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: 'admin',
      gender: 'male',
      age: 35,
      address: 'Central Headquarters, Rail Bhawan, New Delhi',
    });

    const standardUser = await User.create({
      fullName: 'Alex Mercer',
      email: 'user@smartrail.com',
      password: 'userpassword',
      phone: '9123456789',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'user',
      gender: 'male',
      age: 28,
      address: 'Flat 402, Skyline Towers, Mumbai',
    });

    console.log('Users seeded.');

    // Seed Trains
    const trains = [
      {
        trainNumber: '22436',
        trainName: 'Vande Bharat Express',
        source: 'New Delhi (NDLS)',
        destination: 'Varanasi Junction (BSB)',
        departureTime: '06:00',
        arrivalTime: '14:00',
        duration: '8h 00m',
        totalSeats: 120,
        availableSeats: {
          '1A': 10,
          '2A': 20,
          '3A': 30,
          'SL': 60,
        },
        trainType: 'Vande Bharat',
        fare: {
          '1A': 2850,
          '2A': 1980,
          '3A': 1430,
          'SL': 480,
        },
        runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
        image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500',
        ratings: 4.8,
        stations: [
          { stationName: 'New Delhi (NDLS)', arrivalTime: '06:00', departureTime: '06:00', stopTime: 'Source', distance: 0 },
          { stationName: 'Kanpur Central (CNB)', arrivalTime: '10:08', departureTime: '10:10', stopTime: '2 mins', distance: 440 },
          { stationName: 'Prayagraj Junction (PRYJ)', arrivalTime: '12:08', departureTime: '12:10', stopTime: '2 mins', distance: 635 },
          { stationName: 'Varanasi Junction (BSB)', arrivalTime: '14:00', departureTime: '14:00', stopTime: 'Destination', distance: 755 },
        ],
      },
      {
        trainNumber: '12952',
        trainName: 'Mumbai Rajdhani Express',
        source: 'New Delhi (NDLS)',
        destination: 'Mumbai Central (MMCT)',
        departureTime: '16:55',
        arrivalTime: '08:35',
        duration: '15h 40m',
        totalSeats: 180,
        availableSeats: {
          '1A': 15,
          '2A': 35,
          '3A': 50,
          'SL': 80,
        },
        trainType: 'Rajdhani',
        fare: {
          '1A': 4250,
          '2A': 2890,
          '3A': 2090,
          'SL': 690,
        },
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500',
        ratings: 4.6,
        stations: [
          { stationName: 'New Delhi (NDLS)', arrivalTime: '16:55', departureTime: '16:55', stopTime: 'Source', distance: 0 },
          { stationName: 'Kota Junction (KOTA)', arrivalTime: '21:40', departureTime: '21:50', stopTime: '10 mins', distance: 465 },
          { stationName: 'Ratlam Junction (RTM)', arrivalTime: '00:55', departureTime: '00:58', stopTime: '3 mins', distance: 730 },
          { stationName: 'Vadodara Junction (BRC)', arrivalTime: '04:10', departureTime: '04:20', stopTime: '10 mins', distance: 990 },
          { stationName: 'Mumbai Central (MMCT)', arrivalTime: '08:35', departureTime: '08:35', stopTime: 'Destination', distance: 1386 },
        ],
      },
      {
        trainNumber: '12008',
        trainName: 'Chennai Shatabdi Express',
        source: 'KSR Bengaluru (SBC)',
        destination: 'Chennai Central (MAS)',
        departureTime: '16:20',
        arrivalTime: '21:15',
        duration: '4h 55m',
        totalSeats: 100,
        availableSeats: {
          '1A': 12,
          '2A': 28,
          '3A': 0, // Mock fully booked class
          'SL': 60,
        },
        trainType: 'Shatabdi',
        fare: {
          '1A': 1850,
          '2A': 1240,
          '3A': 950,
          'SL': 320,
        },
        runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
        image: 'https://images.unsplash.com/photo-1532103054090-334e6e60ab29?w=500',
        ratings: 4.4,
        stations: [
          { stationName: 'KSR Bengaluru (SBC)', arrivalTime: '16:20', departureTime: '16:20', stopTime: 'Source', distance: 0 },
          { stationName: 'Bangarapet Junction (BWT)', arrivalTime: '17:18', departureTime: '17:20', stopTime: '2 mins', distance: 70 },
          { stationName: 'Katpadi Junction (KPD)', arrivalTime: '18:58', departureTime: '19:00', stopTime: '2 mins', distance: 229 },
          { stationName: 'Chennai Central (MAS)', arrivalTime: '21:15', departureTime: '21:15', stopTime: 'Destination', distance: 359 },
        ],
      },
      {
        trainNumber: '99999',
        trainName: 'Apex Hyperloop Bullet',
        source: 'Mumbai Central (MMCT)',
        destination: 'KSR Bengaluru (SBC)',
        departureTime: '10:00',
        arrivalTime: '12:30',
        duration: '2h 30m',
        totalSeats: 80,
        availableSeats: {
          '1A': 8,
          '2A': 12,
          '3A': 20,
          'SL': 40,
        },
        trainType: 'Bullet',
        fare: {
          '1A': 6200,
          '2A': 4500,
          '3A': 3200,
          'SL': 1200,
        },
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=500',
        ratings: 4.9,
        stations: [
          { stationName: 'Mumbai Central (MMCT)', arrivalTime: '10:00', departureTime: '10:00', stopTime: 'Source', distance: 0 },
          { stationName: 'Pune Junction (PUNE)', arrivalTime: '10:45', departureTime: '10:47', stopTime: '2 mins', distance: 192 },
          { stationName: 'KSR Bengaluru (SBC)', arrivalTime: '12:30', departureTime: '12:30', stopTime: 'Destination', distance: 980 },
        ],
      },
      {
        trainNumber: '12274',
        trainName: 'Howrah Duronto Express',
        source: 'New Delhi (NDLS)',
        destination: 'Howrah Junction (HWH)',
        departureTime: '12:40',
        arrivalTime: '10:50',
        duration: '22h 10m',
        totalSeats: 150,
        availableSeats: {
          '1A': 10,
          '2A': 20,
          '3A': 40,
          'SL': 80,
        },
        trainType: 'Duronto',
        fare: {
          '1A': 3890,
          '2A': 2640,
          '3A': 1930,
          'SL': 650,
        },
        runningDays: ['Tue', 'Sat'],
        image: 'https://images.unsplash.com/photo-1515165504669-4230c85c2250?w=500',
        ratings: 4.3,
        stations: [
          { stationName: 'New Delhi (NDLS)', arrivalTime: '12:40', departureTime: '12:40', stopTime: 'Source', distance: 0 },
          { stationName: 'Patna Junction (PNBE)', arrivalTime: '03:15', departureTime: '03:25', stopTime: '10 mins', distance: 998 },
          { stationName: 'Asansol Junction (ASN)', arrivalTime: '07:45', departureTime: '07:50', stopTime: '5 mins', distance: 1320 },
          { stationName: 'Howrah Junction (HWH)', arrivalTime: '10:50', departureTime: '10:50', stopTime: 'Destination', distance: 1530 },
        ],
      },
    ];

    const allTrains = [...trains, ...maharashtraTrains];
    const seededTrains = await Train.insertMany(allTrains);
    console.log(`Trains seeded (${allTrains.length} schedules including Maharashtra/Kolhapur).`);

    // Seed reviews
    await Review.create([
      {
        userId: standardUser._id,
        trainId: seededTrains[0]._id,
        rating: 5,
        comment: 'Unbelievably clean! The Vande Bharat express is super fast, quiet, and foods served were excellent. 10/10 recommended!',
      },
      {
        userId: standardUser._id,
        trainId: seededTrains[1]._id,
        rating: 4,
        comment: 'Very punctual. The food on Mumbai Rajdhani is top notch. Standard sheets are comfortable.',
      },
    ]);

    console.log('Reviews seeded.');

    // Seed complaints
    await Complaint.create([
      {
        userId: standardUser._id,
        subject: 'AC cooling issue in coach A2',
        description: 'During my journey on Rajdhani Express (12952) yesterday, the air conditioning in A2 coach was not working from Kota to Vadodara. It was extremely suffocating.',
        complaintStatus: 'pending',
      },
      {
        userId: standardUser._id,
        subject: 'Broken charging socket in Seat 24',
        description: 'Seat 24 SL in Vande Bharat had a broken mobile charging socket. Please repair it before the next run.',
        complaintStatus: 'resolved',
      },
    ]);

    console.log('Complaints seeded.');
    console.log('All dummy data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();

import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  stationName: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  stopTime: {
    type: String,
    default: '2 mins',
  },
  distance: {
    type: Number,
    required: true, // in km
  },
});

const trainSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    trainName: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true, // e.g., "14h 30m"
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    // Map of seat class to seats available, e.g. { "1A": 10, "2A": 24, "3A": 48, "SL": 80 }
    availableSeats: {
      type: Map,
      of: Number,
      default: {},
    },
    trainType: {
      type: String,
      enum: ['Express', 'Superfast', 'Rajdhani', 'Shatabdi', 'Vande Bharat', 'Duronto', 'Bullet'],
      default: 'Express',
    },
    // Map of seat class to base fare, e.g. { "1A": 2800, "2A": 1800, "3A": 1200, "SL": 450 }
    fare: {
      type: Map,
      of: Number,
      default: {},
    },
    runningDays: [
      {
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    stations: [stationSchema],
    image: {
      type: String,
      default: '',
    },
    ratings: {
      type: Number,
      default: 4.2,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Train = mongoose.model('Train', trainSchema);
export default Train;

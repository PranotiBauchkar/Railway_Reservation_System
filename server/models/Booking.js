import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  seatClass: {
    type: String,
    enum: ['1A', '2A', '3A', 'SL'],
    required: true,
  },
});

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: true,
    },
    passengers: [passengerSchema],
    journeyDate: {
      type: Date,
      required: true,
    },
    seatNumbers: [
      {
        type: String,
        required: true,
      },
    ],
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    totalFare: {
      type: Number,
      required: true,
    },
    PNR: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    QRCode: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

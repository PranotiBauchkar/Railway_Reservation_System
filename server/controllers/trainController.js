import Train from '../models/Train.js';

// @desc    Search trains by source, destination, and date
// @route   GET /api/trains
// @access  Public
export const searchTrains = async (req, res) => {
  const { source, destination, date } = req.query;

  try {
    let query = {};

    const conditions = [];

    if (source) {
      const srcRegex = { $regex: source, $options: 'i' };
      conditions.push({
        $or: [
          { source: srcRegex },
          { destination: srcRegex },
          { 'stations.stationName': srcRegex },
        ],
      });
    }

    if (destination) {
      const destRegex = { $regex: destination, $options: 'i' };
      conditions.push({
        $or: [
          { source: destRegex },
          { destination: destRegex },
          { 'stations.stationName': destRegex },
        ],
      });
    }

    if (conditions.length > 0) {
      query.$and = conditions;
    }

    let trains = await Train.find(query);

    // If journey date is provided, filter trains running on that day of the week
    if (date) {
      const journeyDate = new Date(date);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const journeyDay = days[journeyDate.getDay()];
      
      trains = trains.filter((train) => train.runningDays.includes(journeyDay));
    }

    res.json(trains);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Get train by ID
// @route   GET /api/trains/:id
// @access  Public
export const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);

    if (train) {
      res.json(train);
    } else {
      res.status(404);
      return res.json({ message: 'Train not found' });
    }
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Create a new train (Admin only)
// @route   POST /api/trains
// @access  Private/Admin
export const createTrain = async (req, res) => {
  const {
    trainNumber,
    trainName,
    source,
    destination,
    departureTime,
    arrivalTime,
    duration,
    totalSeats,
    availableSeats,
    trainType,
    fare,
    runningDays,
    stations,
    image,
  } = req.body;

  try {
    const trainExists = await Train.findOne({ trainNumber });

    if (trainExists) {
      res.status(400);
      return res.json({ message: 'Train number already exists' });
    }

    // Default classes setup if not provided
    const defaultSeats = availableSeats || {
      '1A': Math.floor(totalSeats * 0.1),
      '2A': Math.floor(totalSeats * 0.2),
      '3A': Math.floor(totalSeats * 0.3),
      'SL': Math.floor(totalSeats * 0.4),
    };

    const defaultFares = fare || {
      '1A': 2500,
      '2A': 1700,
      '3A': 1100,
      'SL': 400,
    };

    const train = await Train.create({
      trainNumber,
      trainName,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration,
      totalSeats,
      availableSeats: defaultSeats,
      trainType,
      fare: defaultFares,
      runningDays,
      stations: stations || [],
      image: image || 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500',
    });

    res.status(201).json(train);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Update an existing train (Admin only)
// @route   PUT /api/trains/:id
// @access  Private/Admin
export const updateTrain = async (req, res) => {
  const {
    trainName,
    source,
    destination,
    departureTime,
    arrivalTime,
    duration,
    totalSeats,
    availableSeats,
    trainType,
    fare,
    runningDays,
    stations,
    image,
  } = req.body;

  try {
    const train = await Train.findById(req.params.id);

    if (train) {
      train.trainName = trainName || train.trainName;
      train.source = source || train.source;
      train.destination = destination || train.destination;
      train.departureTime = departureTime || train.departureTime;
      train.arrivalTime = arrivalTime || train.arrivalTime;
      train.duration = duration || train.duration;
      train.totalSeats = totalSeats || train.totalSeats;
      train.availableSeats = availableSeats || train.availableSeats;
      train.trainType = trainType || train.trainType;
      train.fare = fare || train.fare;
      train.runningDays = runningDays || train.runningDays;
      train.stations = stations || train.stations;
      train.image = image || train.image;

      const updatedTrain = await train.save();
      res.json(updatedTrain);
    } else {
      res.status(404);
      return res.json({ message: 'Train not found' });
    }
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Delete a train (Admin only)
// @route   DELETE /api/trains/:id
// @access  Private/Admin
export const deleteTrain = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);

    if (train) {
      await train.deleteOne();
      res.json({ message: 'Train removed successfully' });
    } else {
      res.status(404);
      return res.json({ message: 'Train not found' });
    }
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

import express from 'express';
import {
  searchTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
} from '../controllers/trainController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(searchTrains).post(protect, admin, createTrain);

router
  .route('/:id')
  .get(getTrainById)
  .put(protect, admin, updateTrain)
  .delete(protect, admin, deleteTrain);

export default router;

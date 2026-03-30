import express from 'express';
import { getPublicCatalog } from '../controllers/catalogController.js';

const catalogRouter = express.Router();
catalogRouter.get('/', getPublicCatalog);

export default catalogRouter;

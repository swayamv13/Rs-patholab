import express from 'express';
import { requestHomeVisit } from '../controllers/visitController.js';

const visitRouter = express.Router();

visitRouter.post('/request', requestHomeVisit);

export default visitRouter;

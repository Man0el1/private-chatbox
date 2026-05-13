import express from 'express';
const route = express.Router();

//controllers

import { allowAccess } from './controllers/loginController.js';
import { validateToken } from './controllers/chatboxController.js';

route.post('/login', allowAccess);
route.post('/validate-token', validateToken);

export default route;

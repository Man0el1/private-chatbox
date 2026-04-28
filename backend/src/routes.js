import express from 'express';
const route = express.Router();

//controllers

import { allowAccess } from './controllers/loginController.js';

//middlewares

route.post('/login', allowAccess);

export default route;

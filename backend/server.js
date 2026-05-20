import express from 'express';
import sequelize from './src/database/sequelize.js';
import routes from './src/routes.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

app.use(cors({ origin: 'https://private-chatbox-m.vercel.app', credentials: true}));

app.use(express.json());
app.use(routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://private-chatbox-m.vercel.app',
    credentials: true
  }
});

//middleware para autenticação do socket, io.use funciona parecido com o app.use do express
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Token ausente'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (e) {
    return next(new Error('Token inválido'));
  }
});

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.user.name}`);

  socket.on('message', (type, text) => {
    if (type === 'normalText') {
      io.emit('message', 'normalText', `${socket.user.name}: ${text}`);
    }

    if (type === 'welcomeText') {
      io.emit('message', 'welcomeText', `${socket.user.name} entrou :D`);
    }

    if (type === 'leaveText') {
      io.emit('message', 'leaveText', `${socket.user.name} saiu :(`);
    }
  });
});

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await sequelize.authenticate();

    console.log('Banco conectado com sucesso');

    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
  }
})();

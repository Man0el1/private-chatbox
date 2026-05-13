import express from 'express';
import sequelize from './src/database/sequelize.js';
import routes from './src/routes.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

//middleware para autenticação do socket, io.use funciona parecido com o app.use do express
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Token ausente"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded
  } catch (e) {
    return next(new Error("Token inválido"));
  }

  next();
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('message', (type, text) => {
    if (type === 'normalText') {
      io.emit('message', 'normalText', `${socket.user.name}: ${text}`);
    } else if (type === 'welcomeText') {
      io.emit('message', 'welcomeText', `${socket.user.name} entrou :D`);
    } else if (type === 'leaveText') {
      io.emit('message', 'leaveText', `${socket.user.name} saiu :(`);
    }
  });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Banco de dados conectado com sucesso');

    server.listen(8080, () => {
      console.log('Servidor rodando na porta 8080');
    });
  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
  }
})();

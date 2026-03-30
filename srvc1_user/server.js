import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import dotenv from 'dotenv';
import userRoutes from './modules/users/user.routes.js';
import { swaggerDocs } from "./swagger.js";

// dotenv.config();

const app = express();
// const cors = require("cors");
const PORT = process.env.PORT || 4001;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}));

app.get('/', (req, res) => {
  res.json({ Status: 'OK', Message: 'User service' });
});

app.use('/users', userRoutes);

// Подключение Swagger
swaggerDocs(app, PORT);

app.listen(PORT, () => {
  console.log(`User service running at http://localhost:${PORT}`);
});

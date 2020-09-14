import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { gradeRouter } from './routes/gradeRouter.js';

import { db } from './models/index.js';

import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    console.log('Conectando ao banco de dados mongoDB...');
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('Conectado com sucesso ao mongoDB');
  } catch (error) {
    console.log(error);
    process.exit();
  }
})();

const app = express();

//define o dominio de origem para consumo do servico
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.PORT_CORS === ''
        ? process.env.HOST_CORS
        : `${process.env.HOST_CORS}:${process.env.PORT_CORS}`,
  })
);
app.use(gradeRouter);
app.get('/', (req, res) => {
  res.send('API em execucao');
});

app.listen(process.env.PORT || 8081, () => {
  console.log(`API Started at port ${process.env.PORT}`);
});

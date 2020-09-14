import express from 'express';
import { accountRouter } from './routes/accountRouter.js';
import mongoose from 'mongoose';

(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://douglasvallinhos:20mata20@igti.wxcpa.gcp.mongodb.net/bank?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (error) {
    console.log('Erro ao conectar o MongoDB :' + error);
  }
})();

const app = express();
app.use(express.json());
app.use(accountRouter);

app.listen(8080, () => console.log('API Started'));

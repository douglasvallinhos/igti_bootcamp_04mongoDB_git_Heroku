import express from 'express';
import { Accounts } from '../models/accountModel.js';

const router = express.Router();
router.use(express.json());

router.patch('/account/deposit', async (req, res) => {
  try {
    const account = req.body;
    let newDeposit = await validateAccount(account);
    newDeposit.balance += account.balance;
    newDeposit = new Accounts(newDeposit);
    newDeposit.save();
    res.send(newDeposit);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.patch('/account/withdraw', async (req, res) => {
  try {
    const account = req.body;
    let newWithDraw = await validateAccount(account);
    newWithDraw.balance -= account.balance + 1;
    if (newWithDraw.balance < 0) {
      throw new Error('Saldo insuficiente');
    }
    newWithDraw = new Accounts(newWithDraw);
    newWithDraw.save();
    res.send(newWithDraw);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/account/checkBalance', async (req, res) => {
  try {
    const account = req.body;
    const accountDatabase = await validateAccount(account);
    res.send(accountDatabase.balance.toString());
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/account/delete', async (req, res) => {
  try {
    const account = req.body;
    let accountDelete = await validateAccount(account);
    accountDelete = new Accounts(accountDelete);
    accountDelete.deleteOne();

    accountDelete = await Accounts.find({ agencia: accountDelete.agencia });
    console.log(accountDelete.length);
    res.send(accountDelete.length.toString());
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.patch('/account/transfer', async (req, res) => {
  try {
    const accounts = req.body;
    const valueTransfer = Number(accounts.valueTransfer);

    let orignAccount = await validateAccount(accounts.orignAccount);
    let destinyAccount = await validateAccount(accounts.destinyAccount);
    if (orignAccount.agencia !== destinyAccount.agencia) {
      orignAccount.balance -= 8;
    }
    orignAccount.balance -= valueTransfer;
    if (orignAccount.balance < 0) {
      throw new Error('Saldo insuficiente para efetuar a Transferencia');
    }
    destinyAccount.balance += valueTransfer;

    orignAccount = new Accounts(orignAccount);
    orignAccount.save();

    destinyAccount = new Accounts(destinyAccount);
    destinyAccount.save();
    res.send(orignAccount.balance.toString());
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/account/agencyAverage/:id', async (req, res) => {
  try {
    const agency = req.params.id;
    const allAgency = await Accounts.find({ agencia: agency });
    const sumAllBalances = allAgency.reduce((acc, cur) => acc + cur.balance, 0);

    const media = sumAllBalances / allAgency.length;
    res.send(media.toString());
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/account/minBalance/:id', async (req, res) => {
  try {
    const limit = Number(req.params.id);
    const minBalance = await Accounts.find()
      .sort([['balance', 1]])
      .limit(limit);
    res.send(minBalance);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/account/maxBalance/:id', async (req, res) => {
  try {
    const limit = Number(req.params.id);
    const maxBalance = await Accounts.find()
      .sort([['balance', -1]])
      .limit(limit);
    res.send(maxBalance);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/account/transferToPrivate', async (req, res) => {
  try {
    let transferToPrivates = await Accounts.aggregate([
      {
        $group: {
          _id: '$agencia',
          balance: { $max: '$balance' },
        },
      },
    ]);

    for (const transferToPrivate of transferToPrivates) {
      const { _id, balance } = transferToPrivate;
      let newAccounts = await Accounts.findOne({
        agencia: _id,
        balance,
      });
      newAccounts.agencia = 99;
      newAccounts.save();
    }
    transferToPrivates = await Accounts.find({ agencia: 99 });
    res.send(transferToPrivates);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// valida se agencia/conta existe
const validateAccount = async (account) => {
  //traz apenas a agencia e a conta para consulta no BD;
  const { agencia, conta } = account;
  if (!agencia) {
    account = {
      conta,
    };
  } else {
    account = {
      agencia,
      conta,
    };
  }

  try {
    account = await Accounts.findOne(account);
    if (!account) {
      throw new Error(`(${agencia}/${conta}) agencia/conta invalida`);
    }
    return account;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { router as accountRouter };

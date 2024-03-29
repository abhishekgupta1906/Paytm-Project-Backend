const express= require('express');
const router = express.Router();
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');
const authMiddleware=require('../middleware')

router.get('/balance',authMiddleware,async (req,res)=>{
    const userid=req.userId;
   const account= await Account.findOne({
        userId:userid
    })
    res.json({
        balance: account.balance

    })

})

router.post('/transfer',authMiddleware,async (req,res)=>{

    const session = await mongoose.startSession();

    session.startTransaction();
    const {to,amount } = req.body;

    // Fetch the accounts which are in transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });

    

})

module.exports =router;
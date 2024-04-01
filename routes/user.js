const express = require("express");

require('dotenv').config();
const {User,Account} = require("../db");
const  jwt= require("jsonwebtoken");
const zod = require("zod");
const authMiddleware= require("../middleware");

const zodSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),

});

const zodSchema2 = zod.object({
  username: zod.string().email(),

  password: zod.string(),
});

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { success } =zodSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken/Incorrect inputs",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  
  const userId = user._id;
  
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
})

  const token = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = zodSchema2.safeParse(req.body)
  if (!success) {
      return res.status(411).json({
          message: "Email already taken / Incorrect inputs"
      })
  }

  const user = await User.findOne({
      username: req.body.username,
      password: req.body.password
  });

  if (user) {
      const token = jwt.sign({
          userId: user._id
      },process.env.JWT_SECRET);

      res.json({
          token: token
      })
      return;
  }

  
  res.status(411).json({
      message: "Error while logging in"
  })
 
});


const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
      $or: [{
          firstName: {
              "$regex": filter
              // first name 
          }
      }, {
          lastName: {
              "$regex": filter
          }
      }]
  })

  res.json({
      user: users.map(user => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }))
  })})


module.exports = router;



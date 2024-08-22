const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const user = require("../model/user");

const JWT_SECRET = "hritikisagoodboy";

// Middleware to parse JSON request bodies
router.use(express.json());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('token');
  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }
  try {
    const verifiedtoken = jwt.verify(token, JWT_SECRET);
    req.user = verifiedtoken.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Sign up route
router.post('/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('name').isLength({ min: 3 }).withMessage('Name should be at least 3 characters long'),
  body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    const payload = {
      user: {
        id: newUser.id
      }
    };

    const token = jwt.sign(payload, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(payload, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Set avatar route
router.post('/setavatar', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.additionalData = {
      ...user.additionalData,
      isProfile: true,
      imageUrl: req.body.imageurl
    };

    await user.save();
    return res.json(user)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.get('/getcontacts', verifyToken ,async(req,res)=>{

  try{
    const user=await User.find({_id:{$ne:req.user.id}}).select([
      "email",
      "name",
      "_id",
      "additionalData"
    ])
    if(!user){
      return res.status(400).json({error:"users unable to found"})
    }
    return res.json(user);


  }catch(err){
       return res.status(404),json(err.message);
  }
})


router.get('/getuser', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select([
      "email",
      "name",
      "_id",
      "additionalData"
    ]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const { generateToken } = require('../middlewares/utils')


const registerUser = asyncHandler(async(req, res) => {
    const { user_id, name, password } = req.body;

    res.status(201).json({
        data: req.body,
        // token: generateToken(user_id)
    });

    // const userExists = await User.findOne({ user_id });

    // if (userExists) {
    //     res.status(400);
    //     throw new Error("User already exists");
    // };

    // const user = await User.create({
    //     user_id,
    //     name,
    //     password
    // });

    // if (user) {
    //     res.status(201).json({
    //         _id: user._id,
    //         name: user.name,
    //         user_id: user.user_id,
    //         password: user.password,
    //         isAdmin: user.isAdmin,
    //         token: generateToken(user._id)
    //     })
    // } else {
    //     res.status(400).json('Error Occured')
    // };
})


const authUser = asyncHandler(async(req, res) => {
    const { user_id, password } = req.body;
    console.log(user_id, password)

    const user = await User.findOne({ user_id });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            user_id: user.user_id,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json('Invalid ID or Password');
    }
})

module.exports = { registerUser, authUser };
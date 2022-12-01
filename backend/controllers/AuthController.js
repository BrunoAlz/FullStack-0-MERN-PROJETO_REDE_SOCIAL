import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Models
import User from "../models/User.js";

// REGISTER USER FUNCTION
const register = async (req, res) => {
  // UNPACK USER DATA FROM REQUEST
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // ENCRYPT USERS PASS
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // CREATE THE USER
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    // SAVE USER ON DATABASE
    const savedUser = await newUser.save();

    // CHECK IF USER WAS CREATED
    if (!savedUser) {
      res
        .status(422)
        .json({ errors: ["Houve um erro, por favor tente mais tarde."] });
      return;
    }

    // SEND USER DATA TO FRONT END
    res.stats(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

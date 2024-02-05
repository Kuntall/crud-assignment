import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRegistration = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  if (!name || !email || !password || !mobile) {
    res.sendStatus(400).send({ message: "All fields required" });
  } else {
    const userDetails = await UserModel.findOne({ email: email });
    if (userDetails) {
      res.send({ status: "failed", message: "User Email already exists" });
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
          name: name,
          email: email,
          password: hashedPassword,
          mobile: mobile,
        });
        await newUser.save();
        const newUserDetails = await UserModel.findOne({ email: email });
        // generate JWT
        const token = jwt.sign(
          { userID: newUserDetails._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "2h" }
        );
        res.send({
          message: "User created successfully!!",
          user: newUserDetails,
          token: token,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          message: err.message || "Some error occurred while creating user",
        });
      }
    }
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await UserModel.find();
    res.send({ user });
  } catch (error) {
    res.sendStatus(404).send({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const { email } = req.body;
  const userDetails = await UserModel.findOne({ email: email });

  await UserModel.findByIdAndUpdate(userDetails._id, req.body, {
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `User not found.`,
        });
      } else {
        res.send({ message: "User updated successfully." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

const deleteUser = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Data to delete can not be empty!",
    });
  }
  const { email } = req.body;
  const userDetails = await UserModel.findOne({ email: email });
  if (!userDetails) {
    res.status(404).send({
      message: `User not found.`,
    });
  }

  await UserModel.findByIdAndRemove(userDetails._id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `User not found.`,
        });
      } else {
        res.send({
          message: "User deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.sendStatus(400).send({ message: "All fields required" });
    }
    const userDetails = await UserModel.findOne({ email: email });
    if (!userDetails) {
      res.send({ status: "failed", message: "You are not a registered user" });
    } else {
      const isMatched = await bcrypt.compare(password, userDetails.password);
      if (userDetails.email == email && isMatched) {
        // Generate JWT token
        const token = jwt.sign(
          { userID: userDetails._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "2h" }
        );
        res.send({ message: "Login successful", token: token });
      } else {
        res.send({
          status: "failed",
          message: "Email or Password is incorrect",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.send({
      status: "failed",
      message: "An error occurred while logging in",
    });
  }
};

const changeUserPassword = async (req, res) => {
  const {} = req.body;
};

export { userRegistration, getAllUsers, updateUser, deleteUser, userLogin };
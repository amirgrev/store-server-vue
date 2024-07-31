import jwt from "jsonwebtoken";

import { validationResult } from "express-validator";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "User is not found",
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(400).json({
        message: "Login or password not correct",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      error: "Autherization is falied",
    });
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",

      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, _v, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      error: error.message.includes("duplicate key") ? "This email is already in use" : error.message,
    });
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getMe = async (req, res) => {
  const user = await UserModel.findById(req.userId);
  try {
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData });
  } catch (error) {
    console.log("error");
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await UserModel.findOne({ _id: req.body.userId });

    if (!user) {
      return res.status(404).json({
        message: "User is not found",
      });
    }
    if (req.body.password || req.body.newPassword) {
      if (!req.body.password) {
        return res.status(400).json({
          message: "Current password field is empty",
        });
      }
      if (!req.body.newPassword) {
        return res.status(400).json({
          message: "New password field is empty",
        });
      }
      const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

      if (!isValidPass) {
        return res.status(400).json({
          message: "Password not correct",
        });
      } else {
        const password = req.body.newPassword;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await UserModel.findOneAndUpdate({
          email: req.body.email,
          fullName: req.body.fullName,
          avatarUrl: req.body.avatarUrl,
          passwordHash: hash,
        });
      }
    } else {
      await UserModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          email: req.body.email,
          fullName: req.body.fullName,
          avatarUrl: req.body.avatarUrl,
        }
      );
    }

    res.json({ message: "Profile updated successefully" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Profile updating failed");
  }
};

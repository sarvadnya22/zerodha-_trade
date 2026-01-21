const User = require("../model/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists", success: false });
        }

        const user = await User.create({
            email,
            password,
            displayName: username || email.split('@')[0]
        });

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
            .status(201)
            .json({ message: "User signed up successfully", success: true, user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signup failed", success: false, error: error.message });
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ message: 'All fields are required', success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'Incorrect password or email', success: false });
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: 'Incorrect password or email', success: false });
        }

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ message: "User logged in successfully", success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed", success: false, error: error.message });
    }
};

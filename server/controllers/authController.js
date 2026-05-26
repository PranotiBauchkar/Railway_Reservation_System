import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// In-memory mock OTP store
const otpStore = {};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { fullName, email, password, phone, gender, age, address } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      return res.json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      gender,
      age,
      address,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gender: user.gender,
        age: user.age,
        address: user.address,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      return res.json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gender: user.gender,
        age: user.age,
        address: user.address,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      return res.json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        gender: user.gender,
        age: user.age,
        address: user.address,
        profileImage: user.profileImage,
      });
    } else {
      res.status(404);
      return res.json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.phone = req.body.phone || user.phone;
      user.gender = req.body.gender || user.gender;
      user.age = req.body.age || user.age;
      user.address = req.body.address || user.address;
      user.profileImage = req.body.profileImage || user.profileImage;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        gender: updatedUser.gender,
        age: updatedUser.age,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      return res.json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Request forgot password OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      return res.json({ message: 'User with this email does not exist' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 10 minute expiry
    otpStore[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
    };

    console.log(`\n=================== OTP MAIL SIMULATION ===================`);
    console.log(`To: ${email}`);
    console.log(`Subject: Password Reset OTP - Smart Railway`);
    console.log(`Message: Your password reset OTP is ${otp}. Valid for 10 minutes.`);
    console.log(`============================================================\n`);

    res.json({
      message: 'OTP sent to your email. Check server console logs if running locally!',
      otp: process.env.NODE_ENV === 'production' ? undefined : otp, // Expose for testing
    });
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const data = otpStore[email];

    if (!data) {
      res.status(400);
      return res.json({ message: 'No OTP requested for this email' });
    }

    if (Date.now() > data.expires) {
      delete otpStore[email];
      res.status(400);
      return res.json({ message: 'OTP has expired' });
    }

    if (data.otp !== otp) {
      res.status(400);
      return res.json({ message: 'Invalid OTP code' });
    }

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const data = otpStore[email];

    if (!data || data.otp !== otp) {
      res.status(400);
      return res.json({ message: 'OTP verification failed or expired' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      return res.json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

    delete otpStore[email];

    res.json({ success: true, message: 'Password reset successful!' });
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

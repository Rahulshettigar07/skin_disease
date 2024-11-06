require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor =  require('../models/Doctor');

// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.userauthorization && req.headers.userauthorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.userauthorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };



// const protectDoctor = async (req, res, next) => {
//   let token1;

//   if (req.headers.doctorauthorization && req.headers.doctorauthorization.startsWith('Bearer')) {
//     try {
//       token1 = req.headers.doctorauthorization.split(' ')[1];
//       const decoded = jwt.verify(token1, process.env.JWT_SECRET);

//       // Check if the user is a doctor by looking it up in the Doctor model
//       req.user = await Doctor.findById(decoded.id).select('-password');

//       if (!req.user) {
//         return res.status(401).json({ message: 'Not authorized as a doctor' });
//       }

//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   } else {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };


const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const role = req.headers.role; // Get role from headers

  if (!token || !role) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (role === 'user') {
      // Fetch user from database
      user = await User.findById(decoded.id);
    } else if (role === 'doctor') {
      // Fetch doctor from database
      user = await Doctor.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: 'Authorization failed' });
    }

    req.user = user; // Attach the user/doctor to the request object
    req.role = role; // Attach the role to the request for further use
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(401).json({ message: 'Token verification failed' });
  }
};
module.exports = { protect};
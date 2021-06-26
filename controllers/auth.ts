import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../middleware/async";
import User from "../models/User";

// @des Register user
// @route POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req: Request, res: Response, next) => {
  const { firstName, surName, email, password, occupation } = req.body;

  // Create user
  const user = await User.create({
    firstName,
    surName,
    email,
    password,
    occupation,
  });

  sendTokenResponse(user, 200, res);
});

// @des Login user
// @route POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password ) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  //Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
	
	res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

import jwt from "jsonwebtoken";
import { asyncHandler } from "./async";
import { ErrorResponse } from "../utils/errorResponse";
import { User } from "../models/User";

//  Protect routes
export const protect = asyncHandler(async (req: Request, res: Response, next: (arg0: undefined) => void) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // else if(req.cookies.token) {
  // 	token = request.cookies.token
  // }

  // Mskr sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles: string | any[]) => {
  return (req: Request, res: Response, next: (arg0: undefined) => void) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access ths route`,
          403
        )
      );
    }
    next();
  };
};

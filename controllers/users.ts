import { asyncHandler } from '../middleware/async';

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private
exports.getUsers = asyncHandler(async (req: Request, res: Response, next: any) => {
  res.status(200).json(res.advancedResults);
});

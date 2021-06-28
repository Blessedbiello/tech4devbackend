export const asyncHandler = (fn :any) => (req: any, res: any, next: ((reason: any) => PromiseLike<never>) | null | undefined) =>
	Promise.resolve(fn(req, res, next)).catch(next);

// export const asyncHandler: any;
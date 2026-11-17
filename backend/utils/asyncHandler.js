/**
 * Asynchronous Handler Wrapper
 * Automatically passes caught rejections to Express error middleware
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

export const catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      return next(err);
    });
  };
};

export class GlobalError extends Error {
  constructor({ message, statusCode } = {}) {
    super(message);
    this.statusCode = statusCode;
  }
}

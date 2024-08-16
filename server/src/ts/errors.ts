export class NotFoundError extends Error {
  status: number = 404;

  constructor(message: string) {
    super(message);
  }
}

export class ConflictError extends Error {
  status: number = 419;

  constructor(message: string) {
    super(message);
  }
}

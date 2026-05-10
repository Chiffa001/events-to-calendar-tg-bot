export class ForbiddenError extends Error {
  constructor(userId: number) {
    super(`User ${userId} is not allowed`);
  }
}

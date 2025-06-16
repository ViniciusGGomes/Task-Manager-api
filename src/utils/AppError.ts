class AppError {
  message: string;
  status_code: number;

  constructor(message: string, status_code: number = 400) {
    this.message = message;
    this.status_code = status_code;
  }
}

export { AppError };

// Define custom errors as needed

export class InvalidLoginError extends Error {
  constructor() {
    super("Invalid login attempt");
    this.name = "InvalidLoginError";
  }
}

export class SignupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignupError";
  }
}
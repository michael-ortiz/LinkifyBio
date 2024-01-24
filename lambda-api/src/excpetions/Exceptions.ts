export class NotFoundException extends Error {
    status: number;
  
    constructor(message?: string) {
      super(message || 'Not Found');
      this.status = 404;
    }
}

export class Unauthorized extends Error {
  status: number;

  constructor(message?: string) {
    super(message || 'Unauthorized');
    this.status = 401;
  }
}

export class GeneralException extends Error {
  status: number;

  constructor(message?: string) {
    super(message || 'Internal error');
    this.status = 500;
  }
}
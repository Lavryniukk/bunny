export class Exception {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }

  static isException(object: any): boolean {
    return object instanceof Exception;
  }
}

export class BadRequestException extends Exception {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedException extends Exception {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenException extends Exception {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundException extends Exception {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class MethodNotAllowedException extends Exception {
  constructor(message = 'Method Not Allowed') {
    super(405, message);
  }
}

export class ConflictException extends Exception {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

export class IamateapotException extends Exception {
  constructor(message = 'I am a teapot') {
    super(428, message);
    console.log('A teapot? Really?');
  }
}
export class InternalServerErrorException extends Exception {
  constructor(message = 'Internal Server Error') {
    super(500, message);
  }
}

export class NotImplementedException extends Exception {
  constructor(message = 'Not Implemented') {
    super(501, message);
  }
}

export class BadGatewayException extends Exception {
  constructor(message = 'Bad Gateway') {
    super(502, message);
  }
}

export class ServiceUnavailableException extends Exception {
  constructor(message = 'Service Unavailable') {
    super(503, message);
  }
}

export class GatewayTimeoutException extends Exception {
  constructor(message = 'Gateway Timeout') {
    super(504, message);
  }
}

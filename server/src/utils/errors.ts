export class AppError extends Error { 
    statusCode: number;
    constructor(message: string, statusCode: number) { 
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
    }
}

export class ValidationError extends AppError { 
    constructor(message: string) { 
        super(message, 400);
    }
}
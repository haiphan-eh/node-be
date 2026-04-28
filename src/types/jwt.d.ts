declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
    email: string;
    permissions?: string[];
  }
}

export {};

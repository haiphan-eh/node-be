declare global {
  namespace Express {
    interface Request {
      objKey?:
        | {
            permissions?: string[];
          }
        | any;
      keyStore?: any;
    }
  }
}

export {};

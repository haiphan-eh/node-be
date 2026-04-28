import type { IKeyToken } from '@/models/keyToken.model.ts';
import type { User } from '@/types/user.ts';

declare global {
  namespace Express {
    interface Request {
      objKey?:
        | {
            permissions?: string[];
          }
        | any;
      keyStore?: IKeyToken;
      user?: User;
      refreshToken?: string;
    }
  }
}

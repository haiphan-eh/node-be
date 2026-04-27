declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_CONNECT_STRING: string;
    }
  }
}

export {};
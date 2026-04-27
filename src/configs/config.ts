const env = (process.env.NODE_ENV || 'development') as 'development' | 'production';

const configs = {
  app: {
    port: Number(process.env.PORT) || 3055,
    env: env,
  },
  db: {
    uri: process.env.DB_CONNECT_STRING || '',
    maxPoolSize: 50,
  },
};

// Critical checks
if (!configs.db.uri) {
  throw new Error('❌ CRITICAL: DB_CONNECT_STRING is missing in .env file');
}

export default configs;

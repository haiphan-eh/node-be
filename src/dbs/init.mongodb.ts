import configs from '@/configs/config.js';
import mongooseCore from 'mongoose';

const connectString = configs.db.uri;

class Database {
  private static instance: Database | null = null;

  private constructor() {
    this.connect();
  }

  private async connect() {
    if (configs.app.env === 'development') {
      mongooseCore.set('debug', true);
      mongooseCore.set('debug', { color: true });
    }
    try {
      await mongooseCore.connect(connectString, { maxPoolSize: configs.db.maxPoolSize });
      console.log('✅ Connected to MongoDB');
    } catch (err) {
      console.error('❌ Error connecting to MongoDB:', err);
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instance = Database.getInstance();

export default instance;

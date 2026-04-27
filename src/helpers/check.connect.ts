import os from 'node:os';
import mongoose from 'mongoose';

const _SECONDS = 50000;
const countConnect = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of connections: ${numConnections}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // Convert to MB

    const maxConnections = numCores * 5; // Example threshold: 5 connections per CPU core
    console.log(
      `Current connections: ${numConnections}, CPU cores: ${numCores}, Memory usage: ${memoryUsage.toFixed(2)} MB`,
    );

    if (numConnections > maxConnections) {
      console.warn('⚠️  Warning: Too many connections! Consider scaling your database or optimizing your queries.');
    }
  }, _SECONDS); // Check every minute
};

export { countConnect, checkOverload };

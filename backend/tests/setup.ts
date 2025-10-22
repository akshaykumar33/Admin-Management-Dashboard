import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll,beforeAll,jest } from '@jest/globals';


let mongoServer: MongoMemoryServer;

jest.setTimeout(30000); 

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  console.log(`[TEST SETUP]: Connecting to in-memory MongoDB at ${mongoUri}`);

  await mongoose.connect(mongoUri);

  console.log('[TEST SETUP]: MongoDB connected');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }

  console.log('[TEST TEARDOWN]: MongoDB disconnected and stopped');
});



import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../server.js';
import User from '../../models/userModel.js';
import Item from '../../models/itemModel.js';
import Swap from '../../models/swapModel.js';
import jwt from 'jsonwebtoken';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Swap.deleteMany({});
  await Item.deleteMany({});
  await User.deleteMany({});
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

describe('Swap Routes', () => {
  let user1, user2, token1, token2, item1, item2;

  beforeEach(async () => {
    user1 = await User.create({
      name: 'User One',
      username: 'userone',
      email: 'user1@example.com',
      password: 'password123',
    });
    token1 = generateToken(user1._id);

    user2 = await User.create({
      name: 'User Two',
      username: 'usertwo',
      email: 'user2@example.com',
      password: 'password123',
    });
    token2 = generateToken(user2._id);

    item1 = await Item.create({
      name: 'Item One',
      description: 'Description One',
      owner: user1._id,
      category: new mongoose.Types.ObjectId(),
      images: ['img1.jpg'],
      condition: 'New',
      type: 'Trade',
      desiredItem: 'Something',
    });

    item2 = await Item.create({
      name: 'Item Two',
      description: 'Description Two',
      owner: user2._id,
      category: new mongoose.Types.ObjectId(),
      images: ['img2.jpg'],
      condition: 'Used',
      type: 'Trade',
      desiredItem: 'Something else',
    });
  });

  describe('POST /api/swaps/create', () => {
    it('should create a swap request', async () => {
      const res = await request(app)
        .post('/api/swaps/create')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          initiatorItemID: item1._id,
          ownerItemID: item2._id,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.swap.initiator.toString()).toBe(user1._id.toString());
      expect(res.body.swap.owner.toString()).toBe(user2._id.toString());
      expect(res.body.swap.status).toBe('Pending');
    });

    it('should not create a swap if items are missing', async () => {
      const res = await request(app)
        .post('/api/swaps/create')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          initiatorItemID: item1._id,
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/swaps/:id/accept', () => {
    it('should accept a swap request', async () => {
      const swap = await Swap.create({
        initiator: user1._id,
        owner: user2._id,
        initiatorItem: item1._id,
        ownerItem: item2._id,
        status: 'Pending',
        type: 'Trade'
      });

      const res = await request(app)
        .post(`/api/swaps/${swap._id}/accept`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.swap.status).toBe('Accepted');
    });

    it('should not allow requester to accept their own swap', async () => {
      const swap = await Swap.create({
        initiator: user1._id,
        owner: user2._id,
        initiatorItem: item1._id,
        ownerItem: item2._id,
        status: 'Pending',
        type: 'Trade'
      });

      const res = await request(app)
        .post(`/api/swaps/${swap._id}/accept`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/swaps/my-swaps', () => {
    it('should get swaps for the logged in user', async () => {
      await Swap.create({
        initiator: user1._id,
        owner: user2._id,
        initiatorItem: item1._id,
        ownerItem: item2._id,
        status: 'Pending',
        type: 'Trade'
      });

      const res = await request(app)
        .get('/api/swaps/my-swaps')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.statusCode).toBe(200);
      // user1 is initiator, so it should be in requests
      expect(res.body.requests.length).toBe(1);
    });
  });
});

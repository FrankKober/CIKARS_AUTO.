import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Create a pool for the adapter
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Initialize the adapter
    const adapter = new PrismaPg(pool);

    // Pass the adapter to the super constructor
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Successfully connected to the database with Adapter!');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }
}
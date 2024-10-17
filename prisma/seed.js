const moment = require('moment');
const { PrismaClient, UserRole } = require('@prisma/client');
const { hashSync } = require('bcryptjs');
const { loadEnvConfig } = require('@next/env');

// load process.env.DATABASE_URL from .env.local
loadEnvConfig(process.cwd());

class SeedSingleton {
  constructor(prisma, isInternalClient) {
    this.isInternalClient = isInternalClient;
    this.prisma = prisma;

    SeedSingleton.instance = this;
  }

  static getInstance(prisma = null) {
    if (!SeedSingleton.instance) {
      const isInternalClient = !prisma;
      const prismaClient = isInternalClient ? new PrismaClient() : prisma;

      SeedSingleton.instance = new SeedSingleton(prismaClient, isInternalClient);
    }
    return SeedSingleton.instance;
  }

  async handledDeleteAllTables() {
    try {
      // await this.deleteAllTables();
      await this.truncateAllTables();
    } catch (error) {
      console.error('Handled delete tables error:', error);
    }
  }

  async handledSeed() {
    try {
      await this.seed();
    } catch (error) {
      console.error('Handled seed error:', error);
    }
  }

  async deleteAllTables() {
    console.log('Deleting tables ...');

    await this.prisma.$transaction([this.prisma.users.deleteMany()]);

    console.log('Tables deleted.');
  }

  async truncateAllTables() {
    const tables = [
      'users',
      'events',
      'inventories',
      'participants',
      'inventory_locations',
      'inventory_resources',
      'inventory_objects',
      'actions'
    ];

    console.log('Truncating tables ...');

    const truncatePromises = tables.map((table) =>
      this.prisma.$queryRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`)
    );
    await this.prisma.$transaction(truncatePromises);

    console.log('Tables Truncated.');
  }

  async seed() {
    console.log('Start seeding ...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL, '\n');

    await this.truncateAllTables();

    const adminPassword = hashSync(process.env.ADMIN_PASSWORD, 10);

    try {
      await this.prisma.user.create({
        data: {
          name: 'Администратор системы',
          username: process.env.ADMIN_USERNAME,
          email: process.env.ADMIN_EMAIL,
          password: adminPassword,
          passwordHashes: [adminPassword],
          role: UserRole.USER_ADMIN,
          tabelNumber: '0000000000000000000000000000',
          phone: '+7 (000) 000-00-00',
          ivaProfileId: process.env.ADMIN_IVA_PROFILE_ID,
          expiresAt: moment().add(1, 'year').toDate(),
          isTemporaryPassword: false
        }
      });
      console.log('Administrator created');
    } catch (err) {
      console.error('Error while seeding. Cannot create admin: ', err);
    }
  }

  async run() {
    try {
      await this.seed();
    } catch (error) {
      console.error('Seeding error:', error);

      if (this.isInternalClient) {
        process.exit(1);
      }
    } finally {
      if (this.isInternalClient) {
        await this.prisma.$disconnect();
      }
    }
  }
}

module.exports = { SeedSingleton };

const client = new PrismaClient();
const seedSingleTon = new SeedSingleton(client, true);

seedSingleTon.run();

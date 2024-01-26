const { PrismaClient, UserStatus, UserRole } = require('@prisma/client');
const { hashSync } = require('bcryptjs');
const { lorem, phone } = require('@faker-js/faker').faker;
const { loadEnvConfig } = require('@next/env');

// load process.env.DATABASE_URL from .env.local
loadEnvConfig(process.cwd());

const password = hashSync('123456', 10);

const numberOfOrganisations = 1;
const numberOfDepartments = 2;
const numberOfUsers = 3;

const createOrganisations = (n) => {
  return Array.from(Array(n).keys())
    .reverse()
    .map((index) => ({
      name: `organisation${index}`,
      description: lorem.sentences(3)
    }));
};

const createDepartments = (n, organisationId) => {
  return Array.from(Array(n).keys())
    .reverse()
    .map((index) => ({
      name: `department${index}_${organisationId}`,
      description: lorem.sentences(3),
      organisationId
    }));
};

const createUsers = (n, departmentId, organisationId) => {
  return Array.from(Array(n).keys())
    .reverse()
    .map((index) => ({
      name: `user${index} name`,
      username: `user${index}_${departmentId}`,
      email: `user${index}_${departmentId}@email.com`,
      phone: phone.number(),
      password,
      passwordHashes: password,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      departmentId,
      organisationId
    }));
};

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

    await this.prisma.$transaction([
      this.prisma.users.deleteMany(),
      this.prisma.departments.deleteMany(),
      this.prisma.organisations.deleteMany()
    ]);

    console.log('Tables deleted.');
  }

  async truncateAllTables() {
    const tables = ['users', 'departments', 'organisations'];

    console.log('Truncating tables ...');

    const truncatePromises = tables.map((table) =>
      this.prisma.$queryRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`)
    );
    await this.prisma.$transaction(truncatePromises);

    console.log('Tables Truncated.');
  }

  // just require file, or fn will be called 2 times
  // without exception handling here
  async seed() {
    console.log('Start seeding ...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL, '\n');

    // await this.deleteAllTables();
    await this.truncateAllTables();

    const organisations = createOrganisations(numberOfOrganisations);

    for (const organisation of organisations) {
      const createdOrganisation = await this.prisma.organisation.create({
        data: organisation
      });
      console.log(`Created organisation: ${createdOrganisation.name}`);

      const departments = createDepartments(numberOfDepartments, createdOrganisation.id);

      for (const department of departments) {
        const createdDepartment = await this.prisma.department.create({
          data: department
        });
        console.log(`Created organisation department: ${createdDepartment.name}`);

        const users = createUsers(
          numberOfUsers,
          createdDepartment.id,
          createdOrganisation.id
        );

        for (const user of users) {
          const createdUser = await this.prisma.user.create({ data: user });
          console.log(`Created department user: ${createdUser.name}`);
        }
      }

      const adminPassword = hashSync('admin', 10);

      await this.prisma.user.create({
        data: {
          name: 'Administrator',
          username: 'admin',
          email: 'admin@email.com',
          phone: phone.number(),
          password: adminPassword,
          passwordHashes: adminPassword,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          departmentId: null,
          organisationId: null
        }
      });
    }

    console.log('Seeding finished.');
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

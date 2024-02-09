const { PrismaClient, UserRole, UserStatus } = require('@prisma/client');
const { hashSync } = require('bcryptjs');
const { loadEnvConfig } = require('@next/env');
const {
  fakeUser,
  fakeOrganisation,
  fakeDepartment,
  fakeEvent,
  fakeInventory
} = require('./fixtures/fake-data');
const { random } = require('underscore');
const { log } = require('console');

// load process.env.DATABASE_URL from .env.local
loadEnvConfig(process.cwd());

const password = hashSync('123456', 10);

const numberOfOrganisations = 2;
const numberOfDepartments = 2;
const numberOfUsers = 5;
const numberOfEvents = 10;

const createOrganisations = (n) =>
  Array.from(Array(n).keys())
    .reverse()
    .map((_, index) => ({ ...fakeOrganisation(), name: `Организация ${index}` }));

const createDepartments = (n, organisationId) =>
  Array.from(Array(n).keys())
    .reverse()
    .map((_, index) => ({ ...fakeDepartment(index), organisationId }));

const createUsers = (n, departmentId, organisationId) =>
  Array.from(Array(n).keys())
    .reverse()
    .map(() => ({
      ...fakeUser(),
      organisationId,
      departmentId,
      password,
      passwordHashes: password
    }));

const createInventories = (n, eventId) =>
  Array.from(Array(n).keys())
    .reverse()
    .map(() => ({ ...fakeInventory(), eventId }));

const createEvents = (users) => {
  let counter = 0;
  const events = [];

  while (counter <= users.length / 2) {
    const firstUser = users[random(users.length - 1)];
    const anotherUser = users[random(users.length - 1)];

    if (firstUser.id !== anotherUser.id) {
      const userIds = [firstUser, anotherUser].map(({ id }) => ({ id }));
      events.push({ ...fakeEvent(), participants: { connect: userIds } });
    }

    counter++;
  }

  events.push({ ...fakeEvent() });
  events.push({ ...fakeEvent() });
  events.push({ ...fakeEvent() });

  return events;
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
    const tables = ['users', 'departments', 'organisations', 'events'];

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

    const createdUsers = [];

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
          createdUsers.push(createdUser);
          console.log(`Created department user: ${createdUser.name}`);
        }
      }
    }

    const adminPassword = hashSync('admin', 10);

    await this.prisma.user.create({
      data: {
        ...fakeUser(),
        name: 'Администратор системы',
        username: 'admin',
        email: 'admin@email.com',
        password: adminPassword,
        passwordHashes: adminPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        departmentId: null,
        organisationId: null
      }
    });
    console.log('Created Admin');

    // Create events
    const events = createEvents(createdUsers);

    for (const event of events) {
      const createdEvent = await this.prisma.event.create({
        data: event,
        include: {
          participants: true
        }
      });
      console.log(
        `Created event: ${createdEvent.id}, withParticipants: ${!!createdEvent.participants.length}`
      );

      const inventories = createInventories(random(13), createdEvent.id);

      for (const inventory of inventories) {
        const createdInventory = await this.prisma.inventory.create({
          data: inventory,
          include: {
            participants: true
          }
        });
        console.log(
          `Created inventory: ${createdInventory.id} for event: ${createdEvent.id}, withParticipants: ${!!createdInventory.participants.length} `
        );
      }
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

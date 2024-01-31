import { UserStatus, UserRole, EventType } from '@prisma/client';
import { fakerRU as faker, fi } from '@faker-js/faker';
import { random } from 'underscore';
import { transliterate as tr } from 'transliteration';

export function fakeOrganisation() {
  return {
    name: faker.lorem.word(),
    description: faker.lorem.words(5)
  };
}

export function fakeDepartment() {
  return {
    name: faker.lorem.word(),
    description: faker.lorem.words(5)
  };
}

export function fakeUser() {
  const sex = ['female', 'male'][random(1)] as 'female' | 'male';

  const firstName = faker.person.firstName(sex);
  const middleName = faker.person.middleName(sex);
  const lastName = faker.person.lastName(sex);

  const firstNameTranslited = tr(firstName);
  const lastNameTranslited = tr(lastName);
  const middleNameTranslited = tr(middleName);

  const name = [lastName, firstName, middleName].join(' ');
  const username = [
    lastNameTranslited,
    firstNameTranslited[0],
    middleNameTranslited[0]
  ].join('');

  return {
    name,
    username,
    email: faker.internet.email({
      firstName: firstNameTranslited,
      lastName: lastNameTranslited,
      provider: 'example.ru'
    }),
    phone: `+7${faker.phone.number()}`,
    password: faker.lorem.words(5),
    passwordHashes: faker.lorem.words(5),
    role: faker.helpers.arrayElement([UserRole.ADMIN, UserRole.USER] as const),
    status: faker.helpers.arrayElement([
      UserStatus.ACTIVE,
      UserStatus.BLOCKED,
      UserStatus.RECUSED
    ] as const),
    updatedAt: faker.date.anytime(),
    tabelNumber: faker.string.numeric(8),
    ivaProfileId: undefined,
    refreshToken: undefined
  };
}

export function fakeEvent() {
  return {
    type: faker.helpers.arrayElement([EventType.AUDIT, EventType.BRIEFING] as const),
    commandId: faker.lorem.words(5),
    commandNumber: faker.lorem.words(5),
    commandDate: faker.lorem.words(5),
    orderId: faker.lorem.words(5),
    orderNumber: faker.lorem.words(5),
    orderDate: faker.lorem.words(5),
    startAt: faker.date.anytime(),
    endAt: faker.date.anytime(),
    balanceUnit: faker.lorem.words(5),
    balanceUnitRegionCode: faker.lorem.words(5),
    updatedAt: faker.date.anytime()
  };
}

import * as moment from 'moment';
import { UserStatus, UserRole, EventType, EventStatus } from '@prisma/client';
import { fakerRU as faker } from '@faker-js/faker';
import { random } from 'underscore';
import { transliterate as tr } from 'transliteration';
import { DATE_FORMAT } from '../../constants/date';

export function fakeOrganisation() {
  return {
    name: faker.lorem.word(),
    description: faker.lorem.words(5)
  };
}

export function fakeDepartment(idx) {
  return {
    name: `Отдел ${idx}${faker.string.numeric({ length: 2 })}`,
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
    role: faker.helpers.arrayElement([
      UserRole.ADMIN,
      UserRole.USER,
      UserRole.CHAIRMAN,
      UserRole.PARTICIPANT,
      UserRole.FINANCIALLY_RESPONSIBLE_PERSON,
      UserRole.ACCOUNTANT,
      UserRole.INSPECTOR,
      UserRole.MANAGER,
      UserRole.ACCOUNTANT_ACCEPTOR,
      UserRole.ENGINEER
    ] as const),
    status: faker.helpers.arrayElement([
      UserStatus.ACTIVE,
      UserStatus.BLOCKED,
      UserStatus.RECUSED
    ] as const),
    updatedAt: faker.date.anytime(),
    tabelNumber: faker.string.numeric(8),
    ivaProfileId: faker.string.uuid(),
    refreshToken: null
  };
}

export function fakeEvent() {
  const date = moment(faker.date.anytime());
  const type = faker.helpers.arrayElement([EventType.AUDIT, EventType.BRIEFING] as const);

  return {
    type,
    commandId: faker.string.uuid(),
    commandNumber: faker.string.numeric(3),
    commandDate: moment(faker.date.anytime()).toISOString(),
    orderId: faker.string.uuid(),
    orderNumber: faker.string.numeric(2),
    orderDate: moment(faker.date.anytime()).toISOString(),
    startAt: date.toISOString(),
    endAt: date.add({ year: 1 }).toISOString(),
    balanceUnit: faker.string.nanoid(5),
    balanceUnitRegionCode: faker.string.numeric(2),
    updatedAt: faker.date.anytime(),
    status:
      type === EventType.AUDIT
        ? faker.helpers.arrayElement([
            EventStatus.OPEN,
            EventStatus.CLOSED,
            EventStatus.REMOVED
          ])
        : faker.helpers.arrayElement([
            EventStatus.IN_PROGRESS,
            EventStatus.NOT_STARTED,
            EventStatus.PASSED
          ])
  };
}

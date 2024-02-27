import * as moment from 'moment';
import { UserStatus, UserRole, EventStatus, BriefingStatus } from '@prisma/client';
import { fakerRU as faker } from '@faker-js/faker';
import { random } from 'underscore';
import { transliterate as tr } from 'transliteration';

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
  const briefingStatus = faker.helpers.arrayElement([
    BriefingStatus.IN_PROGRESS,
    BriefingStatus.NOT_STARTED,
    BriefingStatus.PASSED
  ]);

  return {
    commandId: faker.string.uuid(),
    commandNumber: faker.string.numeric(3),
    commandDate: moment(faker.date.anytime()).toISOString(),
    orderId: faker.string.uuid(),
    orderNumber: faker.string.numeric(2),
    orderDate: moment(faker.date.anytime()).toISOString(),
    startAt: date.toISOString(),
    endAt: date.add({ year: 1 }).toISOString(),
    balanceUnit: faker.string.nanoid(5),
    balanceUnitRegionCode: faker.helpers.arrayElement([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '50',
      '51',
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '58',
      '59',
      '60',
      '61',
      '62',
      '63',
      '64',
      '65',
      '66',
      '67',
      '68',
      '69',
      '70',
      '71',
      '72',
      '73',
      '74',
      '75',
      '76',
      '77',
      '78',
      '79',
      '83',
      '86',
      '87',
      '89',
      '99'
    ]),
    updatedAt: faker.date.anytime(),
    status: faker.helpers.arrayElement([
      EventStatus.OPEN,
      EventStatus.CLOSED,
      EventStatus.REMOVED
    ]),
    briefingStatus: faker.helpers.arrayElement([
      BriefingStatus.IN_PROGRESS,
      BriefingStatus.NOT_STARTED,
      BriefingStatus.PASSED
    ]),
    briefingRoomInviteLink:
      briefingStatus === BriefingStatus.IN_PROGRESS ? 'http://localhost:3000' : null
  };
}

export function fakeInventory() {
  // @TODO добавить сведения по мере понимания их состава
  return {
    number: faker.string.numeric(1),
    date: moment(faker.date.anytime()).toISOString(),
    id: faker.string.uuid()
  };
}

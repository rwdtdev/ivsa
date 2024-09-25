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
      UserRole.TECHNOLOGY_OPERATOR,
      UserRole.USER_ADMIN,
      UserRole.DEVELOPER
    ] as const),
    status: faker.helpers.arrayElement([UserStatus.ACTIVE, UserStatus.BLOCKED] as const),
    updatedAt: faker.date.anytime(),
    tabelNumber: faker.string.numeric(8),
    ivaProfileId: faker.string.uuid(),
    refreshToken: null,
    expiresAt: faker.date.future()
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
    status: faker.helpers.arrayElement([EventStatus.ACTIVE, EventStatus.REMOVED]),
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
  const code = faker.helpers.arrayElement([
    'I01A01',
    'I02001',
    'I02A02',
    'I02F01',
    'I02F02',
    'I02F03',
    'I02F04',
    'I01011',
    'I02G01',
    'I02G02',
    'I02011',
    'I02G11',
    'I02G22'
  ]);

  const names = {
    I01A01: {
      shortName: 'ИНВ-1 (ОС)',
      name: 'Инвентаризационная опись основных средств (кроме зданий и сооруж., зем. участков, об-тов природопольз-я, груз. вагонов)'
    },
    I02001: {
      shortName: 'ИНВ-3',
      name: 'Инвентаризационная опись товарно-материальных ценностей'
    },
    I02A02: {
      shortName: 'ИНВ-3 (ОУ)',
      name: 'Инвентаризационная опись товарно-материальных ценностей (оборудование к установке)'
    },
    I02F01: {
      shortName: 'ИНВ-5 (ОХ)',
      name: 'Инвентаризационная опись товарно-материальных ценностей, принятых на ответ.хранение'
    },
    I02F02: {
      shortName: 'ИНВ-5 (МП)',
      name: 'Инвентаризационная опись товарно-материальных ценностей, принятых на ответ.хранение (Материалы, принятые на переработку)'
    },
    I02F03: {
      shortName: 'ИНВ-5 (ТК)',
      name: 'Инвентаризационная опись товарно-материальных ценностей, принятых на ответ.хранение (Товары, принятые на комиссию)'
    },
    I02F04: {
      shortName: 'ИНВ-5 (ОМ)',
      name: 'Инвентаризационная опись товарно-материальных ценностей, принятых на ответ.хранение (Оборудование, принятое для монтажа)'
    },
    I01011: {
      shortName: 'ФНУ-49',
      name: 'Инвентаризационная опись малоценных ОС и иных аналогичных активов, переданных в эксплуатацию (на 013, 023 забал. счетах)'
    },
    I02G01: {
      shortName: 'ФНУ-50 (< 12м.)',
      name: 'Инв. опись активов со сроком использования не более 12 месяцев, учитываемых в качестве МПЗ, переданных в производство'
    },
    I02G02: {
      shortName: 'ФНУ-50 (> 12м.)',
      name: 'Инв. опись активов со сроком использования более 12 месяцев, учитываемых в качестве МПЗ, переданных в производство'
    },
    I02011: {
      shortName: 'ФНУ-55',
      name: 'Инвентаризационная опись спецодежды в эксплуатации'
    },
    I02G11: {
      shortName: 'ФНУ-55(< 12 вкл)',
      name: 'Инвентаризационная опись спецодежды в эксплуатации cо сроком использования <12м включая класс 502100'
    },
    I02G22: {
      shortName: 'ФНУ-55(< 12 иск)',
      name: 'Инвентаризационная опись спецодежды в эксплуатации cо сроком использования <12м.исключая класс 502100 только кл. 502200'
    }
  };

  return {
    number: faker.string.numeric(1),
    date: moment(faker.date.anytime()).toISOString(),
    id: faker.string.uuid(),
    code,
    shortName: names[code].shortName,
    name: names[code].name
  };
}

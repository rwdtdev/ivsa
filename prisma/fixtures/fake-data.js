"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeEvent = exports.fakeUser = exports.fakeDepartment = exports.fakeOrganisation = void 0;
var client_1 = require("@prisma/client");
var faker_1 = require("@faker-js/faker");
var underscore_1 = require("underscore");
var transliteration_1 = require("transliteration");
function fakeOrganisation() {
    return {
        name: faker_1.fakerRU.lorem.word(),
        description: faker_1.fakerRU.lorem.words(5)
    };
}
exports.fakeOrganisation = fakeOrganisation;
function fakeDepartment() {
    return {
        name: faker_1.fakerRU.lorem.word(),
        description: faker_1.fakerRU.lorem.words(5)
    };
}
exports.fakeDepartment = fakeDepartment;
function fakeUser() {
    var sex = ['female', 'male'][(0, underscore_1.random)(1)];
    var firstName = faker_1.fakerRU.person.firstName(sex);
    var middleName = faker_1.fakerRU.person.middleName(sex);
    var lastName = faker_1.fakerRU.person.lastName(sex);
    var firstNameTranslited = (0, transliteration_1.transliterate)(firstName);
    var lastNameTranslited = (0, transliteration_1.transliterate)(lastName);
    var middleNameTranslited = (0, transliteration_1.transliterate)(middleName);
    var name = [lastName, firstName, middleName].join(' ');
    var username = [
        lastNameTranslited,
        firstNameTranslited[0],
        middleNameTranslited[0]
    ].join('');
    return {
        name: name,
        username: username,
        email: faker_1.fakerRU.internet.email({
            firstName: firstNameTranslited,
            lastName: lastNameTranslited,
            provider: 'example.ru'
        }),
        phone: "+7".concat(faker_1.fakerRU.phone.number()),
        password: faker_1.fakerRU.lorem.words(5),
        passwordHashes: faker_1.fakerRU.lorem.words(5),
        role: faker_1.fakerRU.helpers.arrayElement([client_1.UserRole.ADMIN, client_1.UserRole.USER]),
        status: faker_1.fakerRU.helpers.arrayElement([
            client_1.UserStatus.ACTIVE,
            client_1.UserStatus.BLOCKED,
            client_1.UserStatus.RECUSED
        ]),
        updatedAt: faker_1.fakerRU.date.anytime(),
        tabelNumber: faker_1.fakerRU.string.numeric(8),
        ivaProfileId: undefined,
        refreshToken: undefined
    };
}
exports.fakeUser = fakeUser;
function fakeEvent() {
    return {
        type: faker_1.fakerRU.helpers.arrayElement([client_1.EventType.AUDIT, client_1.EventType.BRIEFING]),
        commandId: faker_1.fakerRU.lorem.words(5),
        commandNumber: faker_1.fakerRU.lorem.words(5),
        commandDate: faker_1.fakerRU.lorem.words(5),
        orderId: faker_1.fakerRU.lorem.words(5),
        orderNumber: faker_1.fakerRU.lorem.words(5),
        orderDate: faker_1.fakerRU.lorem.words(5),
        startAt: faker_1.fakerRU.date.anytime(),
        endAt: faker_1.fakerRU.date.anytime(),
        balanceUnit: faker_1.fakerRU.lorem.words(5),
        balanceUnitRegionCode: faker_1.fakerRU.lorem.words(5),
        updatedAt: faker_1.fakerRU.date.anytime()
    };
}
exports.fakeEvent = fakeEvent;

import generate from 'password-generator';

const minLength = 12;
const maxLength = 32;

export const isStrong = (password: string) => {
  const isHaveLower = /([a-z])/g.test(password);
  const isHaveUpper = /([A-Z])/g.test(password);
  const isHaveNumber = /([\d])/g.test(password);
  const isHaveSpecial = /\W/g.test(password);
  const isHaveRepeatConsecutive = /([\w\d\W])\1{2,}/g.test(password);

  return (
    isHaveLower &&
    isHaveUpper &&
    isHaveNumber &&
    isHaveSpecial &&
    !isHaveRepeatConsecutive
  );
};

export const generatePassword = (password: string = ''): string => {
  const randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;

  return !isStrong(password)
    ? generatePassword(generate(randomLength, false, /[\w\d\W]/))
    : password;
};

export const generatePasswordAsync = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(generatePassword());
    } catch (err) {
      reject(err);
    }
  });
};

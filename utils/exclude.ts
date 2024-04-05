/**
 * @link https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
 */
export const exclude = <T, Key extends keyof T>(
  item: T,
  ...keys: Key[]
): Omit<T, Key> => {
  if (!item) throw new Error('Item arg is missing.');

  for (const key of keys) {
    delete item[key];
  }

  return item;
};

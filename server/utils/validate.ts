import { Schema } from 'zod';

export const validate = (schema: Schema, data: any) => {
  return schema.parse(data);
};

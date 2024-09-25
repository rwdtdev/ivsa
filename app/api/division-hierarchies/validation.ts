import { z } from 'zod';

const isoDatetimeSchema = z
  .string()
  .min(1)
  .transform((date) => new Date(date).toISOString());

const NodeSchema = z
  .object({
    nodeid: z.string().trim().min(1),
    nodename: z.string().trim().min(1),
    parentid: z.string().trim(),
    datefrom: isoDatetimeSchema,
    dateto: isoDatetimeSchema,
    tlevel: z.string().trim(),
    divtype: z.string().trim(),
    title_sh: z.string().trim().min(1),
    title_md: z.string().trim(),
    title_ln: z.string().trim(),
    bukrs: z.string()
  })
  .strict();

export const CreateDivisionHierarchySchema = z
  .object({
    session_id: z.string().trim().min(1),
    part_num: z.string().trim().min(1),
    parts: z.string().trim().min(1),
    hierid: z.string().trim().min(1),
    title_sh: z.string().trim().min(1),
    title_md: z.string().trim(),
    title_ln: z.string().trim(),
    hier_nodes: z.array(NodeSchema).default([])
  })
  .strict();

export type CreateDivisionHierarchyData = z.infer<typeof CreateDivisionHierarchySchema>;

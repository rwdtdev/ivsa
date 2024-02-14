import { z } from 'zod';
import { NextResponse } from "next/server";
import { cn, rd, yl } from './ansi-helpers';

export function makeResponseCORSLess(response: NextResponse | Response): NextResponse | Response {
  response.headers.set('Access-Control-Allow-Origin', '*'); // N.B.: This is here to enable "Try it out" feature of swagger-ui to access localhost:3000 wuthout getting scared of CORS violations.
  return response;
}

//const RANDOM_CUID_SUFFIX_LENGTH = 25;
//export const validateTabelNumber = (tabelNumber: string): boolean => tabelNumber.match(new RegExp(`^[0-9]{3}-[0-9]{4}-[0-9]{3}-[a-fA-F0-9]{${RANDOM_CUID_SUFFIX_LENGTH}}$`, 'g')) !== null;

export const VALID_TABEL_NUMBERS = [
  'cls1ue75i000w08l5g6maf0go',
  'cls1ue75i000x08l5fgljglsa',
  'cls1ue75i000y08l57jkc16yb',
  'cls1ue75i000z08l5c6ky4les',
  'cls1ue75i001008l51m9wf4ib',
  'cls1ue75i001108l53yc88dbf',
  'cls1ue75i001208l5eev56qka',
  'cls1ue75i001308l59jrk6z71',
  'cls1ue75i001408l52c69bbxv',
  'cls1ue75i001508l5b2lvfkii',
];
export const validateTabelNumber = (tabelNumber: string): boolean => {
  return VALID_TABEL_NUMBERS.includes(tabelNumber);
}

const VALID_EVENT_IDS = [
  'cls1uf3ru001608l53hxdblbc',
  'cls1uf3ru001708l5fwd3dmu0',
  'cls1uf3ru001808l5dpr9g6y1',
  'cls1uf3ru001908l59c51ajvz',
  'cls1uf3ru001a08l51w4602ej',
  'cls1uf3ru001b08l5hhle4y2m',
  'cls1uf3ru001c08l51tw35svy',
  'cls1uf3ru001d08l5hdksbd7w',
  'cls1uf3ru001e08l50daefth6',
  'cls1uf3ru001f08l518oy33e9',
];
export const validateEventId = (eventId: string): boolean => {
  return VALID_EVENT_IDS.includes(eventId);
}

const VALID_INVENTORY_IDS = [
  'cls1ufnb4001g08l5gj1l3e57',
  'cls1ufnb4001h08l57pil02sg',
  'cls1ufnb4001i08l53hpl64wa',
  'cls1ufnb4001j08l5628b75b8',
  'cls1ufnb4001k08l58y023t1b',
  'cls1ufnb4001l08l5981w702f',
  'cls1ufnb4001m08l57qe6d7pl',
  'cls1ufnb4001n08l5hc768ox3',
  'cls1ufnb4001o08l5af3thflv',
  'cls1ufnb4001p08l58oax7xry',
];
export const validateInventoryId = (inventoryId: string): boolean => {
  return VALID_INVENTORY_IDS.includes(inventoryId);
}

//export const EventIdsSchema = z.string().min(40);
export const EventIdsSchema = z.string().cuid();
export function zodValidateEventId(eventId: string) {
  try {
    const validatedEventId = EventIdsSchema.parse(eventId, {/* ..ParseParams?.. */});
    console.log(`${yl('[Zod]').b()} ${cn(`Parsed string 'cls1uf3ru001d08l5hdksbd7w', result is:`)} %O`, validatedEventId);
    return validatedEventId;
  } catch (err) {
    console.log(`${yl('[Zod]').b()} ${cn('caught a Zod error when making a Zod parse of a string!')} ${rd('error:')} %O`, err);
    return err;
  }
}


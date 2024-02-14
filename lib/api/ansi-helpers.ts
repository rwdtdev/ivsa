import { T } from "vitest/dist/reporters-rzC174PQ";

const methodsColours = new Map([
  [ 'GET', '67;145;224' ],
  [ 'POST', '23;154;94' ],
  [ 'PUT', '222;131;18' ],
  [ 'DELETE', '249;62;62'],
]);
  
export const generateConsoleLogPrefix = (method: string, path: string) => {
  let methodColour = methodsColours.get(method) ?? '127;127;127';  
  return `\x1B[33;1m[ \x1B[48;2;${methodColour};38;2;255;255;255m ${method} \x1B[49;33m \x1B[36;22;3m${path}\x1B[33;23;1m ]:\x1B[m `;
}

export function validityState<T>(paramName: string, validationCallback: (param: T) => boolean, param: T): string {
  return `${cn(paramName).i()} is ${validationCallback(param) ? gr('valid').b() : rd('invalid').b()}`;
} 

/**
 * Class to style strings with ```ANSI``` codes.
 * 
 * Supports main text styles (**bold**, *italic*, underlined & ~~strike-through~~), 9 preset background and foreground colours as well as an arbitrary foreground/background **RGB** colour.
 * 
 * Chainable.
 * 
 * Examples:
 * > ```ts
 * const txt = new ANSI('sampleText`);
 * console.log(`ANSI text styling examples:`);
 * console.log(`bold: ${ txt.b() }`);
 * console.log(`italic: ${ txt.i() }`);
 * console.log(`bold & italic: ${ txt.b().i() }`);
 * console.log(`underlined: ${ txt.u() }`);
 * console.log(`strike-through: ${ txt.s() }`);
 * console.log(`red foreground & gray background: ${ txt.rd().graB() }`);
 * console.log(`white foreground & orange background; ${ txt.wh().colB(255,165,0) }`);
 * console.log(`magenta foreground, turquoise background, underlined, italic and striken-through: ${ txt.mg().colB(64,224,208).u().i().s() }`);```
 * 
 * and also:
 * 
 * ```ts
 * console.log(`bold: ${ b('sampleText') }`);
 * console.log(`italic & red: ${ i('sampleText').rd() }`);
 * ```
 */
export class ANSI {
  constructor(private _text: string) {}

  // Style:
  b = () => new ANSI(`\x1B[1m${this._text}\x1B[22m`);
  i = () => new ANSI(`\x1B[3m${this._text}\x1B[23m`);
  u = () => new ANSI(`\x1B[4m${this._text}\x1B[24m`);
  s = () => new ANSI(`\x1B[9m${this._text}\x1B[29m`);

  // Set colours:
  //   Foreground:
  rd = (background: boolean = false) => new ANSI(`\x1B[${background ? '48' : '38'};2;255;0;0m${this._text}\x1B[${background ? '49' : '39'}m`);
  gr = (background: boolean = false) => new ANSI(`\x1B[${background ? '48' : '38'};2;0;255;0m${this._text}\x1B[${background ? '49' : '39'}m`);
  bl = (background: boolean = false) => new ANSI(`\x1B[${background ? '48' : '38'};2;0;0;255m${this._text}\x1B[${background ? '49' : '39'}m`);
  cn = (background: boolean = false) => new ANSI(`\x1B[${background ? '48' : '38'};2;0;255;255m${this._text}\x1B[${background ? '49' : '39'}m`);
  mg = (background: boolean = false) => new ANSI(`\x1B[${background ? '48' : '38'};2;255;0;255m${this._text}\x1B[${background ? '49' : '39'}m`);
  yl = (background: boolean = false) => new ANSI(`\x1B[${background ? '48' : '38'};2;255;255;0m${this._text}\x1B[${background ? '49' : '39'}m`);
  wh = (background: boolean = false) => new ANSI(`\x1B[${background ? '48' : '38'};2;255;255;255m${this._text}\x1B[${background ? '49' : '39'}m`);
  bla = (background: boolean = false) => new ANSI(`\x1B[${background ? '48' : '38'};2;0;0;0m${this._text}\x1B[${background ? '49' : '39'}m`);
  gra = (background: boolean = false) => new ANSI(`\x1B[${background ? '48' : '38'};2;127;127;127m${this._text}\x1B[${background ? '49' : '39'}m`);
  //   Background:
  rdB = () => this.rd(true);
  grB = () => this.gr(true);
  blB = () => this.bl(true);
  cnB = () => this.cn(true);
  mgB = () => this.mg(true);
  ylB = () => this.yl(true);
  whB = () => this.wh (true);
  blaB = () => this.bla(true);
  graB = () => this.gra(true);

  // RGB colours:
  col = (r: string|number, g: string|number, b: string|number, background: boolean = false) => {
    const R = typeof r === 'number' ? r.toFixed(0) : r.slice(0,2);
    const G = typeof g === 'number' ? g.toFixed(0) : g.slice(0,2);
    const B = typeof b === 'number' ? b.toFixed(0) : b.slice(0,2);
    return new ANSI(`\x1B[${background ? '48' : '38'};2;${R};${G};${B}m${this._text}\x1B[${background ? '49' : '39'}m`);
  }
  colB = (r: string|number, g: string|number, b: string|number) => this.col(r, g, b, true);

  toString(): string {
    return this._text;
  }
}

export const b = (text: string) => new ANSI(text).b();
export const i = (text: string) => new ANSI(text).i();
export const u = (text: string) => new ANSI(text).u();
export const s = (text: string) => new ANSI(text).s();
export const rd = (text: string) => new ANSI(text).rd();
export const gr = (text: string) => new ANSI(text).gr();
export const bl = (text: string) => new ANSI(text).bl();
export const cn = (text: string) => new ANSI(text).cn();
export const mg = (text: string) => new ANSI(text).mg();
export const yl = (text: string) => new ANSI(text).yl();
export const wh = (text: string) => new ANSI(text).wh();
export const bla = (text: string) => new ANSI(text).bla();
export const gra = (text: string) => new ANSI(text).gra();
export const rdB = (text: string) => new ANSI(text).rdB();
export const grB = (text: string) => new ANSI(text).grB();
export const blB = (text: string) => new ANSI(text).blB();
export const cnB = (text: string) => new ANSI(text).cnB();
export const mgB = (text: string) => new ANSI(text).mgB();
export const ylB = (text: string) => new ANSI(text).ylB();
export const whB = (text: string) => new ANSI(text).whB();
export const blaB = (text: string) => new ANSI(text).blaB();
export const graB = (text: string) => new ANSI(text).graB();
export const col = (text: string, r: string|number, g: string|number, b: string|number) => new ANSI(text).col(r,g,b);
export const colB = (text: string, r: string|number, g: string|number, b: string|number) => new ANSI(text).colB(r,g,b);

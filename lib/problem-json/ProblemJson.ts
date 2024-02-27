import _ from 'underscore';
import { v4 as uuidv4 } from 'uuid';

const defaultTitle = 'Ошибка';
const defaultDetail = 'Произошла ошибка';

export type ProblemJsonOptions = {
  message: string;
  type: string;
  title: string;
  status: number;
  detail: Function | string;
  instance: string;
};

export default class ProblemJson extends Error {
  public type: string;
  public title: string;
  public detail: Function | string;
  public instance: string;
  public status: number;

  constructor(params: ProblemJsonOptions) {
    const { message, type, title, status, detail, instance, ...other } = params;

    super(message || '');

    /**
     * Тип ошибки. В формате URI (ведущем на wiki с подробным описанием
     * ошибки) или urn.
     * @example urn:problem-type:entity-not-found
     */
    this.type = type || '';

    /**
     * Краткое описание произошедшей ошибки.
     * @example Not Found
     */
    this.title = title || defaultTitle;

    /**
     * Полное описание произошедшей ошибки.
     * @example Entity with id=111 not found
     */
    // @ts-ignore
    this.detail = _(detail).isFunction() ? detail(params) : detail || defaultDetail;

    /**
     * Дублирует статуса ответа.
     * @example 404
     */
    this.status = status || 500;

    /**
     * Идентификатор ошибки, по которому ее можно найти в логе. Обычно uuid.
     * @example urn:uuid:d294b32b-9dda-4292-b51f-35f65b4bf64
     */
    this.instance = instance || `urn:uuid:${uuidv4()}`;
    Object.assign(this, other);
  }
}

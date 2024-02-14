import _ from 'underscore';
import { commonErrorDictionaty } from './dictionary';


class ProblemJson {
    private type: string;
    private title: string;
    private status: string;
    private description: string;
    private info: Record<string, any>

    constructor({type, title, status, description, ...other}) {
        this.type = type;
        this.title = title;
        this.status = status;
        this.description = description;
        this.info = other;
    }
}

export default (dictionary) => {
  const keys = _.keys(dictionary);

  return _(keys).map((key) =>  {
    const cl = () => {


    }

    cl.prototype.
  })
};

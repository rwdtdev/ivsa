import _ from 'underscore';
import { kebabCase } from 'change-case';
import ProblemJson, { ProblemJsonOptions } from './ProblemJson';
import defaultDictionary from './default-dictionary';

const defaultAutoTypeFunc = (parentKey: string, key: string) =>
  `${parentKey ? `${parentKey}:` : ''}${kebabCase(key)}`;

export const makeErrorDictionary = ({
  baseParent = ProblemJson,
  autoTypeFunc = defaultAutoTypeFunc
} = {}) => {
  const iterateDictionary: any = (dict = defaultDictionary, parentKey = '') =>
    _.mapObject(dict, (val, key) => {
      const autoType = autoTypeFunc(parentKey, key);

      if (val && _.isObject(val)) {
        if ('type' in val || 'title' in val || 'Parent' in val) {
          // @ts-ignore
          return class extends (val.Parent || baseParent) {
            constructor(constructorParams: ProblemJsonOptions) {
              super({
                // @ts-ignore
                type: autoType,
                ...val,
                ...constructorParams
              });
            }
          };
        }

        return iterateDictionary(val, autoType);
      }
    });

  return iterateDictionary;
};

export default makeErrorDictionary()(defaultDictionary, 'urn:problem-type');

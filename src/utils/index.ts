import pick from 'lodash/pick.js';

export const getInfoData = <T, K extends keyof T>({
  fields,
  object,
}: {
  fields: K[];
  object: T;
}): Pick<T, K> => {
  return pick(object, fields) as Pick<T, K>;
};

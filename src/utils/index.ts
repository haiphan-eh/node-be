import pick from 'lodash/pick.js';

export const getInfoData = <T, K extends keyof T>({
  fields,
  object,
}: {
  fields: K[];
  object: T;
}) => {
  return pick(object, fields);
};

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

export const getSelectData = <T extends string>(select: T[] = [], value = 1) => {
  return Object.fromEntries(select.map((el: T) => [el, value])) as Record<T, number>;
};

export const updateNestedObjectParser = (obj: any): any => {
  const final: Record<string, any> = {};

  for (const key of Object.keys(obj)) {
    // Remove undefined and null values
    if (obj[key] === undefined || obj[key] === null) {
      continue;
    }

    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      const nestedResponse = updateNestedObjectParser(obj[key]);

      for (const nestedKey of Object.keys(nestedResponse)) {
        final[`${key}.${nestedKey}`] = nestedResponse[nestedKey];
      }
    } else {
      final[key] = obj[key];
    }
  }

  return final;
};

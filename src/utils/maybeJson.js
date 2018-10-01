import { isString } from "d3-let";

export default value => {
  if (isString(value)) {
    try {
      return JSON.parse(value);
    } catch (msg) {
      return value;
    }
  }
  return value;
};

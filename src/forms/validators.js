import map from "../utils/map";

const required = {
  set(el, data) {
    if (data.required) el.property("required", true);
  },

  validate(el, value) {
    if (el.property("required"))
      if (!value) return "required";
      else if (value === "") {
        // this is valid, no need to continue with the remaining validators
        return true;
      }
  }
};

const minLength = {
  set(el, data) {
    var value = +data.minLength;
    if (value === value) el.attr("minlength", value);
  },

  validate(el, value) {
    var l = +el.attr("minlength");
    if (l === l && l > 0 && value.length < l)
      return `too short - ${l} characters or more expected`;
  }
};

const maxLength = {
  set(el, data) {
    var value = +data.maxLength;
    if (value === value) el.attr("maxlength", value);
  },

  validate(el, value) {
    var l = +el.attr("maxlength");
    if (l === l && l > 0 && value && value.length > l)
      return `too long - ${l} characters or less expected`;
  }
};

const minimum = {
  set(el, data) {
    var value = +data.minimum;
    if (value === value) el.attr("min", value);
  },

  validate(el, value) {
    var r = range(el);
    if (r && +value < r[0]) return `must be greater or equal ${r[0]}`;
  }
};

const maximum = {
  set(el, data) {
    var value = +data.maximum;
    if (value === value) el.attr("max", value);
  },

  validate(el, value) {
    var r = range(el);
    if (r && +value > r[1]) return `must be less or equal ${r[1]}`;
  }
};

export default map({
  required,
  minLength,
  maxLength,
  minimum,
  maximum
});

const range = el => {
  var l0 = el.attr("min"),
    l1 = el.attr("max");
  l0 = l0 === null ? -Infinity : +l0;
  l1 = l1 === null ? Infinity : +l1;
  return [l0, l1];
};

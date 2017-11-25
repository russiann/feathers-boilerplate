const Enum = require('enum');

module.exports = (path, definition, app) => {
  const newEnum = new Enum(definition, { ignoreCase: true });
  const enums = app.get('enums');
  
  enums[path] = newEnum;
  
  const values = newEnum.enums.map(e => e.value.toString());
  
  return values;
};
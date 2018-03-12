// @flow

import { types as mstTypes } from 'mobx-state-tree';

const types = {
  ...mstTypes,
  model: function(properties: Object) {
    const schema = {};
    const filteredTypes = {};

    Object.keys(properties).forEach(key => {
      const { type, fieldType, ...props } = properties[key].type;

      filteredTypes[key] = type;
      schema[key] = { ...props, type: fieldType };
    });

    const model = mstTypes.model(filteredTypes);
    model.schema = schema;

    return model;
  }
};

export default types;

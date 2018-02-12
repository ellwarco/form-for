// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import type { Schema } from './Form';
import cloneObject from './cloneObject';

export type Props = {
  for: Object,
  schema?: Schema,
  index?: number,
  children: React.Node
};

export default class FieldGroup extends React.Component<Props> {
  static contextTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string
  };

  static childContextTypes = {
    object: PropTypes.object,
    schema: PropTypes.object,
    onChange: PropTypes.func
  };

  /*
   * Getters
   */

  getChildContext() {
    return {
      object: this.props.for,
      schema: this.getSchema(),
      onChange: this.handleChange
    };
  }

  getSchema(): Schema {
    return this.props.schema || this.props.for.schema || this.throwUndefinedSchema();
  }

  getNewObjectFor(name: string, value: any, index: ?number) {
    if (typeof index === 'undefined') return cloneObject(this.props.for, { [name]: value });

    const previousValue = this.props.for[name];
    let newValue;

    if (Array.isArray(previousValue)) {
      newValue = [...previousValue];
      newValue[index] = value;
    } else {
      // $FlowFixMe
      newValue = cloneObject(previousValue, { [index]: value });
    }

    return cloneObject(this.props.for, { [name]: newValue });
  }

  /*
   * Dispatchers
   */

  dispatchChange(newObject: Object) {
    this.context.name ? this.dispatchNestedChange(newObject) : this.dispatchFormChange(newObject);
  }

  dispatchNestedChange(newObject: Object) {
    this.context.onChange(this.context.name, newObject, this.props.index);
  }

  dispatchFormChange(newObject: Object) {
    this.context.onChange(newObject);
  }

  /*
   * Handlers
   */

  handleChange = (name: string, value: any, index?: number) => {
    const newObject = this.getNewObjectFor(name, value, index);
    this.dispatchChange(newObject);
  };

  /*
   * Lifecycle
   */

  render(): React.Node {
    return this.props.children || null;
  }

  /*
   * Errors
   */

  throwUndefinedSchema(): any {
    const constructor = this.props.for.constructor.name;
    throw new Error(`Undefined schema for "${constructor}" instance`);
  }
}

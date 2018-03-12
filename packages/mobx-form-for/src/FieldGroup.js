// @flow

import { action } from 'mobx';
import { observer } from 'mobx-react';
import { FieldGroup as BaseFieldGroup } from 'form-for';

class FieldGroup extends BaseFieldGroup {
  mutate(name: string, value: any) {
    const mutator = () => (this.props.for[name] = value);
    action(`Update form value ${this.getPrefix()}[${name}]`, mutator)();
  }

  onChange(name: string, value: any) {
    if (this.props.for[name] !== value) this.mutate(name, value);
    this.dispatchFormChange();
  }
}

export default observer(FieldGroup);

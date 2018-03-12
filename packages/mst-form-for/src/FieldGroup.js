// @flow

import { applyAction } from 'mobx-state-tree';
import { observer } from 'mobx-react';
import { FieldGroup as BaseFieldGroup } from 'form-for';

class FieldGroup extends BaseFieldGroup {
  onChange(name: string, value: any, index?: any) {
    applyAction(this.props.for, self => (self[name] = value));
    this.dispatchFormChange();
  }
}

export default observer(FieldGroup);

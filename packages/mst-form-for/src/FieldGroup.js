// @flow

import { applyAction } from 'mobx-state-tree';
import { observer } from 'mobx-react';
import { FieldGroup as MobxFieldGroup } from 'mobx-form-for';

class FieldGroup extends MobxFieldGroup {
  mutate(name: string, value: any, index?: any) {
    this.props.for.formForChange(name, value);
  }
}

export default observer(FieldGroup);

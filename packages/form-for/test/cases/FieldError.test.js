import React from 'react';
import { mount } from 'enzyme';
import { Field, Form } from '../../src';
import Input from '../fixtures/Input';

describe('Field error', () => {
  Field.connect('text', Input);

  const object = {
    name: 'John',
    schema: { name: { type: 'text', error: 'invalidate' } }
  };

  it('does not show error if not existent', () => {
    const wrapper = mount(
      <Form for={object} showErrors>
        <Field name="name" />
      </Form>
    );

    expect(wrapper.find('input').prop('data-error')).toBeNull();
  });

  it('shows object error', () => {
    const wrapper = mount(
      <Form for={{ ...object, invalidate: 'Invalid' }} showErrors>
        <Field name="name" />
      </Form>
    );

    expect(wrapper.find('input').prop('data-error')).toEqual('Invalid');
  });

  it('shows error when function', () => {
    function invalidate() {
      return `${this.name} is invalid`;
    }

    const wrapper = mount(
      <Form for={{ ...object, invalidate }}>
        <Field name="name" />
      </Form>
    );

    wrapper.find('input').simulate('change', { target: { value: 'New value' } });
    expect(wrapper.find('input').prop('data-error')).toEqual('New value is invalid');
  });

  it('shows loading and clears error when resolved async function', async () => {
    const promise = Promise.resolve();
    const invalidate = () => promise;

    const wrapper = mount(
      <Form for={{ ...object, invalidate }}>
        <Field name="name" />
      </Form>
    );

    expect.assertions(3);
    expect(wrapper.find('input').prop('data-validating')).toBeTruthy();

    return promise.then(() => {
      wrapper.update();
      expect(wrapper.find('input').prop('data-validating')).toBeFalsy();
      expect(wrapper.find('input').prop('data-error')).toBeFalsy();
    });
  });

  it('shows loading and error when rejected async function', async () => {
    const promise = Promise.reject('async invalid');
    const invalidate = () => promise;

    const wrapper = mount(
      <Form for={{ ...object, invalidate }}>
        <Field name="name" />
      </Form>
    );

    expect.assertions(3);
    expect(wrapper.find('input').prop('data-validating')).toBeTruthy();

    return promise.then().catch(() => {
      wrapper.update();
      expect(wrapper.find('input').prop('data-validating')).toBeFalsy();
      expect(wrapper.find('input').prop('data-error')).toEqual('async invalid');
    });
  });

  it('shows errors (touches) on focus', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="name" error="Prop error" />
      </Form>
    );

    wrapper
      .find('input[name="name"]')
      .first()
      .simulate('focus');

    const input = wrapper.find('input[name="name"]').first();
    expect(input.prop('data-error')).toEqual('Prop error');
  });

  it('shows error prop', () => {
    const wrapper = mount(
      <Form for={object}>
        <Field name="name" error="Prop error" />
      </Form>
    );

    const input = wrapper.find('input[name="name"]').first();
    expect(input.prop('data-error')).toEqual('Prop error');
  });

  it('clears error once its gone', () => {
    function invalidate() {
      if (this.name === 'John') return 'invalid';
    }

    const wrapper = mount(
      <Form for={{ ...object, invalidate }}>
        <Field name="name" />
      </Form>
    );

    let input = wrapper.find('input[name="name"]').first();
    expect(input.prop('data-error')).toEqual('invalid');

    wrapper
      .find('input[name="name"]')
      .first()
      .simulate('change', { target: { value: 'New value' } });

    input = wrapper.find('input[name="name"]').first();
    expect(input.prop('data-error')).toBeFalsy();
  });

  // TODO - test setCustomValidity and validationMessage
});

/* global jest */
import React from 'react';
import { Component as CKANResourceLocatorField } from '../CKANResourceLocatorField';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4/build/index';

Enzyme.configure({ adapter: new Adapter() });

describe('CKANResourceLocatorField', () => {
  const MockSelectComponent = () => <div />;
  const MockTextFieldComponent = () => <input type="text" />;

  describe('renderResourceSelect()', () => {
    it('has "Resource name" as the title and is disabled without a value', () => {
      const wrapper = shallow(
        <CKANResourceLocatorField
          name="test-field"
          value={{}}
          SelectComponent={MockSelectComponent}
          TextFieldComponent={MockTextFieldComponent}
        />
      );

      const input = wrapper.find('[disabled]');
      expect(input).toHaveLength(1);
      expect(input.props().title).toBe('Resource name');
      expect(input.props().disabled).toBe(true);
    });
  });

  describe('handleNotificationOfChanges()', () => {
    it('does not alert when initial value is empty', () => {
      window.alert = jest.fn();

      const wrapper = shallow(
        <CKANResourceLocatorField
          name="test-field"
          value={null}
          SelectComponent={MockSelectComponent}
          TextFieldComponent={MockTextFieldComponent}
        />
      );
      wrapper.instance().handleNotificationOfChanges();
      expect(window.alert).not.toHaveBeenCalled();
    });

    it('alerts when a value is changed', () => {
      window.alert = jest.fn();

      const wrapper = shallow(
        <CKANResourceLocatorField
          name="test-field"
          value={{ endpoint: 'https://example.com' }}
          SelectComponent={MockSelectComponent}
          TextFieldComponent={MockTextFieldComponent}
        />
      );
      wrapper.instance().handleNotificationOfChanges();
      expect(window.alert).toHaveBeenCalled();
    });

    it('alerts when a value is changed but not subsequently', () => {
      window.alert = jest.fn();

      const wrapper = shallow(
        <CKANResourceLocatorField
          name="test-field"
          value={{ endpoint: 'https://example.com' }}
          SelectComponent={MockSelectComponent}
          TextFieldComponent={MockTextFieldComponent}
        />
      );
      wrapper.instance().handleNotificationOfChanges();
      wrapper.instance().handleNotificationOfChanges();
      wrapper.instance().handleNotificationOfChanges();
      expect(window.alert).toHaveBeenCalledTimes(1);
    });
  });
});

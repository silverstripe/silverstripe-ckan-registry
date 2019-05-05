import React from 'react';
import { Component as CKANResultConditionsField } from '../CKANResultConditionsField';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('CKANResultConditionsField', () => {
  const MockTextField = () => <div />;
  const MockSelectField = () => <div />;

  describe('getFieldName()', () => {
    it('returns a composite field name containing the field name', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      expect(wrapper.instance().getFieldName('bar')).toBe('foo-bar');
    });

    it('gives priority to passed props', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      expect(wrapper.instance().getFieldName('bar', { name: 'baz' })).toBe('baz-bar');
    });
  });

  describe('getValue()', () => {
    it('returns the select and text field value from the state', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          value={{
            0: {
              'match-select': '0',
              'match-text': 'monkey',
            },
          }}
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      const result = wrapper.instance().getValue();
      expect(result[0]['match-select']).toBe('0');
      expect(result[0]['match-text']).toBe('monkey');
    });
  });

  describe('handleChange()', () => {
    it('merges the changed input name and value into the state', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      wrapper.instance().handleChange({
        target: {
          name: 'animal',
          value: 'elephant',
        },
      });

      const result = wrapper.instance().state;
      expect(result[0].animal).toBe('elephant');

      wrapper.instance().handleChange({
        target: {
          name: 'coffee',
          value: 'cold brew',
        },
      });

      const result2 = wrapper.instance().state;
      expect(result2[0].coffee).toBe('cold brew');
      // Ensure existing state values are retained
      expect(result2[0].animal).toBe('elephant');
    });
  });

  describe('render()', () => {
    it('renders a select', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      expect(wrapper.find(MockSelectField).length).toBe(1);
    });

    it('renders a text input', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      expect(wrapper.find(MockTextField).length).toBe(1);
    });

    it('renders a single field with the correct name attribute', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      expect(wrapper.find('[name="foo"]').length).toBe(1);
    });
  });

  describe('renderHiddenInput()', () => {
    it('renders a hidden input containing a serialized value', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          value={{
            0: {
              'match-select': '1',
              'match-text': 'Wellington Zoo',
            },
          }}
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      const hiddenInput = wrapper.find('input[type="hidden"]');
      expect(hiddenInput.length).toBe(1);
      expect(hiddenInput.props().value).toContain('match-select');
      expect(hiddenInput.props().value).toContain('match-text');
      expect(hiddenInput.props().value).toContain('Wellington Zoo');
    });

    it('has an empty value when no match text has been entered', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          value={null}
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      const hiddenInput = wrapper.find('input[type="hidden"]');
      expect(hiddenInput.length).toBe(1);
      expect(hiddenInput.props().value).toBeFalsy();
    });

    it('sets value after text input has changed and clears when emptying', () => {
      const wrapper = shallow(
        <CKANResultConditionsField
          name="foo"
          value={null}
          TextFieldComponent={MockTextField}
          SelectComponent={MockSelectField}
        />
      );

      wrapper.setState({
        0: {
          'foo-match-select': '1',
          'foo-match-text': 'Hello world',
        }
      });
      expect(wrapper.find('input[type="hidden"]').props().value).toContain('Hello world');

      wrapper.setState({
        0: {
          'foo-match-select': '1',
          'foo-match-text': '',
        }
      });
      expect(wrapper.find('input[type="hidden"]').props().value).toBeFalsy();
    });
  });
});

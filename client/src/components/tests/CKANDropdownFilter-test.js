import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4/build/index';
import CKANDropdownFilter from '../CKANDropdownFilter';

Enzyme.configure({ adapter: new Adapter() });

describe('CKANDropdownFilter', () => {
  describe('render()', () => {
    it('renders a select', () => {
      const wrapper = mount(
        <CKANDropdownFilter
          id="123"
          selections={['foo']}
        />
      );

      expect(wrapper.find('select').length).toBe(1);
    });

    it('renders the provided selections as options', () => {
      const wrapper = mount(
        <CKANDropdownFilter
          id="123"
          selections={['foo', 'bar', 'baz']}
        />
      );

      expect(wrapper.find('option').length).toBe(3);
    });

    it('renders a label for the select field when provided', () => {
      const wrapper = mount(
        <CKANDropdownFilter
          id="123"
          label="Search things"
          selections={['foo']}
        />
      );

      expect(wrapper.find('label').length).toBe(1);
      expect(wrapper.find('label').text()).toContain('Search things');
    });

    it('renders a hidden input field with columns in it', () => {
      const wrapper = mount(
        <CKANDropdownFilter
          id="123"
          allColumns={false}
          columns={['name', 'number']}
          selections={['foo']}
        />
      );

      const columnsInput = wrapper.find('input[name="DropdownFilter[123][Columns]"]');
      expect(columnsInput.length).toBe(1);
      expect(columnsInput.props().value).toBe('["name","number"]');
    });

    it('renders a hidden input field with the "allColumns" value as an int', () => {
      const wrapper = mount(
        <CKANDropdownFilter
          id="123"
          allColumns
          selections={['foo']}
        />
      );

      const columnsInput = wrapper.find('input[name="DropdownFilter[123][AllColumns]"]');
      expect(columnsInput.length).toBe(1);
      expect(columnsInput.props().value).toBe(1);
    });

    it('adds the provided extraClass values', () => {
      const wrapper = mount(
        <CKANDropdownFilter
          id="123"
          extraClass="foo bar baz"
          selections={['foo']}
        />
      );

      expect(wrapper.find('div.foo.bar.baz').length).toBe(1);
    });
  });
});

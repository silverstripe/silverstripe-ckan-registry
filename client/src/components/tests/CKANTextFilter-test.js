import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CKANTextFilter from '../CKANTextFilter';

Enzyme.configure({ adapter: new Adapter() });

describe('CKANTextFilter', () => {
  describe('render()', () => {
    it('renders a text input', () => {
      const wrapper = mount(
        <CKANTextFilter
          id="123"
        />
      );

      expect(wrapper.find('input[type="text"]').length).toBe(1);
    });

    it('renders a label for the input field when provided', () => {
      const wrapper = mount(
        <CKANTextFilter
          id="123"
          label="Search things"
        />
      );

      expect(wrapper.find('label').length).toBe(1);
      expect(wrapper.find('label').text()).toContain('Search things');
    });

    it('adds the provided extraClass values', () => {
      const wrapper = mount(
        <CKANTextFilter
          id="123"
          extraClass="foo bar baz"
        />
      );

      expect(wrapper.find('div.foo.bar.baz').length).toBe(1);
    });
  });
});

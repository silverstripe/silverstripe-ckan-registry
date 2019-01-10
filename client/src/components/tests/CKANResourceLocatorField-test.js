import React from 'react';
import { Component as CKANResourceLocatorField } from '../CKANResourceLocatorField';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4/build/index';

Enzyme.configure({ adapter: new Adapter() });

describe('CKANResourceLocatorField', () => {
  const MockSelectComponent = () => <div />;

  describe('renderResourceSelect()', () => {
    it('has "Resource name" as the title and is disabled without a value', () => {
      const wrapper = shallow(
        <CKANResourceLocatorField
          name="test-field"
          value={{}}
          SelectComponent={MockSelectComponent}
        />
      );

      const input = wrapper.find('[disabled]');
      expect(input).toHaveLength(1);
      expect(input.props().title).toBe('Resource name');
      expect(input.props().disabled).toBe(true);
    });
  });
});

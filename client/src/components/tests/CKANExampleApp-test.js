import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4/build/index';
import CKANExampleApp from '../CKANExampleApp';

Enzyme.configure({ adapter: new Adapter() });

describe('CKANExampleApp', () => {
  describe('getTitle()', () => {
    it('concatenates the dataset and resource name', () => {
      const wrapper = shallow(
        <CKANExampleApp name="Ministry of Silly Walks" resourceName="Lunging" />
      );

      expect(wrapper.instance().getTitle()).toBe('Ministry of Silly Walks / Lunging');
    });
  });
});

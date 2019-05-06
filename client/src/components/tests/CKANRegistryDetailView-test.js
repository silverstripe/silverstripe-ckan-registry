/* global window */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CKANRegistryDetailView from '../CKANRegistryDetailView';
import i18n from 'i18n';
import { Link } from 'react-router-dom';

Enzyme.configure({ adapter: new Adapter() });

describe('CKANRegistryDetailView', () => {
  window.i18n = i18n;

  describe('render()', () => {
    it('renders a back link', () => {
      const wrapper = shallow(
        <CKANRegistryDetailView />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.find(Link).length).toBe(1);
    });
  });

  describe('renderFields()', () => {
    it('renders a loading message', () => {
      const wrapper = shallow(
        <CKANRegistryDetailView />,
        { disableLifecycleMethods: true }
      );
      wrapper.setState({ loading: true });

      expect(wrapper.text()).toContain('Loading...');
    });

    it('renders a not found message when data failed to fetch', () => {
      const wrapper = shallow(
        <CKANRegistryDetailView />,
        { disableLifecycleMethods: true }
      );
      wrapper.setState({ data: [] });

      expect(wrapper.text()).toContain('No results found');
    });

    it('renders the results as a dl list', () => {
      const wrapper = shallow(
        <CKANRegistryDetailView />,
        { disableLifecycleMethods: true }
      );
      wrapper.setState({
        data: [{
          Foo: 'Bar',
          Bar: 'Baz',
        }],
      });

      expect(wrapper.find('.ckan-registry__detail-list')).toHaveLength(1);
      expect(wrapper.find('dt')).toHaveLength(2);
      expect(wrapper.find('dd')).toHaveLength(2);
      expect(wrapper.text()).toContain('Foo');
      expect(wrapper.text()).toContain('Bar');
      expect(wrapper.text()).toContain('Baz');
    });
  });
});

/* global window */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4/build/index';
import CKANRegistryDisplay from '../CKANRegistryDisplay';
import i18n from 'i18n';
import { Redirect } from 'react-router-dom';

Enzyme.configure({ adapter: new Adapter() });

describe('CKANRegistryDisplay', () => {
  window.i18n = i18n;

  describe('getVisibleFields()', () => {
    it('returns field OriginalLabels that are set to ShowInResultsView', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={[
            { ReadableLabel: 'Foo', OriginalLabel: 'foo', ShowInResultsView: '0' },
            { ReadableLabel: 'Bar', OriginalLabel: 'bar', ShowInResultsView: '1' },
            { ReadableLabel: 'Baz', OriginalLabel: 'baz', ShowInResultsView: '1' },
          ]}
        />,
        { disableLifecycleMethods: true }
      );

      const result = wrapper.instance().getVisibleFields();
      expect(result).not.toContain('foo');
      expect(result).toContain('bar');
      expect(result).toContain('baz');
    });
  });

  describe('handleGetPage()', () => {
    it('sets the page number to the state', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.state().currentPage).toBe(1);

      wrapper.instance().handleGetPage(123);
      expect(wrapper.state().currentPage).toBe(123);
    });
  });

  describe('render()', () => {
    it('renders nothing when no resource is specified', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.html()).toBeNull();
    });

    it('returns a Redirect when switching pages', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay spec={{ resource: 'something' }} />,
        { disableLifecycleMethods: true }
      );

      wrapper.setState({ selectedRow: 123 });
      expect(wrapper.find(Redirect).length).toBe(1);
    });
  });
});

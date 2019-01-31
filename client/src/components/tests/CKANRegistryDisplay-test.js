/* global window jest */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4/build/index';
import CKANRegistryDisplay from '../CKANRegistryDisplay';
import i18n from 'i18n';
import Query from 'lib/CKANApi/DataStore/Query';
import { Redirect } from 'react-router-dom';

Enzyme.configure({ adapter: new Adapter() });

describe('CKANRegistryDisplay', () => {
  window.i18n = i18n;

  describe('getVisibleFields()', () => {
    it('returns field OriginalLabels that are set to ShowInResultsView', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={[
            { ReadableLabel: 'Foo', OriginalLabel: 'foo', ShowInResultsView: false },
            { ReadableLabel: 'Bar', OriginalLabel: 'bar', ShowInResultsView: true },
            { ReadableLabel: 'Baz', OriginalLabel: 'baz', ShowInResultsView: true },
          ]}
          location={{ search: '' }}
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
        <CKANRegistryDisplay
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      // Mock the `loadData` method on the component as enzyme will not prevent lifecycle events for
      // setState
      wrapper.instance().loadData = jest.fn();
      wrapper.update();

      expect(wrapper.state().currentPage).toBe(1);

      wrapper.instance().handleGetPage(123);
      expect(wrapper.state().currentPage).toBe(123);
    });
  });

  describe('applyResultConditionsFilters()', () => {
    it('takes fields with ResultConditions and pushes query filters for them', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={[
            {
              OriginalLabel: 'Location',
              ShowInDetailView: true,
              DisplayConditions: [{
                'match-select': '1',
                'match-text': 'Australia',
              }],
            },
            {
              OriginalLabel: 'Hometown',
              ShowInDetailView: true,
              DisplayConditions: [{
                'match-select': '0',
                'match-text': 'Canberra',
              }],
            },
            {
              OriginalLabel: 'Birthplace',
              ShowInDetailView: false,
              DisplayConditions: [{
                'match-select': '1',
                'match-text': 'Melbourne',
              }],
            },
          ]}
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      const query = new Query(['Name']);
      wrapper.instance().applyResultConditionsFilters(query);
      expect(query.hasFilter()).toBe(true);

      const parsedQuery = query.parse('testing');
      expect(parsedQuery).toContain('"Location" ILIKE \'%Australia%\'');
      expect(parsedQuery).toContain('"Hometown" NOT ILIKE \'%Canberra%\'');
      expect(parsedQuery).not.toContain('"Birthplace" ILIKE \'%Melbourne%\'');
    });
  });

  describe('render()', () => {
    it('renders nothing when no resource is specified', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.html()).toBeNull();
    });

    it('returns a Redirect when switching pages', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay spec={{ identifier: 'something' }} location={{ search: '' }} />,
        { disableLifecycleMethods: true }
      );

      wrapper.setState({ selectedRow: 123 });
      expect(wrapper.find(Redirect).length).toBe(1);
    });
  });
});

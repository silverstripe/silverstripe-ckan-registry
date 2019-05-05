/* global window jest */

jest.mock('lib/CKANApi/DataStore');

import DataStore from 'lib/CKANApi/DataStore';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CKANRegistryDisplay from '../CKANRegistryDisplay';
import i18n from 'i18n';
import Query from 'lib/CKANApi/DataStore/Query';
import { Redirect } from 'react-router-dom';

Enzyme.configure({ adapter: new Adapter() });

const dataStoreMocks = {
  search: jest.fn(),
  searchSql: jest.fn(),
  countSql: jest.fn(),
};

DataStore.mockImplementation(() => ({
  ...dataStoreMocks
}));

const testFields = [
  { ReadableLabel: 'Foo', OriginalLabel: 'foo', ShowInResultsView: false, Type: 'text' },
  { ReadableLabel: 'Bar', OriginalLabel: 'bar', ShowInResultsView: true, Type: 'text' },
  { ReadableLabel: 'Baz', OriginalLabel: 'baz', ShowInResultsView: true, Type: 'numeric' },
];

const mockLoadData = wrapper => {
  const mock = jest.fn();
  // eslint-disable-next-line no-param-reassign
  wrapper.instance().loadData = mock;
  wrapper.update();
  return mock;
};

describe('CKANRegistryDisplay', () => {
  window.i18n = i18n;

  describe('getGriddleProps()', () => {
    it('pulls page properties from state and/or props', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '' }}
          pageSize={20}
        />,
        { disableLifecycleMethods: true }
      );

      mockLoadData(wrapper);

      wrapper.setState({
        currentPage: 4,
        recordCount: 1321,
      });

      const griddleProps = wrapper.instance().getGriddleProps();

      expect(griddleProps.pageProperties).toMatchObject({
        currentPage: 4,
        recordCount: 1321,
        pageSize: 20,
      });
    });

    it('sets sort iff set in state', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '' }}
          fields={testFields}
        />,
        { disableLifecycleMethods: true }
      );

      mockLoadData(wrapper);

      let griddleProps = wrapper.instance().getGriddleProps();

      expect(griddleProps.sortProperties).toBeFalsy();

      wrapper.setState({
        sort: { sortField: 'baz', sortAscending: true }
      });

      griddleProps = wrapper.instance().getGriddleProps();

      expect(griddleProps.sortProperties[0]).toMatchObject({
        id: 'Baz',
        sortAscending: true,
      });
    });
  });

  describe('hasValidConfig()', () => {
    it('returns false when no fields are passed as props', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.instance().hasValidConfig()).toBe(false);
    });

    it('returns false when fields list is empty', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={[]}
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.instance().hasValidConfig()).toBe(false);
    });

    it('returns false when no fields are configured to be displayed', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={[
            { ShowInResultsView: false, ReadableLabel: 'foo' },
            { ShowInResultsView: false, ReadableLabel: 'bar' },
            { ShowInResultsView: false, ReadableLabel: 'baz' },
          ]}
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.instance().hasValidConfig()).toBe(false);
    });

    it('returns true when valid', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={[
            { ShowInResultsView: true, ReadableLabel: 'foo' },
          ]}
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.instance().hasValidConfig()).toBe(true);
    });
  });

  describe('getStateFromLocation()', () => {
    it('parses the current page from URL search parameters', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '?page=45' }}
        />,
        { disableLifecycleMethods: true }
      );

      const stateDefaults = wrapper.instance().getStateFromLocation();
      expect(stateDefaults.currentPage).toBe(45);
    });

    it('parses the current page from URL search parameters', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '?foo=45' }}
          urlKeys={{ page: 'foo' }}
        />,
        { disableLifecycleMethods: true }
      );

      const stateDefaults = wrapper.instance().getStateFromLocation();
      expect(stateDefaults.currentPage).toBe(45);
    });

    it('parses the sort attributes from URL search parameters', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '?sort=Foo&sortdirection=ASC' }}
        />,
        { disableLifecycleMethods: true }
      );

      const stateDefaults = wrapper.instance().getStateFromLocation();
      expect(stateDefaults.sort).toMatchObject({
        sortField: 'Foo',
        sortAscending: true,
      });
    });

    it('parses the sort attributes from URL search parameters with custom URL keys', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '?foo=Bin&bar=DESC' }}
          urlKeys={{ sort: 'foo', sortDirection: 'bar' }}
        />,
        { disableLifecycleMethods: true }
      );

      const stateDefaults = wrapper.instance().getStateFromLocation();
      expect(stateDefaults.sort).toMatchObject({
        sortField: 'Bin',
        sortAscending: false,
      });
    });

    it('parses the filter parameters from URL search parameters', () => {
      const dataset = 'testing';
      const wrapper = shallow(
        <CKANRegistryDisplay
          spec={{ dataset }}
          location={{ search: '?filter[1]=Foo' }}
        />,
        { disableLifecycleMethods: true }
      );

      const stateDefaults = wrapper.instance().getStateFromLocation();
      expect(stateDefaults.filterValues).toMatchObject({
        [`${dataset}_1`]: 'Foo',
      });
    });

    it('parses the filter parameters from URL search parameters', () => {
      const dataset = 'testing';
      const wrapper = shallow(
        <CKANRegistryDisplay
          spec={{ dataset }}
          location={{ search: '?foo[92]=Bin&foo[21]=Baz' }}
          urlKeys={{ filter: 'foo' }}
        />,
        { disableLifecycleMethods: true }
      );

      const stateDefaults = wrapper.instance().getStateFromLocation();
      expect(stateDefaults.filterValues).toMatchObject({
        [`${dataset}_21`]: 'Baz',
        [`${dataset}_92`]: 'Bin',
      });
    });
  });

  describe('getVisibleFields()', () => {
    it('returns field OriginalLabels that are set to ShowInResultsView', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={testFields}
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

  describe('getVisibleFieldTypes()', () => {
    it('returns field label and types for visible fields', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={testFields}
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      const result = wrapper.instance().getVisibleFieldTypes();
      expect(result).not.toContainEqual({ label: 'foo', type: 'text' });
      expect(result).toContainEqual({ label: 'bar', type: 'text' });
      expect(result).toContainEqual({ label: 'baz', type: 'numeric' });
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

  describe('applyFilterValues()', () => {
    let query;
    beforeEach(() => {
      query = {
        filter: jest.fn(),
      };
    });

    const filters = [
      { id: 1, allColumns: false, columns: [{ target: 'foo' }] },
      { id: 2, allColumns: true, columns: null },
      { id: 3, allColumns: false, columns: null }, // Invalid
      { id: 4, allColumns: false, columns: [{ target: 'bar' }] },
    ];
    const dataset = 'testing';

    it('applies given fields to the given query', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          spec={{ dataset }}
          fields={testFields}
          filters={filters}
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      wrapper.instance().applyFilterValues(query, {
        [`${dataset}_1`]: 'One',
        [`${dataset}_2`]: 'Two',
        [`${dataset}_4`]: '', // Empty should be ignored
        [`${dataset}_5`]: 'Invalid',
      });

      const { calls } = query.filter.mock;

      expect(calls).toHaveLength(2);
      expect(calls[0]).toEqual([['foo'], 'One']);
      expect(calls[1]).toEqual([['bar', 'baz'], 'Two']);
    });
  });

  describe('resetQueryFilters()', () => {
    const applyConditionsMock = jest.fn();
    let query;
    let wrapper;

    beforeEach(() => {
      query = new Query();
      query.filter(['test'], 'one');

      wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      wrapper.instance().applyResultConditionsFilters = applyConditionsMock;
      mockLoadData(wrapper);
    });

    it('should clear existing filters', () => {
      expect(query.hasFilter()).toBe(true);
      wrapper.instance().resetQueryFilters(query);
      expect(query.hasFilter()).toBe(false);
    });

    it('should call "applyResultConditionsFilters"', () => {
      wrapper.instance().resetQueryFilters(query);
      expect(applyConditionsMock).toHaveBeenCalled();
    });

    it('should set a default sort on the query', () => {
      wrapper.instance().resetQueryFilters(query);
      expect(query.orderSpec).toHaveLength(1);
      expect(query.orderSpec[0]).toMatchObject({
        field: '_id',
        direction: 'ASC',
      });
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

  describe('handleFilter()', () => {
    it('resets the current page to page 1', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={testFields}
          location={{ search: '?page=12' }}
        />,
        { disableLifecycleMethods: true }
      );

      // Prevent data from loading
      mockLoadData(wrapper);

      expect(wrapper.state('currentPage')).toBe(12);
      wrapper.instance().handleFilter({ testing_1: 'Test' });
      expect(wrapper.state('currentPage')).toBe(1);
    });
  });

  describe('handleSort()', () => {
    it('maps the given sort to its "OriginalLabel', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={testFields}
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      // Prevent data from loading
      mockLoadData(wrapper);

      wrapper.instance().handleSort({ id: 'Foo', sortAscending: true });
      const sort = wrapper.state('sort');

      expect(sort).toMatchObject({
        sortField: 'foo',
        sortAscending: true,
      });
    });

    it('resets the current page to page 1', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={testFields}
          location={{ search: '?page=12' }}
        />,
        { disableLifecycleMethods: true }
      );

      // Prevent data from loading
      mockLoadData(wrapper);

      expect(wrapper.state('currentPage')).toBe(12);
      wrapper.instance().handleSort({ id: 'Foo', sortAscending: true });
      expect(wrapper.state('currentPage')).toBe(1);
    });
  });

  describe('loadData()', () => {
    beforeEach(() => {
      Object.values(dataStoreMocks).forEach(mock => {
        mock.mockReset();
        mock.mockReturnValueOnce(
          Promise.resolve(false)
        );
      });
    });

    it('is called when relevant state is changed', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '' }}
        />
      );
      const mock = mockLoadData(wrapper);

      expect(mock).not.toHaveBeenCalled();

      wrapper.setState({
        currentPage: 6
      });
      expect(mock).toHaveBeenCalled();
      mock.mockReset();

      wrapper.setState({
        sort: { sortField: 'A', sortAscending: true }
      });
      expect(mock).toHaveBeenCalled();
      mock.mockReset();
      wrapper.setState({
        sort: { sortField: 'A', sortAscending: true }
      });
      expect(mock).not.toHaveBeenCalled();
      mock.mockReset();

      wrapper.setState({
        filterValues: {
          thing_2: 'test',
        }
      });
      expect(mock).toHaveBeenCalled();
    });

    it('calls datastore.search when simple configuration is provided', () => {
      shallow(
        <CKANRegistryDisplay
          spec={{ endpoint: 'foo', dataset: 'bar', identifier: 'baz' }}
          fields={testFields}
          location={{ search: '' }}
        />
      );

      const searchCalls = dataStoreMocks.search.mock.calls;
      expect(searchCalls).toHaveLength(1);
      expect(searchCalls[0]).toEqual([
        ['bar', 'baz', '_id'], // _id is always added
        null,
        false,
        30,
        0,
        null
      ]);
    });

    it('adheres to page size being configured as a prop', () => {
      shallow(
        <CKANRegistryDisplay
          spec={{ endpoint: 'foo', dataset: 'bar', identifier: 'baz' }}
          fields={testFields}
          pageSize={100}
          location={{ search: '' }}
        />
      );

      const searchCalls = dataStoreMocks.search.mock.calls;
      expect(searchCalls).toHaveLength(1);
      expect(searchCalls[0]).toEqual([
        ['bar', 'baz', '_id'], // _id is always added
        null,
        false,
        100,
        0,
        null
      ]);
    });

    it('still uses basic search for basic sort', () => {
      shallow(
        <CKANRegistryDisplay
          spec={{ endpoint: 'foo', dataset: 'bar', identifier: 'baz' }}
          fields={testFields}
          location={{ search: '?sort=bar&sortdirection=ASC' }}
        />
      );

      const searchCalls = dataStoreMocks.search.mock.calls;
      expect(searchCalls).toHaveLength(1);
      expect(searchCalls[0]).toEqual([
        ['bar', 'baz', '_id'], // _id is always added
        null,
        false,
        30,
        0,
        { sortField: 'bar', sortAscending: true }
      ]);
    });

    it('sets offset correctly when viewing pages', () => {
      shallow(
        <CKANRegistryDisplay
          spec={{ endpoint: 'foo', dataset: 'bar', identifier: 'baz' }}
          fields={testFields}
          location={{ search: '?page=3' }}
        />
      );

      const searchCalls = dataStoreMocks.search.mock.calls;
      expect(searchCalls).toHaveLength(1);
      expect(searchCalls[0]).toEqual([
        ['bar', 'baz', '_id'], // _id is always added
        null,
        false,
        30,
        60,
        null
      ]);
    });

    it('switches to SQL search on filters', () => {
      shallow(
        <CKANRegistryDisplay
          spec={{ endpoint: 'foo', dataset: 'bar', identifier: 'baz' }}
          fields={testFields}
          filters={[
            { id: 1, allColumns: false, columns: [{ target: 'foo' }] },
            { id: 2, allColumns: true, columns: null },
          ]}
          location={{ search: '?filter[1]=test' }}
        />
      );

      const countCalls = dataStoreMocks.countSql.mock.calls;
      expect(countCalls).toHaveLength(1);
      const query = countCalls[0][0];
      expect(query.hasFilter()).toBe(true);
      expect(query.parse()).toContain('"foo" ILIKE \'%test%\'');
    });

    it('adheres to page size prop when using SQL search', () => {
      shallow(
        <CKANRegistryDisplay
          spec={{ endpoint: 'foo', dataset: 'bar', identifier: 'baz' }}
          fields={testFields}
          filters={[
            { id: 1, allColumns: false, columns: [{ target: 'foo' }] },
            { id: 2, allColumns: true, columns: null },
          ]}
          pageSize={100}
          location={{ search: '?filter[1]=test' }}
        />
      );

      const countCalls = dataStoreMocks.countSql.mock.calls;
      expect(countCalls).toHaveLength(1);
      const query = countCalls[0][0];
      expect(query.limit).toBe(100);
    });

    it('sets page correctly when using SQL search', () => {
      shallow(
        <CKANRegistryDisplay
          spec={{ endpoint: 'foo', dataset: 'bar', identifier: 'baz' }}
          fields={testFields}
          filters={[
            { id: 1, allColumns: false, columns: [{ target: 'foo' }] },
            { id: 2, allColumns: true, columns: null },
          ]}
          location={{ search: '?filter[1]=test&page=3' }}
        />
      );

      const countCalls = dataStoreMocks.countSql.mock.calls;
      expect(countCalls).toHaveLength(1);
      const query = countCalls[0][0];
      expect(query.offset).toBe(60);
    });

    it('updates URL params after filtering with new props', () => {
      const historyMock = { push: jest.fn() };
      const wrapper = shallow(
        <CKANRegistryDisplay

          fields={testFields}
          filters={[
            { id: 1, allColumns: false, columns: [{ target: 'foo' }] },
            { id: 2, allColumns: true, columns: null },
          ]}
          location={{ pathname: 'path', search: '' }}
          spec={{ endpoint: 'foo', dataset: 'dataset', identifier: 'baz' }}
          history={historyMock}
        />
      );

      wrapper.setState({
        currentPage: 5,
        filterValues: { dataset_1: 'test' },
        sort: { sortField: 'bar', sortAscending: false },
      });

      const historyCalls = historyMock.push.mock.calls;
      expect(historyCalls).toHaveLength(2); // 1 on mount & 1 after `setState`.
      expect(historyCalls[1][0]).toBe('path?sort=bar&sortdirection=DESC&page=5&filter%5B1%5D=test');
    });
  });

  describe('render()', () => {
    it('renders message when no resource is specified', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          location={{ search: '' }}
        />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.html()).toContain('There are no columns');
    });

    it('returns a Redirect when switching pages', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay spec={{ identifier: 'something' }} />,
        { disableLifecycleMethods: true }
      );

      wrapper.setState({ selectedRow: 123 });
      expect(wrapper.find(Redirect).length).toBe(1);
    });
  });

  describe('renderDownloadLink()', () => {
    it('does not render the link when spec endpoint is missing', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay spec={{ identifier: 'something' }} />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.find('.ckan-registry__export')).toHaveLength(0);
    });

    it('does not render the link when spec identifier is missing', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay spec={{ endpoint: 'something' }} />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.find('.ckan-registry__export')).toHaveLength(0);
    });

    it('does not render the link when config is not valid', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay fields={[]} spec={{ identifier: 'something' }} />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.find('.ckan-registry__export')).toHaveLength(0);
    });

    it('renders a download link', () => {
      const wrapper = shallow(
        <CKANRegistryDisplay
          fields={testFields}
          spec={{ endpoint: 'foo', identifier: 'something' }}
        />,
        { disableLifecycleMethods: true }
      );

      expect(wrapper.find('.ckan-registry__export')).toHaveLength(1);
    });
  });
});

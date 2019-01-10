/* global jest, describe, it, expect */
jest.mock('lib/CKANApi');

import React from 'react';
import {
  Component as CKANPresentedOptions,
  SELECT_TYPE_ALL,
  SELECT_TYPE_CUSTOM
} from '../CKANPresentedOptionsField';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4/build/index';
import CKANApi from 'lib/CKANApi';

Enzyme.configure({ adapter: new Adapter() });

const dataProps = {
  endpoint: 'https://ckan.example.com',
  resource: '34a3653b-64cb-4997-8714-dd5149eda5af',
  selectTypes: [{
    value: SELECT_TYPE_ALL,
    title: 'All',
  }, {
    value: SELECT_TYPE_CUSTOM,
    title: 'Custom',
  }],
  selectTypeDefault: SELECT_TYPE_ALL,
};
const LoadingComponent = 'div';

const prepCKANApiMock = (options = null) => {
  CKANApi.mockClear();
  CKANApi.loadDatastore.mockReturnValueOnce({
    search(fieldArray) {
      let records = options;

      if (!Array.isArray(records)) {
        records = [
          `${fieldArray[0]}: Option A`,
          `${fieldArray[0]}: Option B`,
          `${fieldArray[0]}: Option C`,
        ];
      }

      return Promise.resolve({
        records: records.map(record => ({ [fieldArray[0]]: record })),
        total: records.length
      });
    }
  });
};

describe('CKANPresentedOptionsField', () => {
  it('should render given select options', () => {
    const props = { data: {
        ...dataProps,
        selectTypes: [{
          value: SELECT_TYPE_ALL,
          title: 'Option A',
        }, {
          value: SELECT_TYPE_CUSTOM,
          title: 'Option B',
        }]
    } };

    const component = shallow(
      <CKANPresentedOptions LoadingComponent={LoadingComponent} {...props} />
    );

    const options = component.find('.ckan-presented-options__option-group');
    expect(options).toHaveLength(2);
    expect(options.at(0).render().text()).toBe('Option A');
    expect(options.at(1).render().text()).toBe('Option B');
  });

  it('should allow specifying a default select type', () => {
    const props = { data: {
        ...dataProps,
        selectTypeDefault: SELECT_TYPE_CUSTOM,
    } };

    const component = shallow(
      <CKANPresentedOptions LoadingComponent={LoadingComponent} {...props} />
    );

    const options = component.find('.ckan-presented-options__option-group');
    expect(options).toHaveLength(2);
    const secondOption = options.at(1).render();
    expect(secondOption.find('input').val()).toBe(SELECT_TYPE_CUSTOM);
    expect(secondOption.find(':checked')).toHaveLength(1);
  });

  describe('with SELECT_TYPE_ALL option selected', () => {
    const props = { data: dataProps };
    const component = shallow(
      <CKANPresentedOptions LoadingComponent={LoadingComponent} {...props} />
    );

    it('should show the checkbox list', () => {
      expect(component.find('.ckan-presented-options__options-list')).toHaveLength(1);
    });

    it('should show the separator component', () => {
      expect(component.find('.ckan-presented-options__option-separator')).toHaveLength(1);
    });

    it('should have a message indicating columns need to be specified', () => {
      expect(component.find('.ckan-presented-options__options-list input')).toHaveLength(0);
      expect(component.find('.ckan-presented-options__options-list').html()).toContain(
        'Please select columns to be able to select from all options'
      );
    });

    it('should have an empty delimiter field', () => {
      const separatorInput = component
        .find('.ckan-presented-options__option-separator')
        .render()
        .find('input');

      expect(separatorInput).toHaveLength(1);
      expect(separatorInput.val()).toHaveLength(0);
    });
  });

  describe('with SELECT_TYPE_CUSTOM option selected', () => {
    const props = { data: {
        ...dataProps,
        selectTypeDefault: SELECT_TYPE_CUSTOM,
    } };
    const component = shallow(
      <CKANPresentedOptions LoadingComponent={LoadingComponent} {...props} />
    );

    it('should show a text area', () => {
      const manualOptionsArea = component.find('.ckan-presented-options__manual-options');
      expect(manualOptionsArea).toHaveLength(1);
      expect(manualOptionsArea.render().is('textarea')).toBe(true);
    });
  });

  describe('when provided CKAN fields', () => {
    it('should load options from CKAN when given a single field', () => {
      prepCKANApiMock();
      const props = { data: dataProps, selectedFields: ['Test Field'] };

      const component = mount(
        <CKANPresentedOptions LoadingComponent={LoadingComponent} {...props} />
      );

      return new Promise(resolve => setImmediate(resolve))
        .then(() => component.update())
        .then(() => {
          const checkboxes = component.find('.ckan-presented-options__options-list input');
          [
            'Test Field: Option A',
            'Test Field: Option B',
            'Test Field: Option C',
          ].forEach((value, index) => {
            expect(checkboxes.at(index).render().val()).toBe(value);
          });
        });
    });

    it('should load options from CKAN for multiple fields', () => {
      prepCKANApiMock();
      prepCKANApiMock(['alternate option']);
      const props = { data: dataProps, selectedFields: ['Test Field', 'Other Field'] };

      const component = mount(
        <CKANPresentedOptions LoadingComponent={LoadingComponent} {...props} />
      );

      return new Promise(resolve => setImmediate(resolve))
        .then(() => component.update())
        .then(() => {
          const checkboxes = component.find('.ckan-presented-options__options-list input');
          [
            'Test Field: Option A',
            'Test Field: Option B',
            'Test Field: Option C',
            'alternate option',
          ].forEach((value, index) => {
            expect(checkboxes.at(index).render().val()).toBe(value);
          });
        });
    });

    it('should have auto-checked options when loaded (with no field value)', () => {
      prepCKANApiMock();
      const props = { data: dataProps, selectedFields: ['Test Field'] };

      const component = mount(
        <CKANPresentedOptions LoadingComponent={LoadingComponent} {...props} />
      );

      return new Promise(resolve => setImmediate(resolve))
        .then(() => {
          expect(component.state('selections')).toEqual([
            'Test Field: Option A',
            'Test Field: Option B',
            'Test Field: Option C',
          ]);
        });
    });

    it('should clean up the options provided by CKAN if they have weird whitespace', () => {
      prepCKANApiMock([
        'option\t1   ',
        '  \n\rop\ttion       2 \t\n',
        'o p  tion   3',
        'c comes before o',
      ]);
      const props = { data: dataProps, selectedFields: ['Test Field'] };

      const component = mount(
        <CKANPresentedOptions LoadingComponent={LoadingComponent} {...props} />
      );

      return new Promise(resolve => setImmediate(resolve))
        .then(() => component.update())
        .then(() => {
          const checkboxes = component.find('.ckan-presented-options__options-list input');
          [
            'c comes before o',
            'o p tion 3',
            'op tion 2',
            'option 1',
          ].forEach((value, index) => {
            expect(checkboxes.at(index).render().val()).toBe(value);
          });
        });
    });
  });

  describe('using the delimiter component', () => {
    // Prep a bunch of interesting options for the CKAN API to return
    prepCKANApiMock([
      'one',
      'two',
      ' three   ',
      'one*two',
      'one *three',
      'two*four',
      'twenty seven*five',
      'thirty\n\r\teight',
      'eighty\n\r\tthree*five',
      '',
      'six*',
      'seven***one',
    ]);

    const props = { data: dataProps, selectedFields: ['Test Field'] };
    const component = mount(
      <CKANPresentedOptions LoadingComponent={LoadingComponent} {...props} />
    );

    it('should allow typing into the delimiter field', () => {
      component.instance().handleDelimiterChange({ target: { value: '*' } });

      return new Promise(resolve => setImmediate(resolve))
        .then(() => {
          expect(component.state('separatorDelimiter')).toBe('*');
        });
    });

    it('should split and clean options when the button is clicked', () => {
      component.setState({
        separatorDelimiter: '*',
      });

      return new Promise(resolve => setImmediate(resolve))
        .then(() => {
          component.instance().handleExecuteSeparator();

          expect(component.state('suggestedOptions')).toEqual([
            'eighty three',
            'five',
            'four',
            'one',
            'seven',
            'six',
            'thirty eight',
            'three',
            'twenty seven',
            'two',
          ]);
        });
    });
  });
});

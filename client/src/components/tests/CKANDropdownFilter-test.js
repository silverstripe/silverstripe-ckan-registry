import React from 'react';
import CKANDropdownFilter from '../CKANDropdownFilter';
import { render } from '@testing-library/react';

test('Something ', () => {
  const { container } = render(
    <CKANDropdownFilter {...{
      id: '123',
      selections: ['foo']
    }}
    />
  );
  expect(container.querySelectorAll('select')).toHaveLength(1);
});

// describe('CKANDropdownFilter', () => {
//   describe('render()', () => {
//     it('renders a select', () => {
//       const wrapper = mount(
//         <CKANDropdownFilter
//         />
//       );

//       expect(wrapper.find('select').length).toBe(1);
//     });

//     it('renders the provided selections as options and a blank first option', () => {
//       const wrapper = mount(
//         <CKANDropdownFilter
//           id="123"
//           selections={['foo', 'bar', 'baz']}
//         />
//       );

//       expect(wrapper.find('option').length).toBe(4);
//       expect(wrapper.find('option').first().text()).toBe('');
//     });

//     it('renders a label for the select field when provided', () => {
//       const wrapper = mount(
//         <CKANDropdownFilter
//           id="123"
//           label="Search things"
//           selections={['foo']}
//         />
//       );

//       expect(wrapper.find('label').length).toBe(1);
//       expect(wrapper.find('label').text()).toContain('Search things');
//     });

//     it('adds the provided extraClass values', () => {
//       const wrapper = mount(
//         <CKANDropdownFilter
//           id="123"
//           extraClass="foo bar baz"
//           selections={['foo']}
//         />
//       );

//       expect(wrapper.find('div.foo.bar.baz').length).toBe(1);
//     });
//   });
// });

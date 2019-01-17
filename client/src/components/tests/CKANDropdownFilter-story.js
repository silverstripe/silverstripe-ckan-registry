import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import CKANDropdownFilter from '../CKANDropdownFilter';

storiesOf('CKAN Registry/Dropdown Filter', module)
  .add('With label', () => (
    <div>
      <CKANDropdownFilter
        id="1"
        columns={['topic']}
        label="Search by topic"
        selections={['Math', 'Science', 'History', 'Music']}
      />
    </div>
  ))
  .add('Without label', () => (
    <div>
      <CKANDropdownFilter
        id="2"
        allColumns
        columns={[]}
        selections={['Easy', 'Medium', 'Hard', 'Ridiculous']}
      />
    </div>
  ));

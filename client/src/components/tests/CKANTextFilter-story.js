import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import CKANTextFilter from '../CKANTextFilter';

storiesOf('CKAN Registry/Text Filter', module)
  .add('With label', () => (
    <div>
      <CKANTextFilter
        id="1"
        columns={['topic', 'organisation']}
        label="Search by topic or organisation"
      />
    </div>
  ))
  .add('Without label', () => (
    <div>
      <CKANTextFilter
        id="2"
        columns={[]}
      />
    </div>
  ));

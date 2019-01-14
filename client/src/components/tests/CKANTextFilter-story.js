import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import CKANTextFilter from '../CKANTextFilter';

storiesOf('CKAN Registry/Text Filter', module)
  .add('All columns', () => (
    <div>
      <CKANTextFilter
        id="1"
        columns={[]}
        label="Search all fields"
      />
    </div>
  ))
  .add('One column', () => (
    <div>
      <CKANTextFilter
        id="2"
        columns={['topic']}
        label="Search by topic"
      />
    </div>
  ))
  .add('Two columns', () => (
    <div>
      <CKANTextFilter
        id="3"
        columns={['topic', 'organisation']}
        label="Search by topic or organisation"
      />
    </div>
  ))
  .add('Three columns', () => (
    <div>
      <CKANTextFilter
        id="4"
        columns={['topic', 'organisation', 'department']}
        label="Search by topic, organisation, or department"
      />
    </div>
  ));

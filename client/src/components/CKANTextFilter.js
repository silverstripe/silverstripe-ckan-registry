import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormGroup, Input, Label } from 'reactstrap';

/**
 * A text filter is used to filter a CKAN dataset by a specified text string
 * against the columns that
 */
const CKANTextFilter = ({ columns, extraClass, id, label, onChange }) => {
  const classes = classnames(extraClass, 'form-group', 'ckan-registry__text-filter');
  const inputId = `TextFilter_${id}_Search`;
  const handleChange = event => onChange(event.target.value);

  return (
    <FormGroup className={classes}>
      { label && <Label for={inputId}>{label}</Label> }

      <Input
        id={inputId}
        type="text"
        name={`TextFilter[${id}][Search]`}
        onChange={handleChange}
      />

      <Input
        type="hidden"
        name={`TextFilter[${id}][Columns]`}
        value={JSON.stringify(columns)}
      />
    </FormGroup>
  );
};

CKANTextFilter.propTypes = {
  id: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string),
  extraClass: PropTypes.string,
  label: PropTypes.string,
};

CKANTextFilter.defaultProps = {
  columns: [],
  extraClass: '',
  label: '',
};

export default CKANTextFilter;

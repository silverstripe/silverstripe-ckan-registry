import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormGroup, Input, Label } from 'reactstrap';

/**
 * A dropdown filter is used to filter a CKAN dataset by a specific column, using
 * the selected value from the dropdown filter.
 *
 * E.g. "filter 'school_name' by the selected value"
 */
const CKANDropdownFilter = ({
  extraClass,
  id,
  label,
  selections,
  onChange,
  value,
}) => {
  const classes = classnames(extraClass, 'form-group', 'ckan-registry__dropdown-filter');
  const inputId = `DropdownFilter_${id}_Search`;
  const handleChange = event => onChange(event.target.value);

  return (
    <FormGroup className={classes}>
      { label && <Label for={inputId}>{label}</Label> }

      <Input
        id={inputId}
        type="select"
        value={value}
        name={`DropdownFilter[${id}][Search]`}
        onChange={handleChange}
      >
        <option />
        { selections.map(selection => <option key={selection}>{selection}</option>) }
      </Input>
    </FormGroup>
  );
};

CKANDropdownFilter.propTypes = {
  id: PropTypes.string.isRequired,
  selections: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  extraClass: PropTypes.string,
  label: PropTypes.string,
};

CKANDropdownFilter.defaultProps = {
  allColumns: false,
  columns: [],
  extraClass: '',
  label: '',
};

export default CKANDropdownFilter;

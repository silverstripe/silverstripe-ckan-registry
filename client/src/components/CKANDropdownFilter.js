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
  allColumns,
  columns,
  extraClass,
  id,
  label,
  selections,
  onChange
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
        name={`DropdownFilter[${id}][Search]`}
        onChange={handleChange}
      >
        { selections.map(value => <option key={value}>{ value }</option>) }
      </Input>

      <Input
        type="hidden"
        name={`DropdownFilter[${id}][Columns]`}
        value={JSON.stringify(columns)}
      />
      <Input
        type="hidden"
        name={`DropdownFilter[${id}][AllColumns]`}
        value={allColumns ? 1 : 0}
      />
    </FormGroup>
  );
};

CKANDropdownFilter.propTypes = {
  id: PropTypes.string.isRequired,
  selections: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  allColumns: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.string),
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

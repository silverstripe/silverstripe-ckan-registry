import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormGroup, Input, Label } from 'reactstrap';

/**
 * A text filter is used to filter a CKAN dataset by a specified text string
 * against the columns that
 */
const CKANTextFilter = ({ extraClass, id, label, onChange, value }) => {
  const classes = classnames(extraClass, 'form-group', 'ckan-registry__text-filter');
  const inputId = `TextFilter_${id}_Search`;
  const handleChange = event => onChange(event.target.value);

  return (
    <FormGroup className={classes}>
      { label && <Label for={inputId}>{label}</Label> }

      <Input
        id={inputId}
        value={value}
        type="text"
        name={`TextFilter[${id}][Search]`}
        onChange={handleChange}
      />
    </FormGroup>
  );
};

CKANTextFilter.propTypes = {
  id: PropTypes.string.isRequired,
  extraClass: PropTypes.string,
  label: PropTypes.string,
};

CKANTextFilter.defaultProps = {
  columns: [],
  extraClass: '',
  label: '',
};

export default CKANTextFilter;

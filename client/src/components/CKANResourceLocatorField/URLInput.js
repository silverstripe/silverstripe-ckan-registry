import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { Input } from 'reactstrap';
import classNames from 'classnames';

/**
 * A very thin wrapper around an input to add the fieldHolder HOC. Using it in-line can cause
 * strange re-render logic that forces the input field to lose focus.
 */
class URLInput extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle changes of the Input field
   *
   * @param event
   */
  handleChange(event) {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(event);
    }
  }

  /**
   * Render this component
   *
   * @returns {Input}
   */
  render() {
    const { className, invalid, value } = this.props;
    const props = {
      className: classNames(
        className,
        { 'is-invalid': invalid }
      ),
      value,
      type: 'text',
      onChange: this.handleChange,
    };

    return <Input {...props} />;
  }
}

URLInput.propTypes = {
  // The initial value of this field
  value: PropTypes.string,
  // If this field should have an invalid state
  invalid: PropTypes.bool,
  // Additional class names for this field
  className: PropTypes.oneOf([PropTypes.string, PropTypes.array, PropTypes.object]),
  // A handler for changes of this field.
  onChange: PropTypes.func,
};

URLInput.defaultProps = {
  value: '',
  invalid: false,
};

export default fieldHolder(URLInput);

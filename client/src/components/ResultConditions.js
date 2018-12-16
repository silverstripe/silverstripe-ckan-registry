import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import { Row, Col } from 'reactstrap';
import fieldHolder from 'components/FieldHolder/FieldHolder';

/**
 * Result conditions allow a CMS user to set one condition for displaying the column if the contents
 * of it match or do not match a given string.
 */
class ResultConditions extends Component {
  constructor(props) {
    super(props);

    const value = props.value || {};

    // Set initial state values
    this.state = {
      [this.getFieldName('match-select', props)]: value['match-select'] || 1,
      [this.getFieldName('match-text', props)]: value['match-text'] || '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Returns the namespaced form field name for the given field
   *
   * @param {string} fieldName
   * @param {object} props If provided, will be used instead of this.props
   * @returns {string}
   */
  getFieldName(fieldName, props = {}) {
    const name = props.name || this.props.name;
    return `${name}-${fieldName}`;
  }

  /**
   * Gets the current value of the "must match" select
   *
   * @returns {string}
   */
  getSelectValue() {
    return this.state[this.getFieldName('match-select')];
  }

  /**
   * Gets the current value of the filter condition text input
   *
   * @returns {string}
   */
  getInputValue() {
    return this.state[this.getFieldName('match-text')];
  }

  /**
   * Gets a copy of the state, used to store in the hidden input field
   *
   * @returns {object}
   */
  getValue() {
    return {
      'match-select': this.getSelectValue(),
      'match-text': this.getInputValue(),
    };
  }

  /**
   * Handles changes in the form fields which are then serialised into a hidden input field
   *
   * @param {object} event
   */
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  /**
   * Renders the select dropdown to choose whether the filter text should or should not match
   *
   * @returns {SelectComponent}
   */
  renderSelect() {
    const { SelectComponent, data: { source } } = this.props;

    return (
      <SelectComponent
        className={[
          'no-change-track',
          'ckan-result-conditions__match-select',
        ]}
        name={this.getFieldName('match-select')}
        source={source}
        value={this.getSelectValue()}
        onChange={this.handleChange}
      />
    );
  }

  /**
   * Renders the text input field to enter the string that should or should not be matched
   *
   * @returns {TextField}
   */
  renderTextInput() {
    const { TextField } = this.props;

    return (
      <TextField
        name={this.getFieldName('match-text')}
        className={[
          'no-change-track',
          'ckan-result-conditions__match-text',
        ]}
        onChange={this.handleChange}
        value={this.getInputValue()}
      />
    );
  }

  /**
   * Renders a hidden input containing a JSON serialised set of values for this field
   *
   * @returns {DOMElement}
   */
  renderHiddenInput() {
    const { name } = this.props;

    return (
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(this.getValue())}
      />
    );
  }

  render() {
    return (
      <div className="ckan-result-conditions">
        <Row form>
          <Col md={4} className="ckan-result-conditions__column-left">
            { this.renderSelect() }
          </Col>
          <Col md={8} className="ckan-result-conditions__column-right">
            { this.renderTextInput() }
          </Col>
        </Row>
        { this.renderHiddenInput() }
      </div>
    );
  }
}

export { ResultConditions as Component };

ResultConditions.propTypes = {
  name: PropTypes.string,
  value: PropTypes.object,
  TextField: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
  SelectComponent: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
};

ResultConditions.defaultProps = {
  value: {},
};

export default fieldHolder(inject(
  ['SingleSelectField', 'TextField'],
  (SelectComponent, TextField) => ({
    SelectComponent,
    TextField,
  }),
  () => 'CKAN.Column.ResultConditions'
)(ResultConditions));

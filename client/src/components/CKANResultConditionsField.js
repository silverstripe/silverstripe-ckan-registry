import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import { Row, Col } from 'reactstrap';
import fieldHolder from 'components/FieldHolder/FieldHolder';

/**
 * Result conditions allow a CMS user to set one condition for displaying the column if the contents
 * of it match or do not match a given string.
 *
 * Note that the state structure is designed for compatibility with a future version which supports
 * multiple conditions to be stored in the state and field value. In the interim, values are stored
 * as a specific object index.
 */
class CKANResultConditionsField extends Component {
  constructor(props) {
    super(props);

    const value = props.value && props.value[0] ? props.value[0] : {
      'match-select': props.data.matchTypeDefault,
      'match-text': '',
    };

    // Set initial state values
    this.state = {
      0: {
        [this.getFieldName('match-select', props)]: value['match-select'],
        [this.getFieldName('match-text', props)]: value['match-text'],
      },
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
    return `${this.state[0][this.getFieldName('match-select')]}`;
  }

  /**
   * Gets the current value of the filter condition text input
   *
   * @returns {string}
   */
  getInputValue() {
    return this.state[0][this.getFieldName('match-text')];
  }

  /**
   * Gets a copy of the state, used to store in the hidden input field
   *
   * @returns {object}
   */
  getValue() {
    return {
      0: {
        'match-select': this.getSelectValue(),
        'match-text': this.getInputValue(),
      },
    };
  }

  /**
   * Handles changes in the form fields which are then serialised into a hidden input field
   *
   * @param {object} event
   */
  handleChange(event) {
    const currentState = this.state;

    this.setState({
      0: {
        ...currentState[0],
        [event.target.name]: event.target.value,
      },
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
   * @returns {TextFieldComponent}
   */
  renderTextInput() {
    const { TextFieldComponent } = this.props;

    return (
      <TextFieldComponent
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
   * @returns {HTMLElement}
   */
  renderHiddenInput() {
    const { name } = this.props;

    const rawValue = this.getValue();
    const value = rawValue[0]['match-text'].length ? JSON.stringify(rawValue) : '';

    return (
      <input
        type="hidden"
        name={name}
        value={value}
      />
    );
  }

  /**
   * Render a simple <p> tag for read only mode
   *
   * @returns {HTMLElement|null}
   */
  renderReadOnly() {
    const { data: { source } } = this.props;
    const input = this.getInputValue();
    const type = source.find(candidate => `${candidate.value}` === this.getSelectValue());

    if (!type) {
      return null;
    }

    return <p className="form-control-static readonly">{type.title}: {input}</p>;
  }

  render() {
    if (this.props.readOnly) {
      return this.renderReadOnly();
    }

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

CKANResultConditionsField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.object,
  data: PropTypes.shape({
    source: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      title: PropTypes.string,
    })),
    matchTypeDefault: PropTypes.string,
  }),
  readOnly: PropTypes.bool,
  TextFieldComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]).isRequired,
  SelectComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
};

CKANResultConditionsField.defaultProps = {
  value: {},
  data: {},
  readOnly: false,
};

export { CKANResultConditionsField as Component };

export default fieldHolder(inject(
  ['SingleSelectField', 'TextField'],
  (SelectComponent, TextFieldComponent) => ({
    SelectComponent,
    TextFieldComponent,
  }),
  () => 'CKAN.Column.ResultConditionsField'
)(CKANResultConditionsField));

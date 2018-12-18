import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import { FormGroup, Input, Label } from 'reactstrap';
import fieldHolder from 'components/FieldHolder/FieldHolder';

/**
 * "Presented options" are a either a selection of checkboxes, or a free text input field
 * for the user to define a list of the presented options that will be applied for a given
 * dropdown filter in the CMS.
 *
 * If using a checkbox set, the user can adjust the default delimiter field.
 */
class PresentedOptions extends Component {
  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      custom_options: '',
      select_type: props.selectTypeDefault,
      selections: {},
      ...value,
    };

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectTypeChange = this.handleSelectTypeChange.bind(this);
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
   * Returns the value for the text input from the state
   *
   * @returns {string}
   */
  getInputValue() {
    return this.state.custom_options;
  }

  /**
   * Returns the select type selection, either from the state or from the default value in props
   *
   * @returns {string}
   */
  getSelectType() {
    if (typeof this.state.select_type !== 'undefined') {
      return String(this.state.select_type);
    }
    return String(this.props.data.selectTypeDefault);
  }

  /**
   * Register that a checkbox (presented option selection) has either been selected or not in
   * the state. When unchecking we remove it from the state entirely so it won't end up getting
   * serialised and stored.
   *
   * @param {object} event
   */
  handleCheckboxChange(event) {
    const prevState = this.state;
    const isAlreadyChecked = prevState.selections[event.target.value] || 0;

    this.setState({
      selections: {
        ...prevState.selections,
        [event.target.value]: isAlreadyChecked ? undefined : true,
      },
    });
  }

  /**
   * Sets the current entered value of the freetext textarea for custom options into the state
   *
   * @param {object} event
   */
  handleInputChange(event) {
    this.setState({
      custom_options: event.target.value,
    });
  }

  /**
   * Save a change in the select type (from all, or custom entry) to the state
   *
   * @param {object} event
   */
  handleSelectTypeChange(event) {
    this.setState({
      select_type: event.target.value,
    });
  }

  /**
   * Check the state and determine whether a given checkbox value should be checked
   *
   * @param {string} value
   * @returns {boolean}
   */
  isCheckboxChecked(value) {
    return !!this.state.selections[value] || 0;
  }

  /**
   * Renders a textarea where the CMS user can manually enter a list of options to
   * use, one per line
   *
   * @returns {Input}
   */
  renderFreetextInput() {
    // Don't render the free text input field unless we've chosen to specify a custom list
    // todo: can we move the value into a constant somewhere? It's already defined in PHP...
    if (this.getSelectType() !== '1') {
      return;
    }

    return (
      <Input
        type="textarea"
        name={this.getFieldName('options-custom')}
        onChange={this.handleInputChange}
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
        value={JSON.stringify(this.state)}
      />
    );
  }

  /**
   * Renders a list of checkbox fields for the CMS user to select which options to use
   *
   * @returns {DOMElement}
   */
  renderCheckboxList() {
    // Don't render the checkbox list unless we've chosen to select from a list of options
    // todo: can we move the value into a constant somewhere? It's already defined in PHP...
    if (this.getSelectType() !== '0') {
      return;
    }

    const { data: { options } } = this.props;
    const fieldName = this.getFieldName('options');

    return (
      <fieldset className="ckan-presented-options__options-list">
        {
          options.map((option, index) => (
            <FormGroup key={option} className="ckan-presented-options__option-group">
              <Input
                id={`${fieldName}-${index}`}
                type="checkbox"
                name={`${fieldName}[]`}
                onChange={this.handleCheckboxChange}
                checked={this.isCheckboxChecked(option)}
                value={option}
              />
              <Label for={`${fieldName}-${index}`}>
                { option }
              </Label>
            </FormGroup>
          ))
        }
      </fieldset>
    );
  }

  /**
   * Renders a chose for either "select all options" or "manually select options" in a radio
   * input group
   *
   * @returns {FormGroup[]}
   */
  renderRadioOptions() {
    const { data: { selectTypes } } = this.props;
    const selectedValue = this.getSelectType();

    return selectTypes.map((option) => (
      <FormGroup key={option.value} className="ckan-presented-options__option-group">
        <Input
          id={`option-${option.value}`}
          type="radio"
          name={this.getFieldName('select-type')}
          value={option.value}
          onChange={this.handleSelectTypeChange}
          checked={selectedValue === String(option.value)}
        />
        <Label for={`option-${option.value}`} check>
          {option.title}
        </Label>
      </FormGroup>
    ));
  }

  render() {
    const { extraClass } = this.props;

    return (
      <div className={extraClass}>
        { this.renderRadioOptions() }
        { this.renderCheckboxList() }
        { this.renderFreetextInput() }
        { this.renderHiddenInput() }
      </div>
    );
  }
}

PresentedOptions.propTypes = {
  data: PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.string),
    selectTypeDefault: PropTypes.string,
    selectTypes: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      title: PropTypes.string,
    })),
  }),
  extraClass: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.object,
  TextFieldComponent: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.func
  ]).isRequired,
  FormActionComponent: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.func
  ]).isRequired,
};

PresentedOptions.defaultProps = {
  data: {},
  extraClass: '',
  value: {},
};

export { PresentedOptions as Component };

export default fieldHolder(inject(
  ['TextField', 'FormAction'],
  (TextFieldComponent, FormActionComponent) => ({
    TextFieldComponent,
    FormActionComponent,
  }),
  () => 'CKAN.Filter.PresentedOptions'
)(PresentedOptions));

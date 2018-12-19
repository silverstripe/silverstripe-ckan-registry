import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import { FormGroup, Input, Label } from 'reactstrap';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import CKANApi from 'lib/CKANApi';

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
      customOptions: '',
      selectType: props.selectTypeDefault,
      selections: {},
      suggestedOptions: [],
      suggestedOptionCache: {},
      loading: false,
      ...value,
    };

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectTypeChange = this.handleSelectTypeChange.bind(this);
  }

  componentDidMount() {
    // Ensure the suggested options are loaded
    this.loadSuggestedOptions();
  }

  componentDidUpdate(prevProps) {
    // Compare if selected fields have changed
    const newFields = this.props.selectedFields;
    const oldFields = prevProps.selectedFields;

    // If the type or length doesn't match then they must be different
    if (typeof newFields !== typeof oldFields || newFields.length !== oldFields.length) {
      this.loadSuggestedOptions();
      return;
    }

    // Otherwise filter out options that appear in both arrays and assert the remaining count is
    // zero
    if (oldFields.filter(old => !newFields.includes(old)).length === 0) {
      return;
    }

    this.loadSuggestedOptions();
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
    return this.state.customOptions;
  }

  /**
   * Returns the select type selection, either from the state or from the default value in props
   *
   * @returns {string}
   */
  getSelectType() {
    if (typeof this.state.selectType !== 'undefined') {
      return String(this.state.selectType);
    }
    return String(this.props.data.selectTypeDefault);
  }

  loadSuggestedOptions() {
    const { selectedFields, data: { endpoint, resource } } = this.props;

    // Clear the state of suggested options...
    this.setState({
      suggestedOptions: [],
      loading: false,
    });

    // If there's no columns selected we can early return
    if (!selectedFields.length) {
      return;
    }

    let options = [];
    const { suggestedOptionCache } = this.state;
    const loadPromises = [];

    // Prep a datastore. Not that this doesn't actually fire any requests yet.
    const Datastore = CKANApi.loadDatastore(endpoint, resource);

    // We'll loop through the selected columns an check if we've loaded values for fields previously
    selectedFields.forEach(field => {
      // Check the cache
      if (suggestedOptionCache[field]) {
        options = options.concat(suggestedOptionCache[field]);
        return;
      }

      // Start loading and append the promise to an array so we can wait for all of them...
      loadPromises.push(
        Datastore.search([field], null, true).then(result => {
          let newOptions = [];

          // TODO implement something for if the request fails...
          if (result) {
            newOptions = result.records.map(record => record[field]);
          }

          // Update the "cache" with the options we've loaded.
          this.setState(state => ({
            suggestedOptionCache: {
              // We can't use the local variable as the state may have been mutated while this
              // promise was resolving...
              ...state.suggestedOptionCache,
              [field]: newOptions,
            },
          }));

          // Wait for any other suggested options to load from CKAN
          // TODO this is _not_ a robust method of doing this. Preferably we can wait for all the
          // promises to complete - or chain the promises. Note that the user has to be pretty quick
          // to choose two new columns and beat the snappy response from CKAN. Perhaps we can
          // disable the select while this updates?
          setTimeout(() => { this.loadSuggestedOptions(); }, 1000);
        })
      );
    });

    // If we didn't have to load options then we can just put the known options into state
    if (!loadPromises.length) {
      this.setState({
        // Unique and sort the options...
        suggestedOptions: options.filter((item, index) => options.indexOf(item) === index).sort(),
        loading: false,
      });
      return;
    }

    // Mark as loading
    this.setState({
      loading: true,
    });

    // We have to wait for all promises and then just run this function again...
    // Promise.all(loadPromises).then(() => this.loadSuggestedOptions());
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
      customOptions: event.target.value,
    });
  }

  /**
   * Save a change in the select type (from all, or custom entry) to the state
   *
   * @param {object} event
   */
  handleSelectTypeChange(event) {
    this.setState({
      selectType: event.target.value,
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
   * @returns {Input|null}
   */
  renderFreetextInput() {
    // Don't render the free text input field unless we've chosen to specify a custom list
    // todo: can we move the value into a constant somewhere? It's already defined in PHP...
    if (this.getSelectType() !== '1') {
      return null;
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
   * @returns {DOMElement|null}
   */
  renderCheckboxList() {
    // Don't render the checkbox list unless we've chosen to select from a list of options
    // todo: can we move the value into a constant somewhere? It's already defined in PHP...
    if (this.getSelectType() !== '0') {
      return null;
    }

    const fieldName = this.getFieldName('options');
    const { LoadingComponent } = this.props;
    const { loading, suggestedOptions } = this.state;

    return (
      <fieldset className="ckan-presented-options__options-list">
        {
          loading ? <LoadingComponent /> :
          suggestedOptions.map((option, index) => (
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
  // A list of CKAN fields (aka columns) that this options field will be targeting
  selectedFields: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.shape({
    // The CKAN endpoint that this field is suggestion options for
    endpoint: PropTypes.string.isRequired,
    // The CKAN resource that this field is suggestion options for
    resource: PropTypes.string.isRequired,
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
    PropTypes.string,
    PropTypes.func
  ]).isRequired,
  FormActionComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]).isRequired,
  LoadingComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]).isRequired
};

PresentedOptions.defaultProps = {
  data: {},
  extraClass: '',
  selectedFields: [],
  value: {},
};

export { PresentedOptions as Component };

export default fieldHolder(inject(
  ['TextField', 'FormAction', 'Loading'],
  (TextFieldComponent, FormActionComponent, LoadingComponent) => ({
    TextFieldComponent,
    FormActionComponent,
    LoadingComponent,
  }),
  () => 'CKAN.Filter.PresentedOptions'
)(PresentedOptions));

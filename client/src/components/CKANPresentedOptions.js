import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import {
  Button, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row, Col
} from 'reactstrap';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import CKANApi from 'lib/CKANApi';
import i18n from 'i18n';


/**
 * This is shared with the server side definition of "select types"
 *
 * @var int
 */
const SELECT_TYPE_ALL = '0';

/**
 * @var int
 */
const SELECT_TYPE_CUSTOM = '1';

/**
 * "Presented options" are a either a selection of checkboxes, or a free text input field
 * for the user to define a list of the presented options that will be applied for a given
 * dropdown filter in the CMS.
 *
 * If using a checkbox set, the user can adjust the default delimiter field.
 */
class CKANPresentedOptions extends Component {
  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      customOptions: [],
      selectType: props.selectTypeDefault,
      selections: {},
      suggestedOptions: [],
      suggestedOptionCache: {},
      loading: false,
      fetchFailure: false,
      separatorDelimiter: '',
      ...value,
    };

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectTypeChange = this.handleSelectTypeChange.bind(this);
    this.handleDelimiterChange = this.handleDelimiterChange.bind(this);
    this.handleExecuteSeparator = this.handleExecuteSeparator.bind(this);
    this.handleTryAgain = this.handleTryAgain.bind(this);
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
   * @returns {string}
   */
  getFieldName(fieldName) {
    return `${this.props.name}-${fieldName}`;
  }

  /**
   * Returns the value for the text input from the state
   *
   * @returns {string}
   */
  getInputValue() {
    return this.state.customOptions.join('\n');
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

  /**
   * Prompt the field to update the suggested options from the CKAN datastore
   *
   * @return {Array|null} Returns an array of options if all were loaded or null if promises have
   *                      been started
   */
  loadSuggestedOptions(resetFetchFailure = false) {
    const { selectedFields } = this.props;

    // Clear the state of suggested options...
    this.setState({
      suggestedOptions: [],
      loading: false,
    });

    if (resetFetchFailure) {
      this.setState({
        fetchFailure: false,
      });
    }

    // If there's no columns selected we can early return
    if (!selectedFields.length) {
      return [];
    }

    let options = [];
    const { suggestedOptionCache, separatorDelimiter, fetchFailure } = this.state;
    const loadPromises = [];

    // We'll loop through the selected columns an check if we've loaded values for fields previously
    selectedFields.forEach(field => {
      // Check the cache
      if (suggestedOptionCache[field]) {
        options = options.concat(suggestedOptionCache[field]);
        return;
      }

      if (!fetchFailure || resetFetchFailure) {
        // Start loading and append the promise to an array so we can wait for all of them...
        loadPromises.push(
          this.fetchOptionsForField(field)
        );
      }
    });

    // If we didn't have to load options then we can just put the known options into state
    if (!loadPromises.length) {
      options = this.splitOptionsBySeparator(options, separatorDelimiter);
      const suggestedOptions = this.prepOptions(options);

      this.setState({
        // Trim, filter nulls, unique and sort the options...
        suggestedOptions,
        loading: false,
      });

      return options;
    }

    // Mark as loading
    this.setState({
      loading: true,
    });

    // We have to wait for all promises and then just run this function again...
    Promise.all(loadPromises).then(() => this.loadSuggestedOptions());
    return null;
  }

  /**
   * Given a list of options this method will:
   * - Trim whitespace from the beginning and end of options
   * - Ensure whitespace within an option is consistent
   * - Remove empty or falsy options
   * - Ensure each option is distinct
   * - Sort the options alphabetically
   *
   * The updated list is returned.
   *
   * @param {Array} options
   * @returns {Array}
   */
  prepOptions(options) {
    return options
      .filter((item, index) => {
        // Exclude null, non-string or empty values
        if (!item || typeof item !== 'string' || item.length === 0) {
          return false;
        }
        // Exclude items that aren't unique. AKA remove if this index is not the same as the
        // index where this item is first found
        if (options.indexOf(item) !== index) {
          return false;
        }

        return true;
      })
      // Trim whitespace and convert all whitespace chunks to a single space
      .map(item => item.trim().replace(/\s+/g, ' '))
      .sort();
  }

  /**
   * Given a field fetch unique values that exist in that field in the datastore
   *
   * @param {string} field The name of the field to load options for
   * @returns {Promise}
   */
  fetchOptionsForField(field) {
    const { data: { endpoint, resource } } = this.props;

    return CKANApi.loadDatastore(endpoint, resource).search([field], null, true)
      .then(result => {
        let newOptions = [];

        newOptions = result.records.map(record => record[field]);

        // Update the "cache" with the options we've loaded.
        this.setState(state => ({
          suggestedOptionCache: {
            // We can't use the local variable as the state may have been mutated while this
            // promise was resolving...
            ...state.suggestedOptionCache,
            [field]: newOptions,
            fetchFailure: false,
          },
        }));
      })
      .catch(() => {
        this.setState(() => ({
          loading: false,
          fetchFailure: true,
        }));
      });
  }

  /**
   * Given a list of options, run through and split the options by the given separator/delimiter
   *
   * @param options
   * @param delimiter
   * @returns {*}
   */
  splitOptionsBySeparator(options, delimiter) {
    // If there are no delimiter provided then we can just return the options
    if (!delimiter || !delimiter.length) {
      return options;
    }

    // Run through the options and split based on the currently applied delimiter
    return options.reduce((accumulator, item) => accumulator.concat(item.split(delimiter)), []);
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
      // Split the text area by new lines and trim each entry
      customOptions: event.target.value.split('\n').map(value => value.trim()),
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
   * Update the delimiter that is used to split options coming from the CKAN datastore
   *
   * @param {object} event
   */
  handleDelimiterChange(event) {
    this.setState({
      separatorDelimiter: event.target.value,
    });
  }

  /**
   * Update the list of options by separating the existing ones by the inputted delimiter
   */
  handleExecuteSeparator() {
    const { separatorDelimiter } = this.state;

    // Reset the options by triggering a reload...
    const options = this.loadSuggestedOptions();

    // Resetting the options is all that's required if the current delimiter is an empty string
    if (!separatorDelimiter.length) {
      return;
    }

    // If the return value of the load is false that means there's a promise (it's loading) going on
    // We can assume that the options will be correctly split once that promise is resolved so we
    // can safely return
    if (!options) {
      return;
    }

    // Split by the new delimiter and apply cleanups
    const newOptions = this.prepOptions(this.splitOptionsBySeparator(options, separatorDelimiter));

    this.setState({
      suggestedOptions: newOptions,
    });
  }

  handleTryAgain() {
    this.loadSuggestedOptions(true);
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
    if (this.getSelectType() !== SELECT_TYPE_CUSTOM) {
      return null;
    }

    const description = i18n._t(
      'CKANPresentedOptions.MANUAL_OPTION_DESCRIPTION',
      'Options provided must match the data within the selected column. Each option should be ' +
        'placed on a new line.'
    );

    return (
      <Row>
        <Col lg={9} sm={12}>
          <Input
            type="textarea"
            className="ckan-presented-options__manual-options"
            name={this.getFieldName('options-custom')}
            onChange={this.handleInputChange}
            value={this.getInputValue()}
          />
        </Col>
        <Col lg={3} sm={12}>{ description }</Col>
      </Row>
    );
  }

  /**
   * Renders a hidden input containing a JSON serialised set of values for this field
   *
   * @returns {DOMElement}
   */
  renderHiddenInput() {
    const { name } = this.props;
    const { selections, customOptions, separatorDelimiter } = this.state;
    const value = {
      customOptions,
      selectType: this.getSelectType(),
      selections,
      separatorDelimiter,
    };

    return (
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(value)}
      />
    );
  }

  /**
   * Renders a list of checkbox fields for the CMS user to select which options to use
   *
   * @returns {DOMElement|null}
   */
  renderCheckboxList() {
    const fieldName = this.getFieldName('options');
    const { LoadingComponent } = this.props;
    const { loading, suggestedOptions } = this.state;

    const innerContent = suggestedOptions.length ?
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
      )) :
      (
        <div>
          {this.renderBadFetchMessage()}
          <span className="ckan-presented-options__options-list-empty">
            {i18n._t(
              'CKANPresentedOptions.PLEASE_SELECT_COLUMNS',
              'Please select columns to be able to select from all options'
            )}
          </span>
        </div>
      );

    return (
      <fieldset className="ckan-presented-options__options-list">
        { loading ? <LoadingComponent /> : innerContent }
      </fieldset>
    );
  }

  /**
   * Renders an input with an attached button where the CMS user can enter a delimiter that is used
   * to split the loaded options
   *
   * @returns {FormGroup}
   */
  renderSeparator() {
    return (
      <FormGroup className="ckan-presented-options__option-separator">
        <Label for="optionSeparator">Delimiter</Label>
        <InputGroup>
          <Input value={this.state.separatorDelimiter} onChange={this.handleDelimiterChange} />
          <InputGroupAddon addonType="append">
            <Button onClick={this.handleExecuteSeparator} color="primary">
              {i18n._t('CKANPresentedOptions.UPDATE', 'Update')}
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <div className="form__field-description">
          {i18n._t(
            'CKANPresentedOptions.SPLIT_OPTIONS_DESCRIPTION',
            'Split options by characters. eg. comma'
          )}
        </div>
      </FormGroup>
    );
  }

  /**
   * Render a message notifying the user that the attempt to fetch values from their selected
   * options columns has failed, and present a retry button.
   */
  renderBadFetchMessage() {
    const { data: { selectTypes } } = this.props;
    const manualAdd = selectTypes.find(type => type.value.toString() === SELECT_TYPE_CUSTOM).title;
    const { fetchFailure } = this.state;
    const fetchErrorDescription = i18n._t(
      'CKANPresentedOptions.FETCH_FAILURE',
      'There was an issue fetching the available options. '
    );
    const tryAgain = i18n._t('CKANPresentedOptions.RETRY_FETCH', 'Try again?');
    const orManuallyAdd = i18n.inject(
      i18n._t('CKANPresentedOptions.OR_MANUAL', ' Or choose to "{manualAdd}"'),
      { manualAdd }
    );

    return fetchFailure && (
      <div className="ckan-presented-options__fetch-failure alert alert-danger">
        {fetchErrorDescription}
        <a
          className="ckan-presented-options__try-again alert-link"
          onClick={this.handleTryAgain}
          role="button"
          tabIndex="0"
        >
          {tryAgain}
        </a>
        {orManuallyAdd && null}
      </div>
    );
  }

  /**
   * Renders the checkbox list and seperator in Reactstrap columns
   *
   * @return {Row}
   */
  renderCheckboxListAndSeparator() {
    // Don't render the checkbox list unless we've chosen to select from a list of options
    if (this.getSelectType() !== SELECT_TYPE_ALL) {
      return null;
    }

    return (
      <Row>
        <Col lg={9} sm={12}>{ this.renderCheckboxList() }</Col>
        <Col lg={3} sm={12}>{ this.renderSeparator() }</Col>
      </Row>
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
        <Label for={`option-${option.value}`} check>
          <Input
            id={`option-${option.value}`}
            type="radio"
            name={this.getFieldName('select-type')}
            value={option.value}
            onChange={this.handleSelectTypeChange}
            checked={selectedValue === String(option.value)}
          />
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
        { this.renderCheckboxListAndSeparator() }
        { this.renderFreetextInput() }
        { this.renderHiddenInput() }
      </div>
    );
  }
}

CKANPresentedOptions.propTypes = {
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
  // TextFieldComponent: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.func
  // ]).isRequired,
  // FormActionComponent: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.func
  // ]).isRequired,
  LoadingComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]).isRequired
};

CKANPresentedOptions.defaultProps = {
  data: {},
  extraClass: '',
  selectedFields: [],
  value: {},
};

export { CKANPresentedOptions as Component };

export default fieldHolder(inject(
  ['TextField', 'FormAction', 'Loading'],
  (TextFieldComponent, FormActionComponent, LoadingComponent) => ({
    TextFieldComponent,
    FormActionComponent,
    LoadingComponent,
  }),
  () => 'CKAN.Filter.PresentedOptions'
)(CKANPresentedOptions));

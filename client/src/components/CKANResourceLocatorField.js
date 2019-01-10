import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CKANApi from 'lib/CKANApi';
import i18n from 'i18n';
import { Input } from 'reactstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash/debounce';
import { inject } from 'lib/Injector';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import classNames from 'classnames';
import URLInput from './CKANResourceLocatorField/URLInput';

class CKANResourceLocatorField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Current value of the URL field
      uri: CKANApi.generateURI(props.value || {}) || '',
      // Current parsed CKAN resource specification and the value of this whole field
      spec: props.value || null,
      // Whether the loading indicator should show in the URL input
      validationPending: false,
      // Force an invalid message to show on the data source URL field. This is usually updated
      // after a timeout - a reference to this is held in the below `forceInvalidTimeout`
      forceInvalid: false,
      // The current dataset that's found through the given URL (containing the packages that can
      // be selected)
      currentDataset: null,
      // A reference to a `setTimeout` that will set `forceInvalid` (above) after a longer delay
      forceInvalidTimeout: null,
      // The select field had an error message, which will mean we need to hide the description
      selectError: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleResourceSelect = this.handleResourceSelect.bind(this);

    // We assign a debounced version of the validate input function as we want both a debounced
    // and a "normal" version
    this.delayedValidateInput = debounce(this.validateInput.bind(this), 500);
  }

  componentDidMount() {
    const { uri } = this.state;

    if (uri.length) {
      this.validateInput();
    }
  }

  /**
   * Indicates the URL inpit field is invalid and provides a localised message indicating the issue
   * Currently this shows a single message in cases where the field is invalid but it could be
   * expanded to provide varying messages.
   * The existence of this message implies the field is invalid.
   *
   * @returns {string|null}
   */
  getInvalidURLMessage() {
    const { currentDataset, spec, forceInvalid } = this.state;
    const message = { type: 'error' };

    // If there's no "spec" then there's no URL that looks valid yet
    // Or if there's a "currentDataset" then the field is valid
    if (!forceInvalid && (!spec || currentDataset)) {
      return null;
    }

    // Return a generic "catch all" response
    message.value = i18n._t(
      'CKANResourceLocatorField.INVALID_DATASET_URL',
      'The provided data source URL does not appear to be a valid CKAN data set.'
    );

    return message;
  }

  /**
   * Handle changes in the URL field
   *
   * @param {object} event
   */
  handleChange(event) {
    const uri = event.target.value;

    // Cancel any timeout on forcing invalid state
    clearTimeout(this.state.forceInvalidTimeout);

    this.setState({
      uri,
      forceInvalid: false,
      forceInvalidTimeout: null,
    });

    // Run the debounced validation for the URL input.
    this.delayedValidateInput();
  }

  /**
   * Handle changes with the resource select field
   *
   * @param {object} event
   * @param {string} value
   */
  handleResourceSelect(event, { value }) {
    this.setState({
      spec: {
        ...this.state.spec,
        resource: value,
      },
    });
  }

  /**
   * Validate that the URL input is valid and attempt to verify with the CKAN endpoint.
   * Once valid this method will also load the determined dataset.
   *
   * This method also has a debounced version: "delayedValidateInput"
   */
  validateInput() {
    const { uri } = this.state;
    const { defaultEndpoint } = this.props;

    // Attempt to parse the URL into it's CKAN "parts"
    const spec = CKANApi.parseURI(uri);

    // If an endpoint could not be parsed there's an optional default that can be used.
    if (spec && !spec.endpoint && defaultEndpoint) {
      spec.endpoint = defaultEndpoint;

      // If are working with a provided dataset we should also update the URI now.
      if (spec.dataset) {
        this.setState({
          uri: CKANApi.generateURI(spec),
        });
      }
    }

    // If there's no spec or _still_ no endpoint then we can't continue.
    if (!spec || !spec.endpoint) {
      this.setState({
        spec: null,
        // Show the field as invalid after an amount of time
        forceInvalidTimeout: setTimeout(() => this.setState({
          forceInvalid: true,
        }), 2000)
      });

      return;
    }

    // Otherwise we'll register the input from here as awaiting validation. This method will run
    // some asynchronous validation
    this.setState({
      validationPending: true,
    });

    // Prepare a handler for error responses from the CKAN API. This will just stop loading and
    // assume the field is invalid.
    const handleErrorResponse = () => this.setState({
      validationPending: false,
      spec: null,
      currentDataset: null,
    });

    if (spec.resource) {
      if (!spec.dataset) {
        // If we have a resource but no dataset then we can determine the dataset from the resource
        // response provided by the API.
        CKANApi.loadResource(spec.endpoint, spec.resource).then(
          resource => {
            // Create a new spec with the updated dataset
            const newSpec = {
              ...spec,
              // "package" is the word for "dataset" in CKAN apis
              dataset: resource.package_id,
            };

            // Set the new spec in the state and rewrite the value of the URL input
            this.setState({
              spec: newSpec,
              uri: CKANApi.generateURI(newSpec) || '',
            });

            // Rerun a validate so that the dataset is now loaded
            this.validateInput();
          },
          handleErrorResponse
        );

        // We're revalidating so we'll just breakout here
        return;
      }
    }

    // Now we load the dataset from the CKAN api
    CKANApi.loadDataset(spec.endpoint, spec.dataset).then(
      dataset => {
        let newUri = uri;
        if (dataset.name) {
          spec.dataset = dataset.name;
          newUri = CKANApi.generateURI(spec);
        }

        // We strip off the resource from the URL provided we have a resource and the dataset
        // is valid
        if (spec.resource && dataset) {
          newUri = newUri.substring(0, newUri.lastIndexOf('/', newUri.lastIndexOf('/') - 1));
        }
        // If we don't have a resource (but we successfully loaded a dataset) then we'll pre-select
        // a value for the user. This will just be the first datastore_active resource in the list
        if (!spec.resource && dataset) {
          const resource = dataset.resources.find(res => res.datastore_active);
          spec.resource = resource && resource.package_id;
        }

        this.setState({
          uri: newUri,
          validationPending: false,
          spec,
          currentDataset: dataset || null,
        });
      }, handleErrorResponse
    );
  }

  /**
   * Renders a select filled with resources that can be selected
   *
   * @returns {SelectComponent}
   */
  renderResourceSelect() {
    const { uri, currentDataset, spec } = this.state;
    const { SelectComponent, name } = this.props;

    // Create some props that'll be shared by the disabled input and the select component
    const sharedProps = {
      title: 'Resource name',
      extraClass: 'form-field--no-divider stacked',
    };

    // If we're not valid then we'll render just a simple disabled input in place of the select
    if (!currentDataset || !uri || !uri.length) {
      const Field = fieldHolder(Input);
      return <Field {...sharedProps} type="text" disabled />;
    }

    const unavailableMessage = i18n._t(
      'CKANResourceLocatorField.INVALID_RESOURCE_SELECTION',
      'Datastore is not available for the selected resource.'
    );

    // Parse the resources out of the current dataset into a list of options
    const resources = currentDataset.resources.map(resource => ({
      value: resource.id,
      title: resource.name || resource.description || null,
      disabled: !resource.datastore_active,
      // Support the possibility that option titles are supported by the admin component (in 1.4)
      description: !resource.datastore_active ? unavailableMessage : null,
    }));

    // Find the current resource that might be selected
    const selectedResource = resources.find(resource => resource.value === spec.resource);
    let message = null;
    // If the user has somehow selected an invalid resource (disabled option) we'll give a message
    if (selectedResource && selectedResource.disabled) {
      message = {
        type: 'error',
        value: unavailableMessage,
      };
      this.setState({
        selectError: true,
      });
    } else {
      this.setState({
        selectError: false,
      });
    }

    return (
      <SelectComponent
        {...sharedProps}
        message={message}
        className={{ 'is-invalid': message, 'no-change-track': true }}
        name={`${name}-resource-name`}
        source={resources}
        value={spec.resource}
        onChange={this.handleResourceSelect}
      />
    );
  }

  /**
   * Renders a hidden input containing the value of this field to be saved
   *
   * @returns {Input}
   */
  renderHiddenInput() {
    const { spec, validationMessage } = this.state;
    const value = !spec || validationMessage ? null : JSON.stringify(spec);

    return <Input name={this.props.name} type="hidden" value={value} />;
  }

  /**
   * Renders this field in its entirety
   *
   * @returns {DOMElement}
   */
  render() {
    const { uri, validationPending } = this.state;
    const { selectError } = this.state;

    const { description } = this.props;
    // Get any invalid message for the URL field
    const invalidMessage = this.getInvalidURLMessage();
    // And determine validity by the existance of that message
    const invalid = !!invalidMessage;

    // Props for the URLInput
    const inputProps = {
      title: i18n._t('CKANResourceLocatorField.DATA_SOURCE_URL', 'Data source URL'),
      extraClass: 'form-field--no-divider stacked',
      message: invalidMessage,
      value: uri,
      invalid,
      onChange: this.handleChange,
    };

    const inputContainerClasses = classNames('ckan-resource-locator__uri-input', {
      'ckan-resource-locator__uri-input--loading': validationPending,
    });

    return (
      <div className="ckan-resource-locator">
        <div className={inputContainerClasses}>
          <URLInput {...inputProps} />
        </div>
        <div className="ckan-resource-locator__big-slash">/</div>
        <div className="ckan-resource-locator__resource-select">
          { this.renderResourceSelect() }
        </div>
        { description && !invalidMessage && !selectError &&
          <div className="ckan-resource-locator__description">
            { description }
          </div>
        }
        { this.renderHiddenInput() }
      </div>
    );
  }
}

CKANResourceLocatorField.propTypes = {
  // The field name
  name: PropTypes.string.isRequired,
  // The value of this field - A JSON object with `endpoint`, `dataset` and `resource` keys.
  value: PropTypes.object.isRequired,
  // A default endpoint to be used in the case that the URL pasted does not provide one
  // This allows things like putting package names and resource names in the URL field
  defaultEndpoint: PropTypes.string,

  // ## Provided by Injector:
  // The component to be used for a Select DOM node
  SelectComponent: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func])
};

export default inject(
  ['SingleSelectField'],
  (SelectComponent) => ({
    SelectComponent,
  }),
  () => 'CKAN.ResourceLocatorField'
)(CKANResourceLocatorField);

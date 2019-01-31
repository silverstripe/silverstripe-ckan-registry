import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'reactstrap';
import CKANDropdownFilter from 'components/CKANDropdownFilter';
import CKANTextFilter from 'components/CKANTextFilter';

/**
 * This component represents a form of filters used to search a CKAN dataset
 */
class CKANRegistryFilterContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValues: props.defaultValues || [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  /**
   * Handle the form submission
   *
   * @param {Event} event
   */
  handleSubmit(event) {
    event.preventDefault();

    this.props.onFilter(this.state.inputValues);
  }

  /**
   * Handle a request to clear the filter form
   *
   * @param {Event} event
   */
  handleClear(event) {
    event.preventDefault();

    // Reset inputs
    this.setState({
      inputValues: [],
    });

    // Trigger an update of the table
    this.props.onFilter([]);
  }

  /**
   * Render a specific filter
   *
   * @param {Object} filter
   * @return {*}
   */
  renderFilter(filter) {
    const id = `${this.props.spec.dataset}_${filter.id}`;
    const sharedProps = {
      id,
      key: id,
      label: filter.label,
      value: this.state.inputValues[id] || '',
      onChange: input => {
        this.setState(existingState => ({ inputValues: {
          ...existingState.inputValues,
          [id]: input,
        } }));
      }
    };

    // Switch the type of filter and render the component specific to that type
    switch (filter.type) {
      case 'Dropdown':
        return <CKANDropdownFilter {...sharedProps} selections={filter.options} />;
      case 'ResourceFilter':
      default:
        return <CKANTextFilter {...sharedProps} />;
    }
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h4>Filters</h4>
        { this.props.filters.map(filter => this.renderFilter(filter)) }
        <Button color="primary">{
          window.i18n._t(
            'CKANRegistryFilterContainer.SEARCH',
            'Search'
          )
        }</Button>
        &nbsp;
        <Button color="default" onClick={this.handleClear}>{
          window.i18n._t(
            'CKANRegistryFilterContainer.CLEAR',
            'Clear'
          )
        }</Button>
      </Form>
    );
  }
}

CKANRegistryFilterContainer.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default CKANRegistryFilterContainer;

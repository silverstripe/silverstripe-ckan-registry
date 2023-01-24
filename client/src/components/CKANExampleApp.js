/* global document, window */
import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import fetch from 'isomorphic-fetch';
import CKANRegistryDisplay from 'components/CKANRegistryDisplay';
import CKANRegistryDetailView from 'components/CKANRegistryDetailView';
import 'url-search-params-polyfill';

/**
 * An example React app showing how you could build a frontend for the CKAN registry
 * on the current page.
 *
 * This app has two main components:
 *   - CKANRegistryDisplay: renders the display of the resource data and filters
 *   - CKANRegistryDetailView: renders a detailed view of the selected resource entry
 *
 * The react-router-dom package controls the routing between these components in this
 * example.
 */
class CKANExampleApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schema: null,
    };
  }

  /**
   * When the component has mounted, fetch the client schema configuration
   */
  componentDidMount() {
    const params = new URLSearchParams(window.location.search || '');
    const stage = params.has('stage') ? `?stage=${params.get('stage')}` : '';
    const schemaPath = `${window.location.pathname}/schema${stage}`;
    fetch(schemaPath)
      .then(response => response.json())
      .then(schema => this.setState({ schema }));
  }

  /**
   * Renders the content container and content components conditional on the
   * current route matching
   *
   * @returns {HTMLElement}
   */
  renderContent() {
    const { schema } = this.state;

    // Display a loading indicator while the schema is fetched
    if (schema === null) {
      return (
        <div className="ckan-registry__loading">
          { window.i18n._t('CKANRegistryDisplay.LOADING', 'Loading...') }
        </div>
      );
    }
    const { basePath } = schema;

    const passProps = {
      ...schema,
      ...this.props,
    };

    return (
      <div className="ckan-registry__content">
        <Routes>
          <Route path={basePath} element={<CKANRegistryDisplay {...passProps} />} />
          <Route path={`${basePath}/view/:item`} element={<CKANRegistryDetailView {...passProps} />} />
          <Route path={`${basePath}/view`} element={<Navigate to={basePath} replace />} />
        </Routes>
      </div>
    );
  }

  /**
   * Returns a routed/routable app with a header and a content section
   *
   * @returns {BrowserRouter}
   */
  render() {
    return (
      <BrowserRouter>
        <div className="ckan-registry">
          { this.renderContent() }
        </div>
      </BrowserRouter>
    );
  }
}

export default CKANExampleApp;

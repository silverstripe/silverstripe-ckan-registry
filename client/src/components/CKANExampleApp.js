/* global document */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import CKANRegistryDisplay from 'components/CKANRegistryDisplay';
import CKANRegistryDetailView from 'components/CKANRegistryDetailView';

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
  /**
   * Renders the content container and content components conditional on the
   * current route matching
   *
   * @returns {HTMLElement}
   */
  renderContent() {
    const { basePath } = this.props;

    const passProps = {
      ...this.props,
    };

    return (
      <div className="ckan-registry__content">
        <Route
          path={basePath}
          exact
          render={props => <CKANRegistryDisplay {...props} {...passProps} />}
        />

        <Route
          path={`${basePath}/view/:item`}
          render={props => <CKANRegistryDetailView {...props} {...passProps} />}
        />

        <Route
          path={`${basePath}/view`}
          exact
          render={() => <Redirect to={basePath} />}
        />
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

CKANExampleApp.propTypes = {
  basePath: PropTypes.string,
  name: PropTypes.string,
  resourceName: PropTypes.string,
  spec: PropTypes.shape({
    dataset: PropTypes.string,
    endpoint: PropTypes.string,
    identifier: PropTypes.string,
  }),
};

CKANExampleApp.defaultProps = {
  basePath: '/',
  name: '',
  resourceName: '',
  spec: {},
};

export default CKANExampleApp;

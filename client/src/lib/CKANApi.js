import fetch from 'isomorphic-fetch';

const CKAN_VERSION = 3;

/**
 * Helper class for performing requests to a CKAN API endpoint
 */
class CKANApi {
  /**
   * Parse a URI and attempt to resolve the endpoint, dataset and resource
   *
   * @param {string} uri
   * @return {Object|bool} Returns an object with keys; endpoint, dataset, and resource.
   *                       Returns false if the given URI does not appear to be valid
   */
  static parseURI(uri) {
    if (typeof uri !== 'string') {
      throw new Error('URI provided must be of type string');
    }

    if (!uri.length) {
      return false;
    }

    let preppedUri = uri;

    // Strip the protocol if one's available (or assume https)
    let protocol = 'https://';

    let match = preppedUri.match(/^https?:\/\//);
    if (match) {
      protocol = match[0];
      preppedUri = preppedUri.substr(protocol.length);
    }

    // Assume a full spec
    match = preppedUri.match(/(^[^\/]+\/)[^\/]+\/([^\/]+)\/[^\/]+\/([\da-f-]+)\/?$/i);
    if (match) {
      return {
        endpoint: `${protocol}${match[1]}`,
        dataset: match[2],
        resource: match[3],
      };
    }

    // Try without a resource
    match = preppedUri.match(/(^[^\/]+\/)[^\/]+\/([^\/]+)\/?$/i);
    if (match) {
      return {
        endpoint: `${protocol}${match[1]}`,
        dataset: match[2],
        resource: null,
      };
    }

    // Otherwise if the given string matches a guid, assume it's a resource
    // UUID v4
    if (preppedUri.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)) {
      return {
        endpoint: null,
        dataset: null,
        resource: preppedUri,
      };
    }

    // If there's no slashes then maybe it's a dataset ID?
    if (!preppedUri.includes('/')) {
      return {
        endpoint: null,
        dataset: preppedUri,
        resource: null,
      };
    }

    // This far then it's just not valid
    return false;
  }

  /**
   * Takes a CKAN resource specification and attempts toe generate a URL from it.
   * Returns false if a URL cannot be generated from the given detail.
   * Opposite of the parseURI method
   *
   * @param {object} spec
   * @returns {string|boolean}
   */
  static generateURI(spec) {
    // We _need_ at least the endpoint and dataset
    if (typeof spec !== 'object' || !spec.endpoint || !spec.dataset) {
      return false;
    }

    let { endpoint } = spec;

    // Check that the endpoint is a valid URL
    try {
      // eslint-disable-next-line no-new
      new URL(endpoint);
    } catch (e) {
      return false;
    }

    // Add a trailing slash if one does not exist
    if (endpoint.slice(-1) !== '/') {
      endpoint += '/';
    }

    // Generate the URL up to the dataset
    const uri = `${endpoint}dataset/${spec.dataset}`;

    // If we have a resource we can add and return that
    if (spec.resource) {
      return `${uri}/resource/${spec.resource}`;
    }

    return uri;
  }

  /**
   * Load a dataset from the given CKAN endpoint
   *
   * The returned promise resolves to the CKAN dataset object (or false if invalid)
   *
   * @param {string} endpoint A CKAN base URL
   * @param {string} dataset A dataset name or ID.
   * @returns {Promise}
   */
  static loadDataset(endpoint, dataset) {
    // Define a function to handle the response from the API (for re-use)
    const handleResponse = json => {
      // Vet out the response being invalid or empty
      if (!json.success || !json.result.count) {
        return false;
      }

      // Pull the first result
      const result = json.result.results[0];

      // Ensure the name or ID matches as we're looking for an exact
      if (result.name !== dataset && result.id !== dataset) {
        return false;
      }

      // Return the dataset
      return result;
    };

    // TODO Replace with package_show once data.govt.nz fixes their bug
    // package_show makes sense here but it doesn't actually work with data.govt.nz because of CORS

    // We look for a dataset (package) matching first the name, and then the ID if nothing is found
    return this.makeRequest(endpoint, 'package_search', {
      fq: `name:${dataset}`,
    }).then(
      // isomorphic-fetch returns a promise when the headers a loaded and provides the content as
      // another promise
      response => response.json().then(handleResponse),
      () => Promise.resolve(false)
    ).then(
      response => {
        if (response) {
          return response;
        }

        return this.makeRequest(endpoint, 'package_search', {
          fq: `id:${dataset}`,
        }).then(
          secondaryResponse => secondaryResponse.json().then(handleResponse),
          () => Promise.resolve(false)
        );
      }
    );
  }

  /**
   * Loads a resource from the given endpoint
   *
   * The returned promise resolves to the CKAN resource object (or false if invalid)
   *
   * @param {string} endpoint A CKAN base URL
   * @param {string} resource a CKAN resource ID
   * @returns {Promise}
   */
  static loadResource(endpoint, resource) {
    // Use resource_show to fetch a resource matching the ID
    return this.makeRequest(endpoint, 'resource_show', {
      id: resource,
    }).then(response => response.json().then(json => {
      if (!json.success) {
        return false;
      }

      return json.result;
    }));
  }

  /**
   * Validate a give CKAN endpoint by calling the most simple action available
   *
   * The returned promise resolves to a simple boolean, true if the given endpoint is valid.
   *
   * @param {string} endpoint
   * @returns {Promise}
   */
  static validateEndpoint(endpoint) {
    return this.makeRequest(endpoint, 'site_read').then(response => {
      if (!response.ok) {
        return Promise.resolve(false);
      }
      return response.json().then(json => json && json.success);
    }, () => Promise.resolve(false));
  }

  /**
   * A simple internal helper method to query the given endpoint with the provided action,
   * adding any given request vars to the GET request.
   *
   * @protected
   * @param {string} endpoint
   * @param {string} action
   * @param {object} requestVars
   * @returns {Promise}
   */
  static makeRequest(endpoint, action, requestVars) {
    let url = `${endpoint}api/${CKAN_VERSION}/action/${action}`;

    if (requestVars && Object.values(requestVars).length) {
      url += `?${Object.entries(requestVars).map(([key, value]) => `${key}=${value}`).join('&')}`;
    }

    return fetch(url);
  }
}

export default CKANApi;

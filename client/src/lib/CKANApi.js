import fetch from 'isomorphic-fetch';
import Datastore from './CKANApi/DataStore';

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
    if (typeof uri !== 'string' || !uri.length) {
      return false;
    }

    let preppedUri = uri;

    // Strip the protocol if one's available (or assume https)
    let protocol = 'https://';

    const protocolMatch = preppedUri.match(/^https?:\/\//);
    if (protocolMatch) {
      protocol = protocolMatch[0];
      preppedUri = preppedUri.substr(protocol.length);
    }

    // Remove any trailing slash...
    if (preppedUri.endsWith('/')) {
      preppedUri = preppedUri.substring(0, preppedUri.length - 1);
    }

    // Split by `/` and deal with the parts as an array
    const parts = preppedUri.split('/');

    // 5 parts assumes [endpoint]/dataset/[dataset_id]/resource/[resource_id]
    if (parts.length >= 5) {
      // Make sure that any parts before the last 4 are joined again by a forward slash.
      // This supports endpoints that might not be a base URL (eg. data.org/data)
      parts.splice(0, parts.length - 4, parts.slice(0, parts.length - 4).join('/'));
      return {
        endpoint: `${protocol}${parts[0]}/`,
        dataset: parts[2],
        resource: parts[4],
      };
    }

    // If we have 4 parts then assume the 2nd part is part of the endpoint
    // eg. data.org/data/resource/[resource_id]
    if (parts.length === 4) {
      parts.splice(0, 2, parts.slice(0, 2).join('/'));
    }

    // 3 parts means /resource/[resource_id]
    if (parts.length === 3) {
      return {
        endpoint: `${protocol}${parts[0]}/`,
        dataset: parts[2],
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

    // If we matched a protocol the assume it's an endpoint only
    if (protocolMatch) {
      return false;
    }

    // If there's no slashes then maybe it's a dataset ID?
    if (preppedUri.match(/^[\d\w-]+$/i)) {
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
    // We look for a dataset (package) using the "package_show" endpoint. This supports the ID or
    // the name/slug of the dataset as the "id" parameter
    return this.makeRequest(endpoint, 'package_show', {
      id: dataset,
    }).then(
      response => response.json().then(json => {
        // Vet out the response being invalid or empty
        if (!json.success || !json.result) {
          return false;
        }

        // Ensure the name or ID matches as we're looking for an exact
        const { result } = json;
        if (result.name !== dataset && result.id !== dataset) {
          return false;
        }

        // Return the dataset
        return result;
      }),
      () => Promise.resolve(false)
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
    }), () => Promise.resolve(false));
  }

  /**
   * Validate a given CKAN endpoint by calling the most simple action available
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

  static loadDatastore(endpoint, resource) {
    return new Datastore(endpoint, resource);
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

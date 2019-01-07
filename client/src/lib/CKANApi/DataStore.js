import CKANApi from '../CKANApi';

/**
 * Represents a "data store" on CKAN. Can be considered essentially an API to a CSV containing
 * columns (fields) and rows (records) of data.
 */
export default class {
  constructor(endpoint, resource) {
    this.endpoint = endpoint;
    this.resource = resource;
  }

  /**
   * Perform a "datastore_search" action on the CKAN resource
   *
   * @param {string[]} fields - The fields to return for each record
   * @param {string|object} term - A string term to search globally or an object of field : term
   * @param {boolean} distinct
   * @return {Promise}
   */
  search(fields = [], term = null, distinct = false) {
    if (!fields.length) {
      return Promise.resolve(false);
    }

    const options = {
      id: this.resource,
      fields: fields.map(encodeURIComponent).join(','),
    };

    // If an invalid term is given then assume that it will return nothing
    const termType = term === null ? null : typeof term;
    if (term !== null && termType !== 'string' && termType !== 'object') {
      return Promise.resolve(false);
    }

    // Parse the term - which can be a global term (string) or an object of { field: term }.
    if (termType === 'string' && term.length) {
      options.q = term;
    } else if (termType === 'object') {
      const terms = Object.entries(term);

      if (terms.length) {
        // Nicely enough the expected format in this case is JSON :tada:
        options.q = JSON.stringify(term);
      }
    }

    // Add the distinct var if requested
    if (distinct) {
      options.distinct = true;
    }

    // Make the request and parse the result into a more usable format
    return CKANApi.makeRequest(this.endpoint, 'datastore_search', options).then(
      response => response.json().then(result => {
        if (!result.success) {
          return false;
        }

        return {
          records: result.result.records,
          total: result.result.total,
        };
      })
    );
  }
}

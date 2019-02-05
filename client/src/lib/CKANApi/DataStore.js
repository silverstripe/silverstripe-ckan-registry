import CKANApi from 'lib/CKANApi';

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
   * @param {number} limit
   * @param {number} offset
   * @param {{ sortField: {string}, sortAscending: {boolean} }} sort
   * @return {Promise}
   */
  search(
    fields,
    term = null,
    distinct = false,
    limit = 100,
    offset = 0,
    sort = null
  ) {
    if (!Array.isArray(fields) || !fields.length) {
      return Promise.reject(false);
    }

    const options = {
      id: this.resource,
      fields: fields.join(','),
      // Always ensure a total is requested
      include_total: true,
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
        options.filters = JSON.stringify(term);
      }
    }

    // Add the distinct, limit and offset vars if requested
    if (distinct) {
      options.distinct = true;
    }
    options.limit = limit;
    options.offset = offset;

    if (sort) {
      const { sortField, sortAscending } = sort;
      options.sort = `${sortField} ${sortAscending ? 'ASC' : 'DESC'}`;
    }

    // Make the request and parse the result into a more usable format
    return CKANApi
      .makeRequest(this.endpoint, 'datastore_search', options)
      .then(this.handleResponse);
  }

  /**
   * Run an SQL style search from a CKAN API by constructing a "Query" object with filters
   *
   * @param {Query} query
   */
  searchSql(query) {
    return CKANApi
      .makeRequest(this.endpoint, 'datastore_search_sql', { sql: query.parse(this.resource) })
      .then(this.handleResponse);
  }

  /**
   * Run a count of records on the given query
   *
   * @param {Query} query
   */
  countSql(query) {
    return CKANApi
      .makeRequest(this.endpoint, 'datastore_search_sql', { sql: query.parseCount(this.resource) })
      .then(response => response.json().then(result => {
        if (!result.success) {
          return false;
        }

        return result.result.records[0].count;
      }));
  }

  /**
   * Internal method used to handle a valid response from CKAN API.
   *
   * @protected
   * @param {Promise} response
   * @return {Promise}
   */
  handleResponse(response) {
    return response.json().then(result => {
      if (!result.success) {
        return false;
      }

      return {
        records: result.result.records,
        total: result.result.total,
      };
    });
  }
}

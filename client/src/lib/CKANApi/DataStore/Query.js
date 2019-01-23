/**
 * Object used to formulate SQL queries for usage with fetching data from a CKAN api using the
 * "datastore_search_sql" endpoint.
 */
class Query {
  /**
   * Optional contstructor args - these can also be set as properties
   *
   * @param {Array} fields
   * @param {number} limit
   * @param {number} offset
   * @param {Boolean} distinct
   */
  constructor(fields = [], limit = 30, offset = 0, distinct = false) {
    this.limit = limit;
    this.offset = offset;
    this.distinct = distinct;
    this.filterBundles = [];
    this.orderSpec = [];
    this._fields = fields;
  }

  set fields(value) {
    if (!Array.isArray(value)) {
      throw Error('Query.fields must be an Array');
    }
    this._fields = value;
  }

  /**
   * Filter the given columns by the given term using an "OR". If you want to "AND" the columns you
   * should call this method multiple times.
   *
   * @param {string[]|string} columns
   * @param {string} term
   * @return {Query} (self)
   */
  filter(columns, term) {
    if (!Array.isArray(columns)) {
      // Assert we're dealing with an array or a string
      if (typeof columns !== 'string') {
        throw Error('Columns must be provided as a string or an array');
      }

      // Push on just a single column search
      this.filterBundles.push([{
        column: columns,
        term,
      }]);

      return this;
    }

    // With an array of columns we'll create a "bundle" - an array of matches to join with "OR"
    const bundle = [];
    columns.forEach(column => {
      bundle.push({
        column,
        term,
      });
    });
    // Add to our list of "bundles" to be joined with an "AND"
    this.filterBundles.push(bundle);

    return this;
  }

  order(field, direction = 'ASC') {
    this.orderSpec.push({
      field,
      direction,
    });
  }

  /**
   * Indicates whether there are any filters yet for this query. This can (should) be used before
   * querying as a "false" response means you can just use the "datastore_search" endpoint instead.
   *
   * @return {boolean}
   */
  hasFilter() {
    return this.filterBundles.length > 0;
  }

  /**
   * Clear the currently configured filters on this query
   *
   * @return {Query} (self)
   */
  clearFilters() {
    this.filterBundles = [];
    return this;
  }

  /**
   * Clear the currently configured order (sort) on this query
   *
   * @return {Query} (self)
   */
  clearOrder() {
    this.orderSpec = [];
    return this;
  }

  /**
   * Parse this object into an SQL statement that can be sent through to a CKAN API endpoint.
   *
   * @param {string} resource
   * @return {string}
   */
  parse(resource) {
    // Assert we have fields
    if (!this._fields.length) {
      throw Error('This query cannot be parsed as there are no fields to select');
    }

    // Prep the fields to select
    const fields = this._fields.map(field => `"${field}"`).join(', ');

    // Prep the where by mapping all our "OR bundles" and joining them with "AND"
    const whereClause = this.filterBundles.length
      ? ` WHERE (${this.filterBundles.map(bundle =>
        // Map those bundles - set "column" ILIKE '%field%' (and escape single quotes)
        bundle.map(({ column, term }) =>
          `"${column.replace('"', '""')}" ILIKE '%${String(term).replace("'", "''")}%'`
        ).join(' OR ')
      ).join(') AND (')})`
      : '';

    // Prep distinct if enabled
    const distinct = this.distinct ? 'DISTINCT ' : '';

    // Prep an order clause
    const orderClause = this.orderSpec.length
      ? ` ORDER BY ${this.orderSpec.map(({ field, direction }) =>
        `"${field.replace('"', '""')}" ${direction}`
      ).join(', ')}`
      : '';

    // Prep a limit clause
    const limitClause = ` LIMIT ${this.limit} OFFSET ${this.offset}`;

    // Combine all the clauses after "FROM {table}" into one const
    const endClause = whereClause + orderClause + limitClause;

    // Combine it all together
    return `SELECT ${distinct}${fields} FROM "${resource}" ${endClause}`;
  }
}

export default Query;

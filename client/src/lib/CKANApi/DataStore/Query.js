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
   * @param {Boolean|Object} distinct
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
   * Examples:
   *
   *   query('Foo', 'Bar')               -> WHERE "Foo" ILIKE '%Bar%'
   *   query('Foo', 'Bar', true)         -> WHERE "Foo" ILIKE 'Bar'
   *   query('Foo', 'Bar', false, false) -> WHERE "Foo" NOT ILIKE '%Bar%'
   *   query('Foo', 'Bar', true, false)  -> WHERE "Foo" NOT ILIKE 'Bar'
   *
   * @param {string[]|string} columns The column(s) to filter
   * @param {string} term             The value to filter the column(s) against
   * @param {boolean} strict          If false, `%` loose edge matching characters will be used
   * @param {boolean} match           Whether the term should match the column
   * @return {Query} (self)
   */
  filter(columns, term, strict = false, match = true) {
    if (!Array.isArray(columns)) {
      // Assert we're dealing with an array or a string
      if (typeof columns !== 'string') {
        throw Error('Columns must be provided as a string or an array');
      }

      // Push on just a single column search
      this.filterBundles.push([{
        column: columns,
        term,
        strict,
        match,
      }]);

      return this;
    }

    // With an array of columns we'll create a "bundle" - an array of matches to join with "OR"
    const bundle = [];
    columns.forEach(column => {
      bundle.push({
        column,
        term,
        strict,
        match,
      });
    });
    // Add to our list of "bundles" to be joined with an "AND"
    this.filterBundles.push(bundle);

    return this;
  }

  /**
   * Add an "ORDER BY" clause on the query for the given field
   *
   * @param {string} field
   * @param {string} direction
   */
  order(field, direction = 'ASC') {
    this.orderSpec.push({
      field,
      direction,
    });
  }

  /**
   * Ensure results returned are distinct on the given field
   *
   * @param {string} field
   */
  distinctOn(field) {
    if (this.distinct === true) {
      // The user has marked the whole query as distinct...
      return;
    }

    if (!Array.isArray(this.distinct)) {
      this.distinct = [];
    }

    this.distinct.push(field);
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
   * Clear the currently configured distinct configuration on this query
   *
   * @return {Query}
   */
  clearDistinct() {
    this.distinct = false;
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

    const quoteField = field => `"${field.replace('"', '""')}"`;
    let distinct = '';
    let join = '';

    // Prep distinct if enabled
    if (Array.isArray(this.distinct)) {
      const distinctFields = this.distinct.map(quoteField).join(', ');
      join = ` INNER JOIN (SELECT DISTINCT ON (${distinctFields}) "_id"`;
      join += ` FROM "${resource}"`;
      join += ` ORDER BY ${distinctFields}) q USING ("_id")`;

      // '_id' must be in the result set
      if (!this._fields.includes('_id')) {
        this._fields.push('_id');
      }
    } else if (this.distinct) {
      distinct = 'DISTINCT ';
    } else {
      distinct = '';
    }

    // Prep the fields to select
    const fields = this._fields.map(quoteField).join(', ');

    // Prep the where by mapping all our "OR bundles" and joining them with "AND"
    const whereClause = this.filterBundles.length
      ? ` WHERE (${this.filterBundles.map(bundle =>
        // Map those bundles - set "column" ILIKE '%field%' (and escape single quotes)
        bundle.map(({ column, term, strict, match }) => {
          const queryColumn = column.replace('"', '""');
          const queryTerm = String(term).replace("'", "''");
          const edgeMatch = strict ? '' : '%';
          const matchType = match ? 'ILIKE' : 'NOT ILIKE';

          return `"${queryColumn}" ${matchType} '${edgeMatch}${queryTerm}${edgeMatch}'`;
        }).join(' OR ')
      ).join(') AND (')})`
      : '';

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
    return `SELECT ${distinct}${fields} FROM "${resource}"${join}${endClause}`;
  }
}

export default Query;

import Query from 'lib/CKANApi/DataStore/Query';

describe('Query', () => {
  const query = new Query(['Name', 'Date']);
  beforeEach(() => {
    query.clearFilters();
    query.clearOrder();
    query.clearDistinct();
  });

  describe('filter()', () => {
    it('throws Error when a non-string or array is passed as a column', () => {
      expect(() => {
        query.filter(123, 'foo');
      }).toThrowError('Columns must be provided as a string or an array');
    });

    it('pushes a single column into the filter bundles', () => {
      expect(query.hasFilter()).toBe(false);
      query.filter('Foo', 'Bar');
      expect(query.hasFilter()).toBe(true);
    });

    it('handles an array of columns', () => {
      query.filter(['Foo', 'Bar', 'Baz'], 'Bar');
      expect(query.hasFilter()).toBe(true);
    });
  });

  describe('clearFilters()', () => {
    it('clears existing filters', () => {
      query.filter('Foo', 'Bar');
      query.clearFilters();
      expect(query.hasFilter()).toBe(false);
    });
  });

  describe('parse()', () => {
    it('throws an error when not fields have been defined', () => {
      expect(() => {
        const fieldlessQuery = new Query();
        fieldlessQuery.parse('testing');
      }).toThrowError('This query cannot be parsed as there are no fields to select');
    });

    it('adds the list of fields to the select', () => {
      const result = query.parse('testing');
      expect(result).toContain('"Name", "Date"');
    });

    it('adds distinct to the select when specified', () => {
      const distinctQuery = new Query(['Name'], 30, 0, true);
      const result = distinctQuery.parse('testing');
      expect(result).toContain('DISTINCT "Name"');
    });

    it('adds non-strict filters with "match"', () => {
      query.filter('Bar', 'Baz', false, true);

      const result = query.parse('testing');
      expect(result).toContain('"Bar" ILIKE \'%Baz%\'');
    });

    it('adds non-strict filters without "match"', () => {
      query.filter('Bar', 'Baz', false, false);

      const result = query.parse('testing');
      expect(result).toContain('"Bar" NOT ILIKE \'%Baz%\'');
    });

    it('adds strict filters with "match"', () => {
      query.filter('Bar', 'Baz', true, true);

      const result = query.parse('testing');
      expect(result).toContain('"Bar" ILIKE \'Baz\'');
    });

    it('adds strict filters without "match"', () => {
      query.filter('Bar', 'Baz', true, false);

      const result = query.parse('testing');
      expect(result).toContain('"Bar" NOT ILIKE \'Baz\'');
    });

    it('adds the order by clauses', () => {
      query.order('Foo', 'ASC');
      query.order('Baz', 'DESC');

      const result = query.parse('testing');
      expect(result).toContain('"Foo" ASC');
      expect(result).toContain('"Baz" DESC');
    });

    it('escapes double quotes in conditions', () => {
      query.filter('F"oo', '"Hello', true);
      query.filter("Fo'o", "Wo'rld", true);

      const result = query.parse('testing');
      expect(result).toContain('"F""oo"');
      expect(result).toContain('"Hello');
      expect(result).toContain('"Fo\'o"');
      expect(result).toContain("'Wo''rld'");
    });

    it('escapes double quotes in order clauses', () => {
      query.order('Uni"verse');

      const result = query.parse('testing');
      expect(result).toContain('Uni""verse');
    });

    it('adds a limit and offset', () => {
      const limitedQuery = new Query(['Name'], 30, 15);
      const result = limitedQuery.parse('testing');
      expect(result).toContain('LIMIT 30');
      expect(result).toContain('OFFSET 15');
    });

    it('selects from the given resource (table)', () => {
      const result = query.parse('testing');
      expect(result).toContain('FROM "testing"');
    });

    it('does not do DISTINCT queries by default', () => {
      expect(query.parse('testing')).not.toContain('DISTINCT');
    });

    it('can be set to produce a full DISTINCT query', () => {
      query.distinct = true;

      expect(query.parse('testing')).toContain('SELECT DISTINCT "Name"');
    });

    it('can produce a query to handle distinct per column', () => {
      query.distinctOn('Name');

      expect(query.parse('testing')).toContain(
        ' INNER JOIN (SELECT DISTINCT ON ("Name") "_id" FROM "testing" ORDER BY "Name") q USING ("_id")'
      );
    });
  });
});

/* global jest, describe, it, expect */

jest.mock('isomorphic-fetch');

import fetch from 'isomorphic-fetch';
import CKANApi from 'lib/CKANApi';
import DataStore from 'lib/CKANApi/DataStore';
import chalk from 'chalk';

// Create an extension of `expect` so we get nicer errors on failures
expect.extend({
  toParseAs(received, expected) {
    const parsed = CKANApi.parseURI(received);

    let pass = false;
    if (expected === false && parsed === false) {
      pass = true;
    }
    if (!pass && typeof expected === 'object' && typeof parsed === 'object') {
      pass = expected.endpoint === parsed.endpoint
        && expected.dataset === parsed.dataset
        && expected.resource === parsed.resource;
    }

    const msgReceived = chalk.yellow(received);
    const msgExpected = chalk.green(JSON.stringify(expected, null, 2));
    const msgParsed = chalk.red(JSON.stringify(parsed, null, 2));

    if (pass) {
      return {
        message: () => `Expected given URL "${msgReceived}" to parse into something other than \n${msgExpected}\nBut it didn't`,
        pass: true,
      };
    }

    return {
      message: () => `Expected given URL "${msgReceived}" to parse into \n${msgExpected}\nBut it actually parsed into \n${msgParsed}`,
      pass: false,
    };
  }
});

describe('CKANApi', () => {
  describe('parseURI', () => {
    it('should return false when parameters are not the correct type', () => {
      expect(null).toParseAs(false);
    });

    it('should return a full spec for a full URI', () => {
      expect('https://catalogue.data.govt.nz/dataset/benefit-fact-sheets-june-2018/resource/34a3653b-64cb-4997-8714-dd5149eda5af')
        .toParseAs({
          endpoint: 'https://catalogue.data.govt.nz/',
          dataset: 'benefit-fact-sheets-june-2018',
          resource: '34a3653b-64cb-4997-8714-dd5149eda5af',
        });
    });

    it('should handle not being given a resource', () => {
      expect('https://catalogue.data.govt.nz/dataset/benefit-fact-sheets-june-2018')
        .toParseAs({
          endpoint: 'https://catalogue.data.govt.nz/',
          dataset: 'benefit-fact-sheets-june-2018',
          resource: null,
        });
    });

    it('should fail when given only an endpoint', () => {
      expect('https://catalogue.data.govt.nz/')
        .toParseAs(false);
    });

    it('shouldn\'t care what the URL separators are', () => {
      expect('https://catalogue.data.govt.nz/foo/benefit-fact-sheets-june-2018/bar/34a3653b-64cb-4997-8714-dd5149eda5af')
        .toParseAs({
          endpoint: 'https://catalogue.data.govt.nz/',
          dataset: 'benefit-fact-sheets-june-2018',
          resource: '34a3653b-64cb-4997-8714-dd5149eda5af',
        });
    });

    it('can handle being given just a package name', () => {
      expect('benefit-fact-sheets-june-2018')
        .toParseAs({
          endpoint: null,
          dataset: 'benefit-fact-sheets-june-2018',
          resource: null,
        });
    });

    it('can handle being given just a resource ID', () => {
      expect('34a3653b-64cb-4997-8714-dd5149eda5af')
        .toParseAs({
          endpoint: null,
          dataset: null,
          resource: '34a3653b-64cb-4997-8714-dd5149eda5af',
        });
    });

    it('can handle being not being given a protocol', () => {
      expect('catalogue.data.govt.nz/dataset/benefit-fact-sheets-june-2018/resource/34a3653b-64cb-4997-8714-dd5149eda5af')
        .toParseAs({
          endpoint: 'https://catalogue.data.govt.nz/',
          dataset: 'benefit-fact-sheets-june-2018',
          resource: '34a3653b-64cb-4997-8714-dd5149eda5af',
        });
    });

    it('supports endpoints that might not be the base URL of the site', () => {
      expect('https://data.sa.gov.au/data/dataset/eadad203-d498-43d1-a4d5-fb3a90393a39')
        .toParseAs({
          endpoint: 'https://data.sa.gov.au/data/',
          dataset: 'eadad203-d498-43d1-a4d5-fb3a90393a39',
          resource: null,
        });
      expect('https://data.sa.gov.au/data/dataset/enrolments-in-each-sa-government-school-by-gender-and-year-level/resource/bc949969-54be-4389-8610-11a73a9cbda7')
        .toParseAs({
          endpoint: 'https://data.sa.gov.au/data/',
          dataset: 'enrolments-in-each-sa-government-school-by-gender-and-year-level',
          resource: 'bc949969-54be-4389-8610-11a73a9cbda7',
        });
    });

    it('can handle some weird URL combinations', () => {
      const tests = [
        {
          url: 'https://catalogue.data.govt.nz/a/b/c/d',
          assertion: {
            endpoint: 'https://catalogue.data.govt.nz/',
            dataset: 'b',
            resource: 'd',
          }
        },
        {
          url: 'https://catalogue.data.govt.nz/a/b/c/d/',
          assertion: {
            endpoint: 'https://catalogue.data.govt.nz/',
            dataset: 'b',
            resource: 'd',
          }
        },
        {
          url: 'https://catalogue.data.govt.nz/a/b/c/',
          assertion: {
            endpoint: 'https://catalogue.data.govt.nz/a/',
            dataset: 'c',
            resource: null,
          }
        },
        {
          url: 'https://catalogue.data.govt.nz/a/b',
          assertion: {
            endpoint: 'https://catalogue.data.govt.nz/',
            dataset: 'b',
            resource: null,
          }
        },
        {
          url: 'https://catalogue.data.govt.nz/a/b/',
          assertion: {
            endpoint: 'https://catalogue.data.govt.nz/',
            dataset: 'b',
            resource: null,
          }
        },
        {
          url: 'https://catalogue.data.govt.nz/a',
          assertion: false
        },
        {
          url: 'https://catalogue.data.govt.nz/',
          assertion: false
        },
        {
          url: 'catalogue.data.govt.nz/',
          assertion: false
        },
        {
          url: 'something/weird',
          assertion: false
        },
      ];

      tests.forEach(spec => {
        expect(spec.url).toParseAs(spec.assertion);
      });
    });
  });

  describe('generateURI', () => {
    it('should require a valid object with at least a valid endpoint and dataset provided', () => {
      expect(CKANApi.generateURI(false)).toBe(false);
      expect(CKANApi.generateURI({})).toBe(false);
      expect(CKANApi.generateURI({ endpoint: 'https://google.com' })).toBe(false);
      expect(CKANApi.generateURI({ dataset: 'x' })).toBe(false);
      expect(CKANApi.generateURI({ resource: 'x' })).toBe(false);
      expect(CKANApi.generateURI({ endpoint: 'https://google.com', resource: 'x' })).toBe(false);
      expect(CKANApi.generateURI({ endpoint: 'x', dataset: 'x' })).toBe(false);
    });

    it('should generate a URL when given a valid spec', () => {
      expect(CKANApi.generateURI({ endpoint: 'https://google.com', dataset: 'x', resource: 'y' }))
        .toBe('https://google.com/dataset/x/resource/y');
      expect(CKANApi.generateURI({ endpoint: 'https://google.com', dataset: 'x', resource: null }))
        .toBe('https://google.com/dataset/x');
      expect(CKANApi.generateURI({ endpoint: 'https://google.com/', dataset: 'x', resource: null }))
        .toBe('https://google.com/dataset/x');
    });
  });

  describe('loadDataset', () => {
    it('should handle rejected fetch promises', (done) => {
      fetch.mockImplementation(() => Promise.reject('It broke'));

      CKANApi.loadDataset('', '').then(response => {
        expect(response).toBe(false);
        done();
      });
    });

    it('should handle invalid responses', (done) => {
      fetch.mockImplementation(() => Promise.resolve({
        ok: false,
        json: () => Promise.resolve(false),
      }));

      CKANApi.loadDataset('', '').then(response => {
        expect(response).toBe(false);
        done();
      });
    });

    it('should parse a CKAN response and return the "result"', (done) => {
      fetch.mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          result: {
            name: 'my-dataset',
            thing: 'this is the result'
          },
        }),
      }));

      CKANApi.loadDataset('', 'my-dataset').then(response => {
        expect(response).toMatchObject({
          thing: 'this is the result',
        });
        done();
      });
    });

    it('should parse a CKAN response and return the "result" pt2', (done) => {
      fetch.mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          result: {
            id: 'c69a2d0b-5156-4285-9255-958262a945fd',
            thing: 'this is the result'
          },
        }),
      }));

      CKANApi.loadDataset('', 'c69a2d0b-5156-4285-9255-958262a945fd').then(response => {
        expect(response).toMatchObject({
          thing: 'this is the result',
        });
        done();
      });
    });

    it('should return false if the given package doesn\'t appear to match', (done) => {
      fetch.mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          result: {
            id: 'c69a2d0b-5156-4285-9255-958262a945fd',
            name: 'some-strangely-different-dataset-than-expected',
            thing: 'this is the result'
          },
        }),
      }));

      CKANApi.loadDataset('', 'my-dataset').then(response => {
        expect(response).toBe(false);
        done();
      });
    });
  });

  describe('loadResource', () => {
    it('should handle rejected fetch promises', (done) => {
      fetch.mockImplementation(() => Promise.reject('It broke'));

      CKANApi.loadResource('', '').then(response => {
        expect(response).toBe(false);
        done();
      });
    });

    it('should handle invalid responses', (done) => {
      fetch.mockImplementation(() => Promise.resolve({
        ok: false,
        json: () => Promise.resolve(false),
      }));

      CKANApi.loadResource('', '4eedab7c-6a1c-42bf-875c-2bcc92535e60').then(response => {
        expect(response).toBe(false);
        done();
      });
    });
    it('should parse a CKAN response and return the "result"', (done) => {
      fetch.mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          result: 'thing',
        }),
      }));

      CKANApi.loadResource('', '4eedab7c-6a1c-42bf-875c-2bcc92535e60').then(response => {
        expect(response).toBe('thing');
        done();
      });
    });
  });

  describe('validateEndpoint', () => {
    it('should handle rejected fetch promises', (done) => {
      fetch.mockImplementation(() => Promise.reject('It broke'));

      CKANApi.validateEndpoint('').then(response => {
        expect(response).toBe(false);
        done();
      });
    });

    it('should return the result of response.ok', (done) => {
      fetch.mockImplementation(() => Promise.resolve({
        ok: false,
      }));

      CKANApi.validateEndpoint('').then(response => {
        expect(response).toBe(false);
        done();
      });
    });

    it('should return the result of response.ok pt2', (done) => {
      fetch.mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          result: true,
        }),
      }));

      CKANApi.validateEndpoint('').then(response => {
        expect(response).toBe(true);
        done();
      });
    });
  });

  describe('loadDatastore', () => {
    it('should return a datastore', () => {
      const store = CKANApi.loadDatastore('a', 'b');

      expect(store).toBeInstanceOf(DataStore);
      expect(store).toHaveProperty('endpoint', 'a');
      expect(store).toHaveProperty('resource', 'b');
    });
  });
});

# Developer documentation

## Using the CKAN API clients

You can enter a CKAN dataset URL into the field in the "Data" tab, which will resolve the URL and autopopulate a list
of the resources that are available to use in that dataset. When you save the page, a list of `ResourceField` models
will be populated for each of the available columns in the selected dataset.

If necessary, you can also use one of the two CKAN API clients below to perform custom actions:

### PHP client

When requests are made from the SilverStripe CMS, a `SilverStripe\CKANRegistry\Service\ClientInterface` implementation
is used. This service is responsible for making requests to a CKAN API from the backend. It must be passed a `Resource`
model, and will return the raw response from the API endpoint for that `Resource` via the `getData()` method.
Optionally, you can also pass an "action" and an "id" field name from the `Resource`. These will be used to determine
which endpoint action on the CKAN API is used, and which `Resource` field is used as the "id" argument in the request.

Two methods are available for quick retrieval of data:

* `getPackage()`: returns the metadata for the dataset ("package_show" action in CKAN)
* `getSearchData()`: returns the column information for the given package ("datastore_search" action in CKAN)

The default implementation of this interface is `SilverStripe\CKANRegistry\Service\Client`, which uses GuzzleHttp to
communicate with the CKAN API endpoint. You can configure additional Guzzle options via the extension point in
`getClientOptions()` if needed, for example if configuring proxy settings for the requests.

### JavaScript client

You can use the JavaScript CKAN API client (see `client/src/lib/`) to look up a dataset, search for records
within a resource, add filters, add ordering clauses, etc. You can use any of the classes directly depending on your
requirements.

The `CKANApi` helper class has the following methods:

* `parseURI()`: attempts to parse a CKAN URL into endpoint, dataset and resource
* `generateURI()`: inverse of `parseURI()` - builds a CKAN URL from parsed components
* `loadDataset()`: loads [a CKAN data set](https://docs.ckan.org/en/2.8/user-guide.html#datasets-and-resources) and
  returns a promise containing the results
* `loadResource()`: loads [a CKAN resource](https://docs.ckan.org/en/2.8/user-guide.html#datasets-and-resources) and
  returns a promise containing the results
* `validateEndpoint()`: validates a CKAN API endpoint by performing a simple operation
* `loadDatastore()`: returns a `Datastore` instance, which can be used to perform searching against
  [a CKAN datastore](https://docs.ckan.org/en/2.8/maintaining/datastore.html)

The `Datastore` is responsible for wrapping searching into a common API, and has the following methods:

* `search()`: performs a search against the CKAN datastore given a variety of search columns, terms, limiting, and
  sorting options (see [`datastore_search`](https://docs.ckan.org/en/2.8/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search))
* `searchSql()`: creates a `Query` instance and uses it to perform a SQL based search (see
  [`datastore_search_sql`](https://docs.ckan.org/en/2.8/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search_sql))

The `Query` class is used to construct a SQL query for CKAN by providing a set of methods that can be used from within
your JavaScript code:

* `fields()`: set the fields to return
* `filter()`: add a filter (where condition)

For more information on any of these classes, please see the source code in `client/src/lib/`.

## PHP service classes

### `APIClientInterface`

Represents an API client for connecting to and querying a CKAN endpoint. See "PHP Client" at the top of this page for
more information.

The default implementation of this interface is `APIClient`, and uses [guzzlehttp/guzzle](http://docs.guzzlephp.org)
for the HTTP requests to the API endpoint.

### `ResourcePopulatorInterface`

Given a `Resource` model, instances of this interface will be responsible for populating the resource model with
various data from the CKAN endpoint that is configured on that resource model.

The default implementation of this interface is `ResourcePopulator`, and provides the following methods:

* `populateMetadata(Resource $resource)`: will gather metadata about the resource and/or dataset. The default
  implementation stores the dataset name and resource name as DB fields on the resource model.
* `populateFields(Resource $resource()`: will create and attach `ResourceField` instances to the `Resource` for each
  column in the resource's configured CKAN dataset.

`ResourcePopulator` (default implementation) also takes responsibility for validating the `Resource` model is
adequately configured and will convert the CKAN field name into a default human readable label which can be adjusted
in the CMS afterwards. Note that these methods are protected, and not covered under the `ResourcePopulatorInterface`
specification.

---

[< Back to index](index.md)

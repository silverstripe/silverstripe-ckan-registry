# Developer documentation

## CMS integration

Provided with this module are some important classes and models for scaffolding a configurable CKAN dataset page
in the CMS:

* `CKANRegistryPage`: a page type for the CMS
* `Resource`: a representation of a CKAN dataset resource
* `ResourceField`: a representation of a column from the CKAN dataset resource
* `ResourceFilter`: a configurable filter for frontend users

### CKAN Registry Page

The page type that ships with this module is separated from regular page types to ensure that CMS users can get
started with this module immediately after installation, and so that it doesn't interfere with default pages in the
CMS. Its code is largely for GridField formatting and inserting custom FormField components to manage the data set
attached to the page (see `Resource` model).

The controller class for `CKANRegistryPage` provides a catch all handler for the `/view` sub-URL (see
["Integration notes"](notes.md)) and exposes the frontend CKAN client configuration as JSON.

### Resource model

A `Resource` model represents a CKAN dataset resource and is attached from a `CKANRegistryPage` (or other DataObject) via
a `has_one` relationship `$page->DataResource()`.

The primary purpose of this model is to contain fields (`ResourceField`) and filters (`ResourceFilter`).

When a `Resource` is first created, or whenever the dataset URL or CKAN resource ID is changed, the following tasks
will be run:

* Delete all related fields
* Delete all related filters
* Create a new list of related fields (see `ResourcePopulatorInterface`)
* Pull in some of the dataset and selected resource's metadata (see `ResourcePopulatorInterface`)

### ResourceField model

Columns in a CKAN dataset are represented in the CMS by a `ResourceField` data model. These are attached to a
`Resource` via a `has_many` relationship: `$resource->Fields()`.

The model contains a variety of CMS configurable fields and settings, which are ultimately provided to the frontend
client in a set of JSON client configuration (see `getCKANClientConfig()`).

The `DisplayConditions` DB field is a JSON blob stored in a Text column, and represents configuration for when this
column should be used as a default filter on the dataset. For example "dataset column values in 'Software' must
match the text 'SilverStripe' in order for the row to be shown".

### ResourceFilter models

Frontend user controllable filter facets for the CKAN data set can be created by adding `ResourceFilter` models. These
are attached to a `Resource` via a `has_many` relationship: `$resource->Filters()`.

The base `ResourceFilter` class represents a simple "text filter". This may be rendered on the frontend as a "Search"
field with a text input, and allow the user to filter various (or all) columns in the presented dataset by the search
term they enter.

Subclasses of `ResourceFilter` (e.g. `Dropdown`) can customise the database fields and structure in order to provide
more complex frontend filters. Note that the implementation of these filters on the frontend is the responsibility of
the frontend application - you can take a look at the React frontend app that ships with this module for an example.

You can choose for a filter class to either apply to all columns in the dataset (`AllColumns`), or define a specific
list of `ResourceField`s via `many_many`: `$resourceFilter->FilterFields()`. This would allow you to configure a
filter to only apply to specific fields within the dataset, e.g. "Search by surname."

## Service classes

There are two service classes which are designed to assist with the backend CKAN API integration:

* `APIClientInterface`: provides a PHP API client to query CKAN datasets
* `ResourcePopulatorInterface`: handles CKAN field and metadata population in the CMS

For more information on these interfaces and their default implementations, see
["Using the CKAN API clients"](api-clients.md).

## CMS React components

The React components used in the CMS are mostly used to provide an interface for data entry that can easily be
stored in a JSON blob.

* `CKANResourceLocatorField`: allows a CMS user to enter a CKAN dataset URL, will use the JavaScript CKAN API client
  to query and process the data, and then allow a CMS user to select a resource from within that dataset
* `CKANPresentedOptionsField`: "Presented options" are a either a selection of checkboxes, or a free text input field
  for the user to define a list of the presented options that will be applied for a given dropdown filter in the CMS.
  If using a checkbox set, the user can adjust the default delimiter field. It suggests options by loading data from
  the CKAN API.
* `CKANResultConditionsField`: allows a CMS user to set one condition for displaying the column if the contents of
  it match or do not match a given string.
---

[< Back to index](index.md)

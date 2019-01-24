# Developer documentation

## Example frontend app

This module ships with an example frontend application written in React. This can be used as a guide/example of how
to implement a decoupled frontend application for the CKAN dataset configuration set up in the backend.

### Dependencies

* [React](https://reactjs.org)
* [react-router-dom](https://www.npmjs.com/package/react-router-dom)
* Bootstrap 4 (via [Reactstrap](https://reactstrap.github.io))
* [Griddle](http://griddlegriddle.github.io/Griddle/docs/)

Note that the dependencies listed above are important, but the list is not necessarily exhaustive.

### Components

* `CKANExampleApp`: provides the entrypoint and application container for the app, as well as defining the routing
  rules for each section of the application
* `CKANRegistryDisplay`: displays the CKAN data in a Griddle table, and renders the frontend filters
  * `CKANRegistryFilterContainer`: a wrapper for the frontend filters, and handling the filter form submissions
  * `CKANTextFilter`: frontend example implementation for the `ResourceFilter` PHP model
  * `CKANDropdownFilter`: frontend example implementation for the `ResourceFilter\Dropdown` PHP model
* `CKANRegistryDetailView`: displays a detailed view of a record from the CKAN data

### Easy styling

If all you need to do is change some colours or formatting, you should be able to do so by adding custom CSS to your
theme. The example app follows the [BEM class naming convention](http://getbem.com/introduction/), which should help
to keep CSS/SCSS neat and structured.

### Modifying the example app

If it's necessary to modify the structure of the example application, you could copy the example React components into
your own module, project, or theme in order to modify them.

If you need to disable the example application in order to run your own version, you can block the JavaScript and/or
CSS resources that are added in `CKANRegistryPage.ss` and `CKANRegistry.ss`. You can also override the default
SilverStripe templates in your own project, module or theme to prevent these assets from being loaded and/or change
the markup for the initial template rendering, add more fields to the template, etc.

#### Modifying Griddle

Griddle is the library we have used in the example frontend React app to render the data into a table for display on
a CKAN registry page. Its implementation is in React, and can be adjusted via the `CKANRegistryDisplay` React component.

If you would like to customise the way that the data is displayed (e.g. you want to add a map view for geospatial data)
please have a look through the [Griddle documentation and examples](http://griddlegriddle.github.io/Griddle/docs/).
There is also an example for [creating a map view here](http://griddlegriddle.github.io/Griddle/examples/asMap/).

---

[< Back to index](index.md)

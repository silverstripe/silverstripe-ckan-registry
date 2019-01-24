# Developer documentation

## Overview

The SilverStripe CKAN Registry module is designed to let CMS authors easily create a page in their SilverStripe
website which can pull in and display dynamic data from a [CKAN](https://ckan.org/) data set.

Once a page has been added, configuration is largely handled within the CMS. This includes which columns to display
on the list view page and detail view pages, as well rules for filtering data rows by default, and user controllable
filters on the frontend.

This module has two parts:

* the backend integration module: provides the page type, models, CMS React components, and a PHP CKAN API client
* the example frontend app implementation: a React application with components and a JavaScript CKAN API client

---

[< Back to index](index.md)

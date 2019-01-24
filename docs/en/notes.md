# Developer documentation

## Integration notes

### Filters use the CKAN SQL API endpoint

The filter components in the frontend example app uses the [`datastore_search_sql`](https://docs.ckan.org/en/2.8/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search_sql)
search endpoint on the target CKAN instance. It's important to note that while data.govt.nz should have this optional
CKAN extension enabled for all datasets, not every CKAN instance will by default.

### Disabled sub-routes for CKAN pages

Please note that in order for the frontend example app's React router to load detail views for a given CKAN dataset's
row, the `view` action is disabled for CKAN pages. Similarly, creating a child page with `view` as its URL segment
would cause conflicts and prevent the frontend application from rendering the detail view page.

---

[< Back to index](index.md)

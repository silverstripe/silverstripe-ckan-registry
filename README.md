# SilverStripe CKAN Registry

[![Build Status](https://travis-ci.com/silverstripe/silverstripe-ckan-registry.svg?branch=master)](https://travis-ci.com/silverstripe/silverstripe-ckan-registry)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/silverstripe/silverstripe-ckan-registry/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/silverstripe/silverstripe-ckan-registry/?branch=master)
[![codecov](https://codecov.io/gh/silverstripe/silverstripe-ckan-registry/branch/master/graph/badge.svg)](https://codecov.io/gh/silverstripe/silverstripe-ckan-registry)
[![License](https://poser.pugx.org/silverstripe/ckan-registry/license.svg)](https://github.com/silverstripe/silverstripe-ckan-registry#license)
[![SilverStripe supported module](https://img.shields.io/badge/silverstripe-supported-0071C4.svg)](https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/)

## Overview

The SilverStripe CKAN Registry module lets CMS authors easily create pages in their SilverStripe websites which can
pull in and display dynamic data from [CKAN](https://ckan.org/) data sets.

## Installation

```
$ composer require silverstripe/ckan-registry 1.0.x-dev
```

## Documentation

Developer and user guide documentation [is available in the "docs" directory](docs/en/index.md).

## Versioning

This library follows [Semver](http://semver.org). According to Semver,
you will be able to upgrade to any minor or patch version of this library
without any breaking changes to the public API. Semver also requires that
we clearly define the public API for this library.

All methods, with `public` visibility, are part of the public API. All
other methods are not part of the public API. Where possible, we'll try
to keep `protected` methods backwards-compatible in minor/patch versions,
but if you're overriding methods then please test your work before upgrading.

## Reporting Issues

Please [create an issue](https://github.com/silverstripe/silverstripe-ckan-registry/issues)
for any bugs you've found, or features you're missing.

## License

This module is released under the [BSD 3-Clause License](LICENSE).

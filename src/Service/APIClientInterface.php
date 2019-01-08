<?php

namespace SilverStripe\CKANRegistry\Service;

use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;

/**
 * A service responsible for communicating with a CKAN API endpoint
 */
interface APIClientInterface
{
    /**
     * The CKAN API version to communicate with
     *
     * @var int
     */
    const API_VERSION = 3;

    /**
     * Performs a request to the CKAN API for the given {@link Resource} and returns the raw data result
     *
     * @param Resource $resource
     * @param string $action     The CKAN API action to use
     * @param string $id         The {@link Resource} field to use as the "id" argument
     * @return array             The output from the CKAN API
     * @throws RuntimeException  If API communication fails for some reason
     */
    public function getData(Resource $resource, $action = 'datastore_search', $id = 'Identifier');

    /**
     * Performs a request to the CKAN API for the given {@link Resource} and returns the result. Uses the endpoint
     * for "package_show".
     *
     * @return array            The output from the CKAN API
     * @throws RuntimeException If API communication fails for some reason
     */
    public function getPackage(Resource $resource);

    /**
     * Performs a request to the CKAN API for the given {@link Resource} and returns the raw data result. Uses the
     * endpoint for "datastore_search".
     *
     * @return array            The output from the CKAN API
     * @throws RuntimeException If API communication fails for some reason
     */
    public function getSearchData(Resource $resource);
}

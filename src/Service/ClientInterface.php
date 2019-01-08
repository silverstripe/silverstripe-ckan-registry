<?php

namespace SilverStripe\CKANRegistry\Service;

use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;

/**
 * A service responsible for communicating with a CKAN API endpoint
 */
interface ClientInterface
{
    /**
     * Performs a request to the CKAN API for the given {@link Resource} and returns the raw data result
     *
     * @return array            The output from the CKAN API
     * @throws RuntimeException If API communication fails for some reason
     */
    public function getData(Resource $resource);
}

<?php

namespace SilverStripe\CKANRegistry\Service;

use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;

interface ResourceFieldPopulatorInterface
{
    /**
     * Populate fields from the CKAN API endpoint specified on this given resource.
     * Throws an exception when the CKAN API is unreachable or responds with an error or if the resource is not properly
     *
     * @param Resource $resource
     * @throws \GuzzleHttp\Exception\GuzzleException|RuntimeException
     */
    public function populateFields(Resource $resource);
}

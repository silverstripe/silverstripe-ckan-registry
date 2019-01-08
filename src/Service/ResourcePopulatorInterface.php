<?php

namespace SilverStripe\CKANRegistry\Service;

use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;

interface ResourcePopulatorInterface
{
    /**
     * Populate the given {@link Resource} with metadata from the CKAN API
     *
     * Throws an exception when the CKAN API is unreachable or response with an error, or if the resource is not
     * properly configured.
     *
     * @param Resource $resource
     * @throws RuntimeException
     */
    public function populateMetadata(Resource $resource);

    /**
     * Populate fields from the CKAN API endpoint specified on this given resource.
     *
     * Throws an exception when the CKAN API is unreachable or responds with an error, or if the resource is not
     * properly configured.
     *
     * @param Resource $resource
     * @throws RuntimeException
     */
    public function populateFields(Resource $resource);
}

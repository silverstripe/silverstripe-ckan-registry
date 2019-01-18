<?php

namespace SilverStripe\CKANRegistry\Page;

use PageController;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\ORM\DataObject;

class CKANRegistryPageController extends PageController
{
    private static $url_handlers = [
        // Route all requests for this page, including sub-URLs, to the index action.
        // The frontend components should take care of handling sub-URL routing from here.
        'view/$Item' => 'index',
    ];

    /**
     * Loads model data encapsulated as JSON in order to power front end technologies used to render that
     * data. Includes critical info such as the CKAN site to query (e.g. which domain, datastore, etc.)
     * but also can be extended to be used for configuring the component used to show this (e.g. React.js
     * or Vue.js component configuration).
     *
     * @param DataObject $holder
     * @return array
     */
    public function getCKANClientConfig(DataObject $holder = null)
    {
        if (!$holder) {
            $holder = $this->data();
        }

        /** @var Resource $resource */
        $resource = $holder->getComponent('DataResource');

        $config = [
            'spec' => [
                'endpoint' => $resource->Endpoint,
                'dataset' => $resource->DataSet,
                'identifier' => $resource->Identifier,
            ],
            'name' => $resource->Name,
            'resourceName' => $resource->ResourceName,
            'basePath' => $this->getBasePath($holder),
        ];

        $this->extend('updateCKANClientConfig', $config);

        return $config;
    }

    /**
     * Returns the base path for the resource's page with a leading slash
     *
     * @param DataObject $holder
     * @return string
     */
    public function getBasePath(DataObject $holder = null)
    {
        if (!$holder) {
            return '/';
        }

        $link = $holder->RelativeLink();
        return '/' . trim($link, '/');
    }
}

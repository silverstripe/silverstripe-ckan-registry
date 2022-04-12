<?php

namespace SilverStripe\CKANRegistry\Page;

use PageController;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Model\ResourceField;
use SilverStripe\CKANRegistry\Model\ResourceFilter;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\ORM\DataObject;
use SilverStripe\View\Requirements;

class CKANRegistryPageController extends PageController
{
    private static $allowed_actions = [
        'readSchema',
    ];

    private static $url_handlers = [
        // The "view" action is routed to index. The frontend implementation should take care of the frontend
        // routing for sub URLs. We will route /schema and /view/123/schema to the readSchema method though.
        'GET view/$Item/schema' => 'readSchema',
        'view/$Item' => 'index',
        'GET schema' => 'readSchema',
    ];

    protected function init()
    {
        parent::init();

        Requirements::javascript('silverstripe/admin: client/dist/js/i18n.js');
        Requirements::add_i18n_javascript('silverstripe/ckan-registry: client/lang');
    }

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
            'fields' => array_map(
                function (ResourceField $field) {
                    return [
                        'OriginalLabel' => $field->OriginalLabel,
                        'ReadableLabel' => $field->ReadableLabel,
                        'ShowInResultsView' => (bool) $field->ShowInResultsView,
                        'ShowInDetailView' => (bool) $field->ShowInDetailView,
                        'DisplayConditions' => json_decode($field->DisplayConditions ?? '', true),
                        'RemoveDuplicates' => (bool) $field->RemoveDuplicates,
                        'Type' => $field->Type,
                    ];
                },
                $resource->Fields()->filterAny([
                    'ShowInResultsView' => true,
                    'ShowInDetailView' => true,
                    'RemoveDuplicates' => true,
                ])->Sort('Position', 'ASC')->toArray() ?? []
            ),
            'filters' => array_map(
                function (ResourceFilter $filter) {
                    $explodedClassName = explode('\\', get_class($filter));
                    return [
                        'type' => array_pop($explodedClassName),
                    ] + $filter->getClientConfig();
                },
                $resource->Filters()->sort('Order')->toArray() ?? []
            )
        ];

        $this->extend('updateCKANClientConfig', $config);

        return $config;
    }

    /**
     * Returns the frontend application client configuration schema
     *
     * @param HTTPRequest $request
     */
    public function readSchema(HTTPRequest $request)
    {
        $response = HTTPResponse::create()
            ->addHeader('Content-Type', 'application/json')
            ->setBody(json_encode($this->getCKANClientConfig()));
        return $response;
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
        return Director::baseURL() . trim($link ?? '', '/');
    }
}

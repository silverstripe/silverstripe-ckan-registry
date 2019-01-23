<?php

namespace SilverStripe\CKANRegistry\Page;

use PageController;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Model\ResourceField;
use SilverStripe\CKANRegistry\Model\ResourceFilter;
use SilverStripe\Control\Director;
use SilverStripe\ORM\DataObject;
use SilverStripe\View\Requirements;

class CKANRegistryPageController extends PageController
{
    private static $url_handlers = [
        // Route all requests for this page, including sub-URLs, to the index action.
        // The frontend components should take care of handling sub-URL routing from here.
        'view/$Item' => 'index',
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
                        'ShowInResultsView' => $field->ShowInResultsView,
                        'ShowInDetailView' => $field->ShowInDetailView,
                        'DisplayConditions' => $field->DisplayConditions,
                        'RemoveDuplicates' => $field->RemoveDuplicates,
                    ];
                },
                $resource->Fields()->filterAny([
                    'ShowInResultsView' => true,
                    'ShowInDetailView' => true,
                    'RemoveDuplicates' => true,
                ])->Sort('Position', 'ASC')->toArray()
            ),
            'filters' => array_map(
                function (ResourceFilter $filter) {
                    $explodedClassName = explode('\\', get_class($filter));
                    return [
                        'type' => array_pop($explodedClassName),
                    ] + $filter->getClientConfig();
                },
                $resource->Filters()->toArray()
            )
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
        return Director::baseURL() . trim($link, '/');
    }
}

<?php

namespace SilverStripe\CKANRegistry\Model;

use SilverStripe\CKANRegistry\Page\CKANRegistryPage;
use SilverStripe\CKANRegistry\Service\ResourcePopulatorInterface;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;

/**
 * A CKAN Resource that belongs to a DataSet/Package, as to be accessed via the CKAN API.
 *
 * @property string Name
 * @property string ResourceName
 * @property string Endpoint
 * @property string DataSet
 * @property string Identifier
 * @method HasManyList Fields
 * @method HasManyList Filters
 */
class Resource extends DataObject
{
    private static $table_name = 'CKANResource';

    private static $db = [
        'Name' => 'Varchar',
        'ResourceName' => 'Varchar',
        'Endpoint' => 'Varchar',
        'DataSet' => 'Varchar',
        'Identifier' => 'Varchar',
        'ItemsPerPage' => 'Int',
    ];

    private static $belongs_to = [
        'Page' => CKANRegistryPage::class . '.DataResource',
    ];

    private static $has_many = [
        'Fields' => ResourceField::class,
        'Filters' => ResourceFilter::class,
    ];

    private static $defaults = [
        'ItemsPerPage' => 30,
    ];

    /**
     * Whenever the CKAN resource identifier is changed we should clear any existing field and filter configurations
     *
     * {@inheritdoc}
     */
    public function onAfterWrite()
    {
        if ($this->isChanged('Identifier')) {
            $this->Fields()->each(function (ResourceField $field) {
                $field->delete();
            });

            /** @var ResourcePopulatorInterface $populator */
            $populator = Injector::inst()->get(ResourcePopulatorInterface::class);
            $populator->populateFields($this);

            // Remove the existing filters and add a default text entry to search all ResourceFields
            $this->Filters()
                ->each(function (ResourceFilter $filter) {
                    $filter->delete();
                })
                ->add(ResourceFilter::create());
        }

        parent::onAfterWrite();
    }

    /**
     * Whenever the CKAN resource identifier is changed, populate a new set of metadata for the new resource
     *
     * {@inheritdoc}
     */
    public function onBeforeWrite()
    {
        if ($this->isChanged('Identifier')) {
            /** @var ResourcePopulatorInterface $populator */
            $populator = Injector::inst()->get(ResourcePopulatorInterface::class);
            $populator->populateMetadata($this);
        }

        parent::onBeforeWrite();
    }

    /**
     * Loads model data encapsulated as JSON in order to power front end technologies used to render that
     * data. Includes critical info such as the CKAN site to query (e.g. which domain, datastore, etc.)
     * but also can be extended to be used for configuring the component used to show this (e.g. React.js
     * or Vue.js component configuration).
     *
     * @return array
     */
    public function getCKANClientConfig()
    {
        $config = [
            'spec' => [
                'endpoint' => $this->Endpoint,
                'dataset' => $this->DataSet,
                'identifier' => $this->Identifier,
            ],
            'name' => $this->Name,
            'resourceName' => $this->ResourceName,
            'basePath' => $this->getPageBasePath(),
        ];

        $this->extend('updateCKANClientConfig', $config);

        return $config;
    }

    /**
     * Returns the base path for the resource's page with a leading slash
     *
     * @return string
     */
    public function getPageBasePath()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->getComponent('Page');
        $pagePath = $page->RelativeLink();
        return '/' . trim($pagePath, '/');
    }
}

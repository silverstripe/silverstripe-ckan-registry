<?php

namespace SilverStripe\CKANRegistry\Model;

use SilverStripe\CKANRegistry\Service\ResourceFieldPopulatorInterface;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;

/**
 * A CKAN Resource that belongs to a DataSet/Package, as to be accessed via the CKAN API.
 *
 * @property string Name
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
        'Endpoint' => 'Varchar',
        'DataSet' => 'Varchar',
        'Identifier' => 'Varchar',
    ];

    private static $has_many = [
        'Fields' => ResourceField::class,
        'Filters' => ResourceFilter::class,
    ];

    /**
     * Whenever the CKAN resource identifier is changed we should clear any existing field and filter configurations
     *
     * {@inheritdoc}
     */
    public function onAfterWrite()
    {
        if ($this->isChanged('Identifier')) {
            $this->Fields()->removeAll();
            Injector::inst()->get(ResourceFieldPopulatorInterface::class)->populateFields($this);
            // Remove the existing filters and add a default text entry to search all ResourceFields
            $this->Filters()->removeAll()
                ->add(ResourceFilter::create());
        }
        parent::onAfterWrite();
    }
}

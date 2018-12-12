<?php

namespace SilverStripe\CKANRegistry\Model;

use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\HasManyList;

/**
 * A CKAN Resource that belongs to a DataSet/Package, as to be accessed via the CKAN API.
 *
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

    public function onAfterWrite()
    {
        if ($this->changed('Identifier')) {
            $this->Fields()->removeAll();
            $this->Filters()->removeAll();
        }
    }
}

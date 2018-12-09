<?php

namespace SilverStripe\CKANRegistry\Page;

use Page;
use SilverStripe\CKANRegistry\Forms\ResourceLocatorField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;

/**
 * A CKANRegistryPage will render a chosen CKAN data set on the frontend, provide the user with configurable filters
 * and display a set of CMS configured columns.
 */
class CKANRegistryPage extends Page
{
    private static $table_name = 'CKANRegistryPage';

    private static $db = [
        'ItemsPerPage' => 'Int',
    ];

    private static $defaults = [
        'ItemsPerPage' => 20,
    ];

    private static $singular_name = 'CKAN Registry Page';

    private static $plural_name = 'CKAN Registry Pages';

    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $fields->addFieldToTab('Root.Data', ResourceLocatorField::create('Thing'));
        });

        return parent::getCMSFields();
    }

    public function getSettingsFields()
    {
        $fields = parent::getSettingsFields();

        $fields->addFieldsToTab('Root.Settings', [
            TextField::create('ItemsPerPage', _t(__CLASS__ . '.ItemsPerPage', 'Items per page')),
        ]);

        return $fields;
    }
}

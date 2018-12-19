<?php

namespace SilverStripe\CKANRegistry\Model\ResourceFilter;

use SilverStripe\CKANRegistry\Forms\PresentedOptionsField;
use SilverStripe\CKANRegistry\Model\ResourceFilter;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;

/**
 * Provides a single select option for CKAN resources to be filtered by
 */
class Dropdown extends ResourceFilter
{
    private static $db = [
        'Options' => 'Varchar',
    ];

    private static $table_name = 'CKANFilter_Dropdown';

    private static $singular_name = 'Dropdown';

    protected $fieldType = DropdownField::class;

    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $fields->push(PresentedOptionsField::create(
                'Options',
                $this->FilterFor,
                _t(__CLASS__ . '.OPTIONS', 'Presented options')
            ));
        });

        return parent::getCMSFields();
    }
}

<?php

namespace SilverStripe\CKANRegistry\Model;

use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\TextField;

class ResourceDropdownFilter extends ResourceFilter
{
    private static $db = [
        'Options' => 'Varchar'
    ];

    private static $singular_name = 'Dropdown Filter';

    protected $fieldType = DropdownField::class;

    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $fields->push(TextField::create(
                'Options',
                _t(__CLASS__ . '.Options', 'Dropdown options')
            ));

            $fields->removeByName('FilterForID');
        });

        return parent::getCMSFields();
    }
}
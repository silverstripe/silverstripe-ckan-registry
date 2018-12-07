<?php

namespace SilverStripe\CKANRegistry\Model;

use InvalidArgumentException;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\ListboxField;
use SilverStripe\Forms\TextField;
use SilverStripe\i18n\i18n;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\ValidationResult;

/**
 * Represents a filter for a data resource, which accepts user inputted data and generates a query string (?key=value)
 * to use in a request against a CKAN API for that particular resource in order to filter the results shown in a
 * representation of that data.
 */
class ResourceFilter extends DataObject
{
    /**
     * Types of FormFields that a filter could display as on the user facing side. Generally a list of
     * {@see SilverStripe\Forms\FormField} mapped to human readable identifiers such as would be passed to a
     * {@see DropDownField} as the source constructor parameter
     *
     * @config
     * @var array
     */
    private static $filter_types = [
        TextField::class => 'Text',
        DropdownField::class => 'Select one from list',
    ];

    private static $table_name = 'CKANFilter';

    private static $db = [
        'Name' => 'Varchar',
        'Type' => 'Varchar',
        'AllFields' => 'Boolean',
        'TypeOptions' => 'Text',
    ];

    private static $has_one = [
        'FilterFor' => Resource::class,
    ];

    private static $many_many = [
        'FilterFields' => ResourceField::class,
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();
        $typeTitle = $fields->dataFieldByName('Type')->Title();
        $fields->replaceField('Type', DropdownField::create(
            'Type',
            $typeTitle,
            $this->config()->get('filter_types')
        ));
        $fields->replaceField('TypeOptions', HiddenField::create('TypeOptions'));
        $fields->push(ListboxField::create(
            'FilterFields',
            'Columns to search',
            $this->FilterFor()->Fields()->map('ID', 'ReadableName')
        ));
        $fields->removeByName('FilterForID');
        return $fields;
    }

    public function forTemplate()
    {
        $options = json_decode($this->TypeOptions, true);
        $field = Injector::inst()->createWithArgs($this->Type, $options);
        if ($field instanceof FormField) {
            throw new InvalidArgumentException("$this->Type is not a FormField");
        }
        return $field;
    }
}

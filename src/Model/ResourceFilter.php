<?php

namespace SilverStripe\CKANRegistry\Model;

use InvalidArgumentException;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\ListboxField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\ManyManyList;

/**
 * Represents a filter for a data resource, which accepts user inputted data and generates a query string (?key=value)
 * to use in a request against a CKAN API for that particular resource in order to filter the results shown in a
 * representation of that data.
 *
 * @method Resource FilterFor
 * @method ManyManyList FilterFields
 */
class ResourceFilter extends DataObject
{
    private static $table_name = 'CKANFilter_Text';

    private static $db = [
        'Name' => 'Varchar',
        'AllFields' => 'Boolean',
    ];

    private static $has_one = [
        'FilterFor' => Resource::class,
    ];

    private static $many_many = [
        'FilterFields' => ResourceField::class,
    ];

    private static $singular_name = 'Text Filter';

    /**
     * Defines the type of {@link FormField} that will be used to render the filter in the CMS. This is defined
     * in subclasses. Filters will render as TextFields by default.
     *
     * @var FormField
     */
    protected $fieldType = TextField::class;

    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $fields->push(ListboxField::create(
                'FilterFields',
                _t(__CLASS__ . '.ColumnsToSearch', 'Columns to search'),
                $this->FilterFor()->Fields()->map('ID', 'ReadableName')
            ));

            $fields->removeByName('FilterForID');
        });

        return parent::getCMSFields();
    }

    /**
     * {@inheritdoc}
     *
     * @throws InvalidArgumentException If the provided Type is not an instance of FormField
     */
    public function forTemplate()
    {
        $field = Injector::inst()->createWithArgs($this->fieldType, [$this->Name]);
        if (!$field instanceof FormField) {
            throw new InvalidArgumentException("$this->fieldType is not a FormField");
        }
        return $field;
    }
}

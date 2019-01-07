<?php

namespace SilverStripe\CKANRegistry\Model;

use InvalidArgumentException;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\CompositeField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\ListboxField;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\ORM\ManyManyList;

/**
 * Represents a filter for a data resource, which accepts user inputted data and generates a query string (?key=value)
 * to use in a request against a CKAN API for that particular resource in order to filter the results shown in a
 * representation of that data.
 *
 * @property string FilterLabel
 * @property bool AllColumns
 * @property int Order
 * @method Resource FilterFor
 * @method ManyManyList FilterFields
 */
class ResourceFilter extends DataObject
{
    private static $table_name = 'CKANFilter_Text';

    private static $db = [
        'FilterLabel' => 'Varchar',
        'AllColumns' => 'Boolean',
        'Order' => 'Int',
    ];

    private static $has_one = [
        'FilterFor' => Resource::class,
    ];

    private static $many_many = [
        'FilterFields' => ResourceField::class,
    ];

    private static $summary_fields = [
        'FilterLabel',
        'Type',
        'Columns',
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
            $allColumnsField = $fields->dataFieldByName('AllColumns');
            $allColumnsField->addExtraClass('ckan-columns__all-columns');
            // See https://github.com/silverstripe/silverstripe-framework/issues/8696
            $allColumnsField->setTitle(ucfirst(strtolower($allColumnsField->Title())));

            // Remove the scaffolded Filter Fields tab and the AllColumns field
            $fields->removeByName(['FilterFields', 'AllColumns']);

            // Add a composite field containing the "All columns" checkbox and the "Columns source(s)" checkbox
            $filterFields = ListboxField::create(
                'FilterFields',
                '',
                $this->FilterFor()->Fields()->map('ID', 'ReadableLabel')
            );
            $filterFields->addExtraClass('ckan-columns__filter-fields');

            $columnSources = CompositeField::create($allColumnsField, $filterFields);
            $columnSources
                ->setTitle(_t(__CLASS__ . '.COLUMNS_SOURCES', 'Columns source(s)'))
                ->addExtraClass('ckan-columns__sources');
            $fields->push($columnSources);

            // See https://github.com/silverstripe/silverstripe-framework/issues/8696
            $filterLabel = $fields->dataFieldByName('FilterLabel');
            $filterLabel->setTitle(ucfirst(strtolower($filterLabel->Title())));

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

    /**
     * Returns the type of the filter, used for summary fields
     *
     * @return string
     */
    public function getType()
    {
        return $this->singular_name();
    }

    /**
     * Returns either the selected column's readable label value, or a fixed string representing multiple columns
     * having been selected.
     *
     * @return string|DBField
     */
    public function getColumns()
    {
        if ($this->AllColumns) {
            return DBField::create_Field(
                'HTMLFragment',
                '<span class="ckan-columns--all-columns">'
                . _t(__CLASS__ . '.ALL_COLUMNS', 'All columns')
                . '</span>'
            );
        }

        if (!$this->FilterFields()->count()) {
            return '';
        }

        if ($this->FilterFields()->count() === 1) {
            return (string) $this->FilterFields()->first()->ReadableLabel;
        }

        return DBField::create_Field(
            'HTMLFragment',
            '<span class="ckan-columns--multiple">'
            . _t(__CLASS__ . '.MULTIPLE_COLUMNS', 'Multiple columns')
            . '</span>'
        );
    }
}

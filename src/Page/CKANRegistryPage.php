<?php

namespace SilverStripe\CKANRegistry\Page;

use Page;
use SilverStripe\CKANRegistry\Forms\ResourceLocatorField;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldAddExistingAutocompleter;
use SilverStripe\Forms\GridField\GridFieldAddNewButton;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\TextField;
use Symbiote\GridFieldExtensions\GridFieldAddNewMultiClass;
use Symbiote\GridFieldExtensions\GridFieldOrderableRows;

/**
 * A CKANRegistryPage will render a chosen CKAN data set on the frontend, provide the user with configurable filters
 * and display a set of CMS configured columns.
 *
 * @method Resource DataResource
 */
class CKANRegistryPage extends Page
{
    private static $table_name = 'CKANRegistryPage';

    private static $db = [
        'ItemsPerPage' => 'Int',
    ];

    private static $has_one = [
        'DataResource' => Resource::class,
    ];

    private static $defaults = [
        'ItemsPerPage' => 20,
    ];

    private static $singular_name = 'CKAN Registry Page';

    private static $plural_name = 'CKAN Registry Pages';

    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $resource = $this->DataResource();
            $fields->addFieldToTab('Root.Data', ResourceLocatorField::create('DataResource'));

            if ($resource && $resource->Identifier) {
                $injector = Injector::inst();

                $columnsConfig = GridFieldConfig_RecordEditor::create()
                    ->addComponent($injector->createWithArgs(GridFieldOrderableRows::class, ['Order']));
                $resourceFields = GridField::create('DataColumns', 'Columns', $resource->Fields(), $columnsConfig);
                $fields->addFieldToTab('Root.Data', $resourceFields);

                $filtersConfig = GridFieldConfig_RecordEditor::create();
                $filtersConfig->removeComponentsByType([
                    GridFieldAddExistingAutocompleter::class,
                    GridFieldAddNewButton::class
                ])
                    ->addComponents([
                        $injector->create(GridFieldAddNewMultiClass::class),
                        $injector->createWithArgs(GridFieldOrderableRows::class, ['Order']),
                    ]);
                $resourceFilters = GridField::create('DataFilters', 'Filters', $resource->Filters(), $filtersConfig);
                $fields->addFieldToTab('Root.Filters', $resourceFilters);
            }
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

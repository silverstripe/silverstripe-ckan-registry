<?php

namespace SilverStripe\CKANRegistry\Page;

use Page;
use SilverStripe\CKANRegistry\Forms\GridField\GridFieldDetailForm\ResourceFieldItemRequest;
use SilverStripe\CKANRegistry\Forms\GridFieldResourceTitle;
use SilverStripe\CKANRegistry\Forms\ResourceLocatorField;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldAddExistingAutocompleter;
use SilverStripe\Forms\GridField\GridFieldAddNewButton;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\GridField\GridFieldDataColumns;
use SilverStripe\Forms\GridField\GridFieldDeleteAction;
use SilverStripe\Forms\GridField\GridFieldDetailForm;
use SilverStripe\Forms\GridField\GridFieldPageCount;
use SilverStripe\Forms\GridField\GridFieldToolbarHeader;
use SilverStripe\Forms\TextField;
use Symbiote\GridFieldExtensions\GridFieldAddNewMultiClass;
use Symbiote\GridFieldExtensions\GridFieldEditableColumns;
use Symbiote\GridFieldExtensions\GridFieldOrderableRows;

/**
 * A CKANRegistryPage will render a chosen CKAN data set on the frontend, provide the user with configurable filters
 * and display a set of CMS configured columns.
 *
 * @method Resource DataResource
 * @property  Resource DataResource
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

    private static $icon_class = 'font-icon-p-data';

    private static $description = 'Display a data set from a CKAN resource';

    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $resource = $this->DataResource();

            $fields->addFieldToTab(
                'Root.Data',
                ResourceLocatorField::create('DataResource')
                    ->addExtraClass('form-field--no-divider')
            );

            if ($resource && $resource->Identifier) {
                $injector = Injector::inst();

                $columnsConfig = GridFieldConfig_RecordEditor::create()
                    ->addComponents([
                        $injector->createWithArgs(GridFieldOrderableRows::class, ['Position']),
                        $injector->createWithArgs(GridFieldResourceTitle::class, [$resource]),
                    ])
                    ->removeComponentsByType([
                        GridFieldAddNewButton::class,
                        GridFieldDeleteAction::class,
                        GridFieldPageCount::class,
                        GridFieldToolbarHeader::class,
                    ]);

                $columnsConfig->getComponentByType(GridFieldDetailForm::class)
                    ->setItemRequestClass(ResourceFieldItemRequest::class);

                $resourceFields = GridField::create('DataColumns', '', $resource->Fields(), $columnsConfig);
                $resourceFields->addExtraClass('ckan-columns');

                $resourceFields->setReadonlyComponents(array_merge(
                    $resourceFields->getReadonlyComponents(),
                    [GridFieldResourceTitle::class]
                ));

                // Configure inline editable checkboxes for the two boolean fields
                $before = null;
                $editableColumns = $injector->create(GridFieldEditableColumns::class);
                foreach ($columnsConfig->getComponents() as $component) {
                    if ($before !== null) {
                        $before = $component;
                        break;
                    }
                    if ($component instanceof GridFieldDataColumns) {
                        $before = false;
                        $columns = $component->getDisplayFields($resourceFields);

                        // We only want to change the labels for the GridField view, not the model's edit form
                        $columns['ShowInResultsView'] = _t(__CLASS__ . '.IN_RESULTS', 'In Results');
                        $columns['ShowInDetailView'] = _t(__CLASS__ . '.IN_DETAIL', 'In Detail');

                        // Abbreviate the position title
                        $columns['Position'] = _t(__CLASS__ . '.POS', 'Pos.', 'Abbreviated version of position');

                        $editable = array_flip(['ShowInResultsView', 'ShowInDetailView']);
                        $component->setDisplayFields(array_diff_key($columns ?? [], $editable));
                        // set this way so that title translations are preserved
                        $editableColumns->setDisplayFields(array_intersect_key($columns ?? [], $editable));
                    }
                }
                $columnsConfig->addComponent($editableColumns, $before);
                $fields->addFieldToTab('Root.Data', $resourceFields);

                $filtersConfig = GridFieldConfig_RecordEditor::create();
                $filtersConfig
                    ->removeComponentsByType([
                        GridFieldAddExistingAutocompleter::class,
                        GridFieldAddNewButton::class
                    ])
                    ->addComponents([
                        $injector->create(GridFieldAddNewMultiClass::class),
                        $injector->createWithArgs(GridFieldOrderableRows::class, ['Order']),
                    ]);

                $resourceFilters = GridField::create('DataFilters', '', $resource->Filters(), $filtersConfig);
                $resourceFilters->addExtraClass('ckan-filters');

                $fields->addFieldToTab('Root.Filters', $resourceFilters);
            }
        });

        return parent::getCMSFields();
    }

    public function getSettingsFields()
    {
        $fields = parent::getSettingsFields();

        $fields->addFieldsToTab('Root.Settings', [
            TextField::create('ItemsPerPage', _t(__CLASS__ . '.ITEMS_PER_PAGE', 'Items per page')),
        ]);

        return $fields;
    }
}

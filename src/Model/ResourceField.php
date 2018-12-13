<?php

namespace SilverStripe\CKANRegistry\Model;

use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\ORM\DataObject;

/**
 * Represents a generic field on a CKAN Resource, e.g. a column in a spreadsheet.
 * It is intentionally generic, as the resource may not be a tabular one, e.g. geospatal data to be rendered in a map.
 *
 * @method Resource Resource
 * @method static ResourceField create()
 * @property string Name
 * @property string Type
 * @property string ReadableName
 * @property bool ShowInSummaryView
 * @property bool ShowInDetailView
 * @property bool RemoveDuplicates
 * @property int Order
 * @property string DisplayConditions
 */
class ResourceField extends DataObject
{
    private static $table_name = 'CKANResourceField';

    private static $db = [
        'Name' => 'Varchar',
        'Type' => 'Varchar',
        'ReadableName' => 'Varchar',
        'ShowInSummaryView' => 'Boolean',
        'ShowInDetailView' => 'Boolean',
        'RemoveDuplicates' => 'Boolean',
        'Order' => 'Int',
        'DisplayConditions' => 'Text',
    ];

    private static $has_one = [
        'Resource' => Resource::class,
    ];

    private static $summary_fields = [
        'Order',
        'ReadableName',
        'Name',
        'Type',
        'ShowInSummaryView',
        'ShowInDetailView',
    ];

    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $fields->removeByName('Name');

            $fields->removeByName('Type');
            $fields->dataFieldByName('ReadableName')
                ->setAttribute('placeholder', $this->Name);

            $summary = $fields->dataFieldByName('ShowInSummaryView');
            $detail = $fields->dataFieldByName('ShowInDetailView');
            $duplicates = $fields->dataFieldByName('RemoveDuplicates');

            $fields->removeByName(['ShowInSummaryView', 'ShowInDetailView', 'RemoveDuplicates',]);
            $fields->insertBefore(FieldGroup::create('Visibility', [$summary, $detail, $duplicates]), 'Order');

            $fields->removeByName('ResourceID');
        });
        return parent::getCMSFields();
    }
}

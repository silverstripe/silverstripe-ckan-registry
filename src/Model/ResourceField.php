<?php

namespace SilverStripe\CKANRegistry\Model;

use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\i18n\i18n;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBString;

/**
 * Represents a generic field on a CKAN Resource, e.g. a column in a spreadsheet.
 * It is intentionally generic, as the resource may not be a tabular one, e.g. geospatal data to be rendered in a map.
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

    /**
     * Always display the 'ReadableName' unless it's unset, then display the name that is returned by CKAN
     * @return string|DBString
     */
    public function getReadableName()
    {
        return $this->getField('ReadableName') ?: $this->Name;
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

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
        return $fields;
    }
}

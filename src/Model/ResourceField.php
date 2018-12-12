<?php

namespace SilverStripe\CKANRegistry\Model;

use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBString;

/**
 * Represents a generic field on a CKAN Resource, e.g. a column in a spreadsheet.
 * It is intentionally generic, as the resource may not be a tabular one, e.g. geospatal data to be rendered in a map.
 *
 * @method Resource Resource
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

    public function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if (empty($this->ReadableName) && !empty($this->Name)) {
            $this->generateReadableName();
        }
    }

    /**
     * Generate a readable name from the Name
     *
     * @return $this
     */
    protected function generateReadableName()
    {
        $readableName = str_replace(['_', '-'], ' ', $this->Name);
        $readableName = ucfirst(strtolower($readableName));
        $this->ReadableName = $readableName;
        return $this;
    }
}

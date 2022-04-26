<?php

namespace SilverStripe\CKANRegistry\Model;

use SilverStripe\CKANRegistry\Forms\ResultConditionsField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\ORM\DataObject;

/**
 * Represents a generic field on a CKAN Resource, e.g. a column in a spreadsheet.
 * It is intentionally generic, as the resource may not be a tabular one, e.g. geospatial data to be rendered in a map.
 *
 * @property Resource Resource
 * @method static ResourceField create()
 * @property string OriginalLabel
 * @property string Type
 * @property string ReadableLabel
 * @property bool ShowInResultsView
 * @property bool ShowInDetailView
 * @property bool RemoveDuplicates
 * @property int Position
 * @property string DisplayConditions
 */
class ResourceField extends DataObject
{
    private static $table_name = 'CKANResourceField';

    private static $db = [
        'OriginalLabel' => 'Varchar',
        'Type' => 'Varchar',
        'ReadableLabel' => 'Varchar',
        'ShowInResultsView' => 'Boolean',
        'ShowInDetailView' => 'Boolean(1)',
        'RemoveDuplicates' => 'Boolean',
        'Position' => 'Int',
        'DisplayConditions' => 'Text',
    ];

    private static $has_one = [
        'Resource' => Resource::class,
    ];

    private static $summary_fields = [
        'Position',
        'ReadableLabel',
        'OriginalLabel',
        'Type',
        'ShowInResultsView',
        'ShowInDetailView',
    ];

    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $originalLabel = ReadonlyField::create('OriginalLabel')
                ->setDescription(_t(
                    __CLASS__ . '.ORIGINAL_LABEL_DESCRIPTION',
                    'Title of this field as provided by the CKAN resource'
                ));
            $fields->replaceField('OriginalLabel', $originalLabel);

            $readableLabel = $fields->dataFieldByName('ReadableLabel');
            $readableLabel->setAttribute('placeholder', $this->OriginalLabel);

            $fields->removeByName('Type');

            $positionField = NumericField::create('Position')
                ->setTitle(_t(__CLASS__ . '.ORDER_LABEL', 'Presented order'))
                ->setDescription(_t(
                    __CLASS__ . '.ORDER_DENOMINATOR',
                    'of {count} columns',
                    ['count' => static::get()->filter('ResourceID', $this->ResourceID)->count()]
                ))
                ->addExtraClass('ckan-resource__order');
            $fields->replaceField('Position', $positionField);

            $summary = $fields->dataFieldByName('ShowInResultsView')
                ->addExtraClass('visibility-options__option');
            $detail = $fields->dataFieldByName('ShowInDetailView')
                ->addExtraClass('visibility-options__option');
            $duplicates = $fields->dataFieldByName('RemoveDuplicates')
                ->setTitle(
                    _t(__CLASS__ . '.REMOVE_DUPLICATES_LABEL', 'Only show one value if duplicates exist')
                )
                ->addExtraClass('visibility-options__option');

            // Present the visibility fields in a group
            $fields->removeByName(['ShowInResultsView', 'ShowInDetailView', 'RemoveDuplicates']);
            $visibilityOptions = FieldGroup::create('Visibility', [$summary, $detail, $duplicates])
                ->addExtraClass('visibility-options');
            $fields->insertBefore($visibilityOptions, 'Position');

            $fields->removeByName('ResourceID');

            $fields->replaceField(
                'DisplayConditions',
                ResultConditionsField::create(
                    'DisplayConditions',
                    _t(__CLASS__ . '.RESULT_CONDITIONS', 'Result conditions')
                )
            );

            // See https://github.com/silverstripe/silverstripe-framework/issues/8696
            foreach ([$summary, $detail, $readableLabel, $originalLabel] as $field) {
                $field->setTitle(ucfirst(strtolower($field->Title() ?? '')));
            }
        });
        return parent::getCMSFields();
    }

    /**
     * Use the readable label for GridField CRUD operation result messages
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->ReadableLabel;
    }
}

<?php

namespace SilverStripe\CKANRegistry\Model;

use SilverStripe\CKANRegistry\Forms\ResultConditionsField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\i18n\i18n;
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
            $originalTitle = ReadonlyField::create('Name', i18n::_t(
                __CLASS__ . '.ORIGINAL_TITLE',
                'Original title'
            ))->setDescription(i18n::_t(
                __CLASS__ . '.ORIGINAL_TITLE_DESCRIPTION',
                'Title of this field as provided by the CKAN resource'
            ));
            $fields->replaceField('Name', $originalTitle);

            $fields->removeByName('Type');
            $fields->dataFieldByName('ReadableName')
                ->setAttribute('placeholder', $this->Name);
            $orderField = NumericField::create('Order')
                ->setTitle(i18n::_t(__CLASS__ . '.ORDER_LABEL', 'Presented order'))
                ->setDescription(i18n::_t(
                    __CLASS__ . '.ORDER_DENOMINATOR',
                    'of {count} fields',
                    ['count' => static::get()->filter('ResourceID', $this->ResourceID)->count()]
                ))
                ->addExtraClass('ckan-resource__order');
            $fields->replaceField('Order', $orderField);

            $summary = $fields->dataFieldByName('ShowInSummaryView')
                ->addExtraClass('visibility-options__option');
            $detail = $fields->dataFieldByName('ShowInDetailView')
                ->addExtraClass('visibility-options__option');
            $duplicates = $fields->dataFieldByName('RemoveDuplicates')
                ->addExtraClass('visibility-options__option');

            $fields->removeByName(['ShowInSummaryView', 'ShowInDetailView', 'RemoveDuplicates',]);
            $visibilityOptions = FieldGroup::create('Visibility', [$summary, $detail, $duplicates])
                ->addExtraClass('visibility-options');
            $fields->insertBefore($visibilityOptions, 'Order');

            $fields->removeByName('ResourceID');

            $fields->replaceField(
                'DisplayConditions',
                ResultConditionsField::create(
                    'DisplayConditions',
                    i18n::_t(__CLASS__ . '.RESULT_CONDITIONS', 'Result conditions')
                )
            );
        });
        return parent::getCMSFields();
    }
}

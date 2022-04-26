<?php

namespace SilverStripe\CKANRegistry\Model\ResourceFilter;

use InvalidArgumentException;
use SilverStripe\CKANRegistry\Forms\PresentedOptionsField;
use SilverStripe\CKANRegistry\Model\ResourceFilter;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;

/**
 * Provides a single select option for CKAN resources to be filtered by
 */
class Dropdown extends ResourceFilter
{
    private static $db = [
        'Options' => 'Text', // JSON blob
    ];

    private static $table_name = 'CKANFilter_Dropdown';

    private static $singular_name = 'Dropdown';

    protected $fieldType = DropdownField::class;

    public function getCMSFields()
    {
        $this->beforeUpdateCMSFields(function (FieldList $fields) {
            $fields->addFieldToTab('Root.Main', PresentedOptionsField::create(
                'Options',
                $this->FilterFor,
                _t(__CLASS__ . '.OPTIONS', 'Presented options')
            ));
        });

        return parent::getCMSFields();
    }

    public function getClientConfig()
    {
        $config = parent::getClientConfig();

        try {
            $config['options'] = $this->getConfiguredOptions();
        } catch (InvalidArgumentException $e) {
            $config['options'] = [];
        }

        return $config;
    }

    /**
     * Get the options that have been configured for this dropdown by the CMS author. ie. parse the "Options" value
     *
     * @throws InvalidArgumentException When the configured "selectType" is unknown
     */
    protected function getConfiguredOptions()
    {
        $spec = json_decode($this->Options ?? '', true) ?: [];

        if (!isset($spec['selectType'])) {
            return [];
        }

        $selectType = (int) $spec['selectType'];

        if ($selectType === PresentedOptionsField::SELECT_TYPE_ALL) {
            return $spec['selections'];
        }
        if ($selectType === PresentedOptionsField::SELECT_TYPE_CUSTOM) {
            return $spec['customOptions'];
        }

        throw new InvalidArgumentException('Unknown "selectType" is configured for ' . static::class);
    }
}

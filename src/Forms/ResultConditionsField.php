<?php

namespace SilverStripe\CKANRegistry\Forms;

use SilverStripe\Forms\Form;
use SilverStripe\Forms\TextField;

/**
 * A ResultConditionsField renders a list of "must have" and "must not have" text conditions which are then used
 * to determine whether a column is displayed to frontend users.
 */
class ResultConditionsField extends TextField
{
    /**
     * @var int
     */
    public const MATCH_TYPE_MUST = 1;

    /**
     * @var int
     */
    public const MATCH_TYPE_MUST_NOT = 0;

    /**
     * @var int
     */
    public const MATCH_TYPE_DEFAULT = self::MATCH_TYPE_MUST;

    protected $schemaComponent = 'ResultConditions';

    public function __construct($name, $title = null, $value = '', $maxLength = null, Form $form = null)
    {
        parent::__construct($name, $title, $value, $maxLength, $form);

        $this->addExtraClass('ckan-result-conditions__container');
    }

    public function Type()
    {
        return 'ckan-result-conditions';
    }

    public function performReadonlyTransformation()
    {
        // If we have no value then defer to the parent that renders a "none" field
        $value = trim($this->Value() ?? '');
        if (empty($value)) {
            return parent::performReadonlyTransformation();
        }

        return clone $this->setReadonly(true);
    }

    public function getSchemaDataDefaults()
    {
        $data = parent::getSchemaDataDefaults();
        $data['data']['source'] = static::getMatchOptions();
        $data['data']['matchTypeDefault'] = self::MATCH_TYPE_DEFAULT;
        return $data;
    }

    /**
     * Get a list of options for filtering with a human readable (translated) label
     *
     * @return array[]
     */
    public static function getMatchOptions()
    {
        return [
            ['value' => self::MATCH_TYPE_MUST, 'title' => _t(__CLASS__ . '.MUST_MATCH', 'Must match')],
            ['value' => self::MATCH_TYPE_MUST_NOT, 'title' => _t(__CLASS__ . '.MUST_NOT_MATCH', 'Must not match')],
        ];
    }
}

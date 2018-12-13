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
    const MATCH_TYPE_MUST = 1;

    /**
     * @var int
     */
    const MATCH_TYPE_MUST_NOT = 0;

    /**
     * @var int
     */
    const MATCH_TYPE_DEFAULT = self::MATCH_TYPE_MUST;

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

    /**
     * Return the match condition
     *
     * @returns string
     */
    public function getMatchCondition()
    {
        $value = json_decode($this->Value(), true);
        return isset($value['match-select']) ? $value['match-select'] : self::MATCH_TYPE_DEFAULT;
    }

    /**
     * Return the condition's text to match against
     *
     * @return string
     */
    public function getMatchText()
    {
        $value = json_decode($this->Value(), true);
        return isset($value['match-text']) ? $value['match-text'] : '';
    }
}

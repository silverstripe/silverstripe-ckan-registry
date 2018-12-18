<?php

namespace SilverStripe\CKANRegistry\Forms;

use SilverStripe\Forms\Form;
use SilverStripe\Forms\TextField;

/**
 * A PresentedOptionsField renders either a list of options that can be chosen for a {@link DropdownFilter}, or
 * a text area allowing free text entry per line.
 *
 * The values of these options are serialised and saved as JSON.
 */
class PresentedOptionsField extends TextField
{
    /**
     * @var int
     */
    const SELECT_TYPE_ALL = 0;

    /**
     * @var int
     */
    const SELECT_TYPE_CUSTOM = 1;

    /**
     * @var int
     */
    const SELECT_TYPE_DEFAULT = self::SELECT_TYPE_ALL;

    protected $schemaComponent = 'PresentedOptions';

    public function __construct($name, $title = null, $value = '', $maxLength = null, Form $form = null)
    {
        parent::__construct($name, $title, $value, $maxLength, $form);

        $this->addExtraClass('ckan-presented-options__container');
    }

    public function Type()
    {
        return 'ckan-presented-options';
    }

    public function getSchemaDataDefaults()
    {
        $data = parent::getSchemaDataDefaults();
        $data['data']['options'] = self::getOptions();
        $data['data']['selectTypeDefault'] = self::SELECT_TYPE_DEFAULT;
        $data['data']['selectTypes'] = self::getSelectTypes();
        return $data;
    }

    /**
     * Get a list of options for filtering with a human readable (translated) label
     *
     * @return array[]
     */
    public static function getSelectTypes()
    {
        return [
            ['value' => self::SELECT_TYPE_ALL, 'title' => _t(__CLASS__ . '.SELECT_ALL', 'Select from all options')],
            ['value' => self::SELECT_TYPE_CUSTOM, 'title' => _t(__CLASS__ . '.SELECT_CUSTOM', 'Manually add options')],
        ];
    }

    /**
     * @todo remove mock data
     */
    public static function getOptions()
    {
        return [
            'One-by-one',
            'Group session',
            'Phone',
            'Helpline',
            'Other',
            'Something scrollable',
        ];
    }
}

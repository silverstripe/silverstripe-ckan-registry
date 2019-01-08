<?php

namespace SilverStripe\CKANRegistry\Tests\Model\ResourceFilter;

use SilverStripe\CKANRegistry\Model\ResourceFilter\Dropdown;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\TextField;

class DropdownTest extends SapphireTest
{
    protected $usesDatabase = true;

    public function testGetCMSFields()
    {
        $field = new Dropdown();
        $fields = $field->getCMSFields();

        $this->assertInstanceOf(
            TextField::class,
            $fields->dataFieldByName('Options'),
            'Options field should exist'
        );
    }

    public function testGetType()
    {
        $field = new Dropdown();
        $this->assertSame('Dropdown', $field->getType());
    }
}

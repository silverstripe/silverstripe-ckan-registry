<?php

namespace SilverStripe\CKANRegistry\Tests\Model;

use SilverStripe\CKANRegistry\Forms\ResultConditionsField;
use SilverStripe\CKANRegistry\Model\ResourceField;
use SilverStripe\Dev\SapphireTest;

class ResourceFieldTest extends SapphireTest
{
    protected $usesDatabase = true;

    public function testDisplayConditionsAreRenderedAsResultConditionsField()
    {
        $field = new ResourceField();
        $fields = $field->getCMSFields();

        $field = $fields->dataFieldByName('DisplayConditions');
        $this->assertNotNull($field, 'DisplayConditions field was not scaffolded');
        $this->assertInstanceOf(
            ResultConditionsField::class,
            $field,
            'DisplayConditions should be rendered as a ResultConditionsField'
        );
    }

    public function testTitleShouldBeFilterLabel()
    {
        $field = new ResourceField();
        $field->ReadableLabel = 'My field name';
        $this->assertSame('My field name', $field->getTitle());
    }
}

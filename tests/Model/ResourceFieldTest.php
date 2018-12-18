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
        $fields = (new ResourceField)->getCMSFields();

        $field = $fields->dataFieldByName('DisplayConditions');
        $this->assertNotNull($field, 'DisplayConditions field was not scaffolded');
        $this->assertInstanceOf(
            ResultConditionsField::class,
            $field,
            'DisplayConditions should be rendered as a ResultConditionsField'
        );
    }
}

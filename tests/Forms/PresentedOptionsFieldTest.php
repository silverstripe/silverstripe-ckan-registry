<?php

namespace SilverStripe\CKANRegistry\Tests\Forms;

use SilverStripe\CKANRegistry\Forms\PresentedOptionsField;
use SilverStripe\Dev\SapphireTest;

class PresentedOptionsFieldTest extends SapphireTest
{
    public function testConstruct()
    {
        $field = new PresentedOptionsField('my-field');
        $this->assertTrue(
            $field->hasClass('ckan-presented-options__container'),
            'Necessary class name for React binding is missing'
        );
    }
}

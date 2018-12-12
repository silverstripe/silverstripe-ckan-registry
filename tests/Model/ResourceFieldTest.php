<?php

namespace SilverStripe\CKANRegistry\Tests\Model;

use SilverStripe\CKANRegistry\Model\ResourceField;
use SilverStripe\Dev\SapphireTest;

class ResourceFieldTest extends SapphireTest
{
    protected $usesDatabase = true;

    public function testReadableName()
    {
        $field = new ResourceField();
        $field->Name = 'Teachers_In-mY-Country';
        $field->write();

        $this->assertSame(
            'Teachers in my country',
            $field->ReadableName,
            'Readable name should be generated on write'
        );

        $field->Name = 'Some-new_Name';
        $field->write();

        $this->assertSame(
            'Teachers in my country',
            $field->ReadableName,
            'Readable name should not be changed automatically once it is set'
        );
    }
}

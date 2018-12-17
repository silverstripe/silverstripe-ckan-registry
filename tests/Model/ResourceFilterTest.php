<?php

namespace SilverStripe\CKANRegistry\Tests\Model;

use InvalidArgumentException;
use SilverStripe\CKANRegistry\Model\ResourceFilter;
use SilverStripe\Dev\SapphireTest;

class ResourceFilterTest extends SapphireTest
{
    protected $usesDatabase = true;

    /**
     * @expectedException InvalidArgumentException
     * @expectedExceptionMessage SilverStripe\Control\HTTPResponse is not a FormField
     */
    public function testForTemplateThrowsExceptionWithNonFormFieldType()
    {
        $filter = new ResourceFilterTest\InvalidResourceFilter();
        $filter->forTemplate();
    }

    public function testGetType()
    {
        $filter = new ResourceFilter();
        $this->assertSame('Text Filter', $filter->getType());
    }

    public function testGetCMSFields()
    {
        $filter = new ResourceFilter();
        $fields = $filter->getCMSFields();

        $this->assertNull($fields->dataFieldByName('FilterForID'), 'FilterForID should be removed');
    }
}

<?php

namespace SilverStripe\CKANRegistry\Tests\Model;

use InvalidArgumentException;
use SilverStripe\Dev\SapphireTest;

class ResourceFilterTest extends SapphireTest
{
    /**
     * @expectedException InvalidArgumentException
     * @expectedExceptionMessage SilverStripe\Control\HTTPResponse is not a FormField
     */
    public function testForTemplateThrowsExceptionWithNonFormFieldType()
    {
        $filter = new ResourceFilterTest\InvalidResourceFilter();
        $filter->forTemplate();
    }
}

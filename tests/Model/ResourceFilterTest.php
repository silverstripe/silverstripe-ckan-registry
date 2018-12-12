<?php

namespace SilverStripe\CKANRegistry\Tests\Model;

use InvalidArgumentException;
use SilverStripe\CKANRegistry\Model\ResourceFilter;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Dev\SapphireTest;

class ResourceFilterTest extends SapphireTest
{
    /**
     * @expectedException InvalidArgumentException
     * @expectedExceptionMessage SilverStripe\Control\HTTPResponse is not a FormField
     */
    public function testForTemplateThrowsExceptionWithNonFormFieldType()
    {
        $filter = new ResourceFilter();
        $filter->TypeOptions = '{}';
        $filter->Type = 'SilverStripe\\Control\\HTTPResponse';
        $filter->forTemplate();
    }
}

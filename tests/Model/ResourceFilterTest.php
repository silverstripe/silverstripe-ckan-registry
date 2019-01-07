<?php

namespace SilverStripe\CKANRegistry\Tests\Model;

use InvalidArgumentException;
use SilverStripe\CKANRegistry\Model\ResourceField;
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

    public function testGetColumnsNoFields()
    {
        $filter = new ResourceFilter();
        $this->assertEmpty($filter->getColumns(), 'Should return an empty string without fields');
    }

    public function testGetColumnsOneField()
    {
        $filter = new ResourceFilter();
        $field = new ResourceField();
        $field->ReadableLabel = 'My field';
        $filter->FilterFields()->add($field);

        $this->assertSame('My field', $filter->getColumns(), 'Should return the single field name');
    }

    public function testGetColumnsMultipleFields()
    {
        $filter = new ResourceFilter();

        $field = new ResourceField();
        $filter->FilterFields()->add($field);

        $field2 = new ResourceField();
        $filter->FilterFields()->add($field2);

        $this->assertContains('Multiple columns', $filter->getColumns(), 'Should return "multiple columns"');
    }

    public function testGetColumnsAllColumns()
    {
        $filter = new ResourceFilter();
        $filter->AllColumns = true;

        $this->assertContains('All columns', $filter->getColumns(), 'Should return "all columns"');
    }
}

<?php

namespace SilverStripe\CKANRegistry\Tests\Forms;

use InvalidArgumentException;
use SilverStripe\CKANRegistry\Forms\ResourceLocatorField;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Page\CKANRegistryPage;
use SilverStripe\CKANRegistry\Service\ResourcePopulatorInterface;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;
use stdClass;

class ResourceLocatorFieldTest extends SapphireTest
{
    protected $usesDatabase = true;

    /**
     * @var ResourceLocatorField
     */
    protected $field;

    protected function setUp()
    {
        parent::setUp();

        $this->field = new ResourceLocatorField('my-field');

        $this->field
            ->setEndpointFieldName('Endpoint')
            ->setDatasetFieldName('DataSet')
            ->setResourceFieldName('Identifier');

        // Mock the field populator, in case an action we perform in a unit test tries to contact the mock API
        $populator = $this->createMock(ResourcePopulatorInterface::class);
        Injector::inst()->registerService($populator, ResourcePopulatorInterface::class);
    }

    public function testConstruct()
    {
        $field = new ResourceLocatorField('my-field', 'My field', null, 'http://example.com');

        $this->assertSame('http://example.com', $field->getDefaultEndpoint());
        $this->assertContains('Connect to a data source from', $field->getDescription());
    }

    public function testSetValueWithArray()
    {
        $this->field->setValue(['foo' => 'bar']);
        $this->assertSame(['foo' => 'bar'], $this->field->Value(), 'Array values should pass through');
    }

    public function testSetValueWithNonDataObject()
    {
        $value = new stdClass();
        $value->foo = 'bar';
        $this->field->setValue($value);

        $this->assertNull($this->field->Value(), 'Non DataObject instances should set a null value');
    }

    public function testSetValueWithNoDataSet()
    {
        $this->field
            ->setDatasetFieldName('NonExistentField')
            ->setValue($this->getResource());

        $this->assertNull($this->field->Value(), 'Missing data sets should set a null value');
    }

    public function testSetValueWithNoEndpointFallsBackToDefaultEndpoint()
    {
        $this->field
            ->setEndpointFieldName('NonExistentField')
            ->setDefaultEndpoint('http://example.com')
            ->setValue($this->getResource());

        $this->assertContains(
            'http://example.com',
            $this->field->Value(),
            'Missing endpoint data on the model should fall back to the configured default endpoint'
        );
    }

    public function testSetValueWithNoEndpointAndNoDefaultReturnsNull()
    {
        ResourceLocatorField::config()->set('default_endpoint', '');

        $this->field
            ->setEndpointFieldName('NonExistentField')
            ->setDefaultEndpoint(null)
            ->setValue($this->getResource());

        $this->assertNull(
            $this->field->Value(),
            'Missing endpoint data on the model, and missing default endpoint should return null'
        );
    }

    public function testSetValueWithExpectedDataStructure()
    {
        $this->field->setValue($this->getResource());
        $result = $this->field->Value();

        $this->assertContains('http://example.com', $result);
        $this->assertContains('foo-bar', $result);
        $this->assertContains('123-456', $result);
    }

    public function testSetSubmittedValue()
    {
        $value = json_encode([
            'endpoint' => 'https://www.silverstripe.org',
            'dataset' => 'monkeys',
            'resource' => 'feeding',
        ]);
        $this->field->setSubmittedValue($value);

        $this->assertContains('https://www.silverstripe.org', $this->field->Value());
    }

    public function testDataValue()
    {
        $this->field->setValue($this->getResource());
        $result = $this->field->dataValue();

        $this->assertJson($result, 'dataValue() should return JSON');
        $this->assertContains('foo-bar', $result, 'Serialised result should contain value');
    }

    public function testSaveIntoWithNoNameReturnsEarly()
    {
        $this->field->setName(null);
        $this->assertNull($this->field->saveInto($this->getPage()));
    }

    /**
     * @expectedException InvalidArgumentException
     * @expectedExceptionMessageRegExp /Could not determine where to save the value of/
     */
    public function testSaveIntoWithInvalidRelationshipNameThrowsException()
    {
        $this->field->setName('UnicornRelationship');
        $this->field->saveInto($this->getPage());
    }

    public function testSaveIntoSetsRelationshipFields()
    {
        $page = $this->getPage();
        $this->field->setName('DataResource');
        $this->field->setValue($this->getResource());
        $this->field->saveInto($page);

        $this->assertNotEmpty($page->DataResourceID);
        $this->assertSame('http://example.com', $page->DataResource()->Endpoint);
        $this->assertSame('foo-bar', $page->DataResource()->DataSet);
        $this->assertSame('123-456', $page->DataResource()->Identifier);
    }

    public function testDefaultEndpointUsesConfigIfNotProvided()
    {
        $this->field->setDefaultEndpoint('foo');
        $this->assertSame('foo', $this->field->getDefaultEndpoint());

        $this->field->setDefaultEndpoint(null);
        ResourceLocatorField::config()->set('default_endpoint', 'bar');
        $this->assertSame('bar', $this->field->getDefaultEndpoint());
    }

    public function testSiteNameUsesTranslatedDefaultIfNotProvided()
    {
        $this->field->setSiteName('My cool website');
        $this->assertSame('My cool website', $this->field->getSiteName());

        $this->field->setSiteName(null);
        $this->assertSame('a CKAN website', $this->field->getSiteName());
    }

    /**
     * Returns a Resource object for testing values in the field
     *
     * @return Resource
     */
    protected function getResource()
    {
        $resource = new Resource();
        $resource->Endpoint = 'http://example.com';
        $resource->DataSet = 'foo-bar';
        $resource->Identifier = '123-456';
        return $resource;
    }

    /**
     * Returns a CKAN Page object for testing values in the field
     *
     * @return CKANRegistryPage
     */
    protected function getPage()
    {
        $page = new CKANRegistryPage();
        $page->Title = 'My CKAN Page';
        return $page;
    }
}

<?php

namespace SilverStripe\CKANRegistry\Tests\Service;

use PHPUnit_Framework_MockObject_MockObject;
use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Service\APIClient;
use SilverStripe\CKANRegistry\Service\ResourcePopulator;
use SilverStripe\Dev\SapphireTest;

class ResourcePopulatorTest extends SapphireTest
{
    protected $usesDatabase = true;

    /**
     * @var Resource
     */
    protected $resource;

    /**
     * @var APIClient
     */
    protected $client;

    protected function setUp()
    {
        parent::setUp();

        $this->resource = new Resource();
        $this->resource->Endpoint = 'http://example.com';
        $this->resource->DataSet = 'foo-bar';
        $this->resource->Identifier = '123-456';

        /** @var PHPUnit_Framework_MockObject_MockObject|APIClient $client */
        $this->client = $this->createMock(APIClient::class);
    }

    /**
     * @expectedException RuntimeException
     * @expectedExceptionMessage Could not fetch fields for a resource that is not fully configured
     */
    public function testThrowsExceptionWhenResourceIsNotConfigured()
    {
        $resource = new Resource();
        $populator = new ResourcePopulator();
        $populator->populateFields($resource);
    }

    public function testPopulateFields()
    {
        $this->client->expects($this->once())->method('getSearchData')->willReturn([
            'result' => [
                'fields' => [
                    [
                        'id' => 'field_a',
                        'type' => 'text',
                    ],
                    [
                        'id' => 'field_bar-^captain',
                        'type' => 'select',
                    ]
                ],
            ],
        ]);
        $populator = new ResourcePopulator();
        $populator->setAPIClient($this->client);

        $this->assertCount(0, $this->resource->Fields(), 'Resource has no fields before population');
        $populator->populateFields($this->resource);
        $this->assertCount(2, $this->resource->Fields(), 'Fields should be populated');

        // Test that the readable names were generated correctly
        $this->assertSame('Field a', $this->resource->Fields()->first()->ReadableLabel);
        $this->assertEquals(1, $this->resource->Fields()->first()->Position);
        $this->assertSame('Field bar captain', $this->resource->Fields()->last()->ReadableLabel);
        $this->assertEquals(2, $this->resource->Fields()->last()->Position);
    }

    public function testPopulateMetadata()
    {
        $this->client->expects($this->once())->method('getPackage')->willReturn([
            'result' => [
                'title' => 'List of Animals',
                'resources' => [
                    ['id' => '654-321', 'name' => 'Monkey'],
                    ['id' => '123-456', 'name' => 'Giraffe'],
                    ['id' => '987-342', 'name' => 'Horse'],
                ],
            ],
        ]);
        $populator = new ResourcePopulator();
        $populator->setAPIClient($this->client);
        $populator->populateMetadata($this->resource);

        $this->assertSame('List of Animals', $this->resource->Name, 'DataSet name should be populated');
        $this->assertSame('Giraffe', $this->resource->ResourceName, 'Selected resource name should be populated');
    }
}

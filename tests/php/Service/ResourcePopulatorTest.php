<?php

namespace SilverStripe\CKANRegistry\Tests\Service;

use PHPUnit\Framework\MockObject\MockObject;
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

    protected function setUp(): void
    {
        parent::setUp();

        $this->resource = new Resource();
        $this->resource->Endpoint = 'http://example.com';
        $this->resource->DataSet = 'foo-bar';
        $this->resource->Identifier = '123-456';

        /** @var MockObject|APIClient $client */
        $this->client = $this->createMock(APIClient::class);
    }

    public function testThrowsExceptionWhenResourceIsNotConfigured()
    {
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Could not fetch fields for a resource that is not fully configured');
        $resource = new Resource();
        $populator = new ResourcePopulator();
        $populator->populateFields($resource);
    }

    public function testPopulateFields()
    {
        $this->client->expects($this->once())->method('getSearchData')->willReturn([
            'result' => [
                'fields' => [
                    ['id' => 'field_a', 'type' => 'text'],
                    ['id' => 'field_bar-^captain', 'type' => 'select'],
                    ['id' => 'City/Town', 'type' => 'text'],
                    ['id' => 'City / Town', 'type' => 'text'],
                ],
            ],
        ]);
        $populator = new ResourcePopulator();
        $populator->setAPIClient($this->client);

        $this->assertCount(0, $this->resource->Fields(), 'Resource has no fields before population');
        $populator->populateFields($this->resource);
        $fields = $this->resource->Fields();
        $this->assertCount(4, $fields, 'Fields should be populated');

        // Test that positions were assigned incrementally
        $this->assertEquals(1, $fields[0]->Position);
        $this->assertEquals(2, $fields[1]->Position);


        // Test that the readable names were generated correctly
        $this->assertSame('Field a', $fields[0]->ReadableLabel);
        $this->assertSame('Field bar captain', $fields[1]->ReadableLabel);
        $this->assertSame('City/town', $fields[2]->ReadableLabel);
        $this->assertSame('City/town', $fields[3]->ReadableLabel);
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

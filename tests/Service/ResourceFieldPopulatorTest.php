<?php

namespace SilverStripe\CKANRegistry\Tests\Service;

use PHPUnit_Framework_MockObject_MockObject;
use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Service\ResourceFieldPopulator;
use SilverStripe\CKANRegistry\Service\ResourceFieldPopulatorInterface;
use SilverStripe\Dev\SapphireTest;

class ResourceFieldPopulatorTest extends SapphireTest
{
    protected $usesDatabase = true;

    /**
     * @expectedException RuntimeException
     * @expectedExceptionMessage Could not fetch fields for a resource that is not fully configured
     */
    public function testThrowsExceptionWhenResourceIsNotConfigured()
    {
        $resource = new Resource();
        $populator = new ResourceFieldPopulator();
        $populator->populateFields($resource);
    }

    public function testPopulate()
    {
        $resource = new Resource();
        $resource->Endpoint = 'http://example.com';
        $resource->Identifier = '123-456';

        /** @var PHPUnit_Framework_MockObject_MockObject|ResourceFieldPopulatorInterface $populator */
        $populator = $this->getMockBuilder(ResourceFieldPopulator::class)
            ->setMethods(['doFieldRequest'])
            ->getMock();

        $populator->expects($this->once())->method('doFieldRequest')->willReturn([
            [
                'id' => 'field_a',
                'type' => 'text',
            ],
            [
                'id' => 'field_bar-^captain',
                'type' => 'select',
            ]
        ]);

        $this->assertCount(0, $resource->Fields(), 'Resource has no fields before population');
        $populator->populateFields($resource);
        $this->assertCount(2, $resource->Fields(), 'Fields should be populated');

        // Test that the readable names were generated correctly
        $this->assertSame('Field a', $resource->Fields()->first()->ReadableLabel);
        $this->assertEquals(1, $resource->Fields()->first()->Position);
        $this->assertSame('Field bar captain', $resource->Fields()->last()->ReadableLabel);
        $this->assertEquals(2, $resource->Fields()->last()->Position);
    }
}

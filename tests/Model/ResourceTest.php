<?php

namespace SilverStripe\CKANRegistry\Tests\Model;

use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Service\ResourceFieldPopulator;
use SilverStripe\CKANRegistry\Service\ResourceFieldPopulatorInterface;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;

class ResourceTest extends SapphireTest
{
    protected static $fixture_file = 'ResourceTest.yml';

    protected function setUp()
    {
        $populator = $this->createMock(ResourceFieldPopulator::class);
        Injector::inst()->registerService($populator, ResourceFieldPopulatorInterface::class);

        parent::setUp();
    }

    public function testFieldsAndFiltersAreRemovedAfterChangingIdentifier()
    {
        /** @var Resource $resource */
        $resource = $this->objFromFixture(Resource::class, 'teachers');

        $this->assertGreaterThan(0, $resource->Fields()->count(), 'Fixtures should load relationships');
        $this->assertGreaterThan(0, $resource->Filters()->count(), 'Fixtures should load relationships');

        // Change name, relationships should be retained
        $resource->Name = 'Primary Teachers';
        $resource->write();

        $this->assertGreaterThan(0, $resource->Fields()->count(), 'Changing name should not affect relations');
        $this->assertGreaterThan(0, $resource->Filters()->count(), 'Changing name should not affect relations');

        // Change identifier, relationships should be removed
        $resource->Identifier = 'something-different';
        $resource->write();

        $this->assertCount(0, $resource->Fields(), 'Changing identifier should clear fields');
        $this->assertCount(0, $resource->Filters(), 'Changing identifier should clear filters');
    }
}

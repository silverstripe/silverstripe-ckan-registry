<?php

namespace SilverStripe\CKANRegistry\Tests\Page;

use SilverStripe\CKANRegistry\Service\ResourcePopulatorInterface;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\FunctionalTest;

class CKANRegistryPageControllerFunctionalTest extends FunctionalTest
{
    protected static $fixture_file = 'CKANRegistryPageControllerTest.yml';

    protected static $use_draft_site = true;

    protected function setUp(): void
    {
        // Mock the field populator, in case an action we perform in a unit test tries to contact the mock API.
        // Done before parent::setUp() so write hooks don't run during fixture population.
        $populator = $this->createMock(ResourcePopulatorInterface::class);
        Injector::inst()->registerService($populator, ResourcePopulatorInterface::class);

        parent::setUp();
    }

    public function testGetSchemaFromPageUrl()
    {
        $response = $this->get('animal-centers/schema');

        $this->assertSame(200, $response->getStatusCode());
        $this->assertJson($response->getBody());
    }

    public function testGetSchemaFromPageSubUrl()
    {
        $response = $this->get('animal-centers/view/123/schema');

        $this->assertSame(200, $response->getStatusCode());
        $this->assertJson($response->getBody());
    }
}

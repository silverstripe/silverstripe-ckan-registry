<?php

namespace SilverStripe\CKANRegistry\Tests\Page;

use PHPUnit_Framework_MockObject_MockObject;
use SilverStripe\CKANRegistry\Page\CKANRegistryPage;
use SilverStripe\CKANRegistry\Page\CKANRegistryPageController;
use SilverStripe\CKANRegistry\Service\ResourcePopulatorInterface;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;

class CKANRegistryPageControllerTest extends SapphireTest
{
    protected static $fixture_file = 'CKANRegistryPageControllerTest.yml';

    protected function setUp()
    {
        // Mock the field populator, in case an action we perform in a unit test tries to contact the mock API.
        // Done before parent::setUp() so write hooks don't run during fixture population.
        $populator = $this->createMock(ResourcePopulatorInterface::class);
        Injector::inst()->registerService($populator, ResourcePopulatorInterface::class);

        parent::setUp();
    }

    public function testGetCKANClientConfig()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->objFromFixture(CKANRegistryPage::class, 'animal_centers');

        $controller = new CKANRegistryPageController($page);
        $config = $controller->getCKANClientConfig($page);

        $this->assertSame([
            'endpoint' => 'https://example.com/ckan',
            'dataset' => 'animal-centers',
            'identifier' => '123-456',
        ], $config['spec'], 'CKAN endpoint specification should be provided');
        $this->assertSame('Animal Centers', $config['name'], 'Name should be provided');
        $this->assertSame('Vet Clinics', $config['resourceName'], 'Resource name should be provided');
        $this->assertSame('/animal-centers', $config['basePath'], 'Without a page, basePath should be root');
    }

    public function testCKANClientConfigDecodesResultConditions()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->objFromFixture(CKANRegistryPage::class, 'animal_centers');

        $controller = new CKANRegistryPageController($page);
        $config = $controller->getCKANClientConfig($page);

        $this->assertNotEmpty($config['fields']);
        $this->assertContains([
            'OriginalLabel' => 'city',
            'ReadableLabel' => 'City',
            'ShowInResultsView' => 1,
            'ShowInDetailView' => 1,
            'DisplayConditions' => [
                ['match-select' => '1', 'match-text' => 'Auckland']
            ],
            'RemoveDuplicates' => 0,
            'Type' => 'text',
        ], $config['fields'], 'DisplayConditions are decoded from stored JSON format');
    }

    /**
     * @param string $relativeLink
     * @param string $expected
     * @dataProvider basePathProvider
     */
    public function testGetBasePath($relativeLink, $expected)
    {
        /** @var CKANRegistryPage|PHPUnit_Framework_MockObject_MockObject $page */
        $page = $this->createMock(CKANRegistryPage::class);
        $page->expects($this->once())->method('RelativeLink')->willReturn($relativeLink);

        $controller = new CKANRegistryPageController($page);

        $this->assertSame($expected, $controller->getBasePath($page));
    }

    /**
     * @return array[]
     */
    public function basePathProvider()
    {
        return [
            ['/', '/'],
            ['/my-page', '/my-page'],
            ['my-page', '/my-page'],
            ['my-page/', '/my-page'],
            ['/my-page/', '/my-page'],
            ['/my-page/my-resources/', '/my-page/my-resources'],
        ];
    }

    public function testGetBasePathWithNoArgument()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->objFromFixture(CKANRegistryPage::class, 'animal_centers');

        $controller = new CKANRegistryPageController($page);

        $this->assertSame('/', $controller->getBasePath());
    }
}

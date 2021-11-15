<?php

namespace SilverStripe\CKANRegistry\Tests\Page;

use SilverStripe\CKANRegistry\Page\CKANRegistryPage;
use SilverStripe\CKANRegistry\Service\ResourcePopulatorInterface;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\GridField\GridField;
use Symbiote\GridFieldExtensions\GridFieldEditableColumns;

class CKANRegistryPageTest extends SapphireTest
{
    protected static $fixture_file = 'CKANRegistryPageTest.yml';

    protected function setUp(): void
    {
        // Mock the field populator, in case an action we perform in a unit test tries to contact the mock API.
        // Done before parent::setUp() so write hooks don't run during fixture population.
        $populator = $this->createMock(ResourcePopulatorInterface::class);
        Injector::inst()->registerService($populator, ResourcePopulatorInterface::class);

        parent::setUp();
    }

    public function testHasItemsPerPageSetting()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->objFromFixture(CKANRegistryPage::class, 'animal_centers');

        $this->assertNotNull($page->getSettingsFields()->fieldByName('Root.Settings.ItemsPerPage'));
    }

    public function testColumnsGridFieldHasUniqueClassName()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->objFromFixture(CKANRegistryPage::class, 'animal_centers');

        $field = $page->getCMSFields()->dataFieldByName('DataColumns');
        $this->assertInstanceOf(GridField::class, $field, 'Columns GridField was not found in fields');
        $this->assertTrue($field->hasClass('ckan-columns'), 'Columns GridField should have unique class');
    }

    public function testFiltersGridFieldHasUniqueClassName()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->objFromFixture(CKANRegistryPage::class, 'animal_centers');

        $field = $page->getCMSFields()->dataFieldByName('DataFilters');
        $this->assertInstanceOf(GridField::class, $field, 'Filters GridField was not found in fields');
        $this->assertTrue($field->hasClass('ckan-filters'), 'Filters GridField should have unique class');
    }

    public function testNoDataColumnsGridFieldGetsAddedWhenNoResourceIsDefined()
    {
        $page = new CKANRegistryPage();
        $page->write();

        $field = $page->getCMSFields()->fieldByName('Root.Data.DataColumns');
        $this->assertNull($field, 'Columns should not be added until a resource is defined');
    }

    public function testHasEditableColumnsComponent()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->objFromFixture(CKANRegistryPage::class, 'animal_centers');

        /** @var GridField $field */
        $field = $page->getCMSFields()->fieldByName('Root.Data.DataColumns');
        $this->assertInstanceOf(GridField::class, $field, 'Columns GridField was not found in fields');
        $this->assertNotNull($field->getConfig()->getComponentByType(GridFieldEditableColumns::class));
    }

    public function testEditableColumnsHaveCorrectDisplayFields()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->objFromFixture(CKANRegistryPage::class, 'animal_centers');

        /** @var GridField $field */
        $field = $page->getCMSFields()->fieldByName('Root.Data.DataColumns');
        $this->assertInstanceOf(GridField::class, $field, 'Columns GridField was not found in fields');

        /** @var GridFieldEditableColumns $component */
        $component = $field->getConfig()->getComponentByType(GridFieldEditableColumns::class);
        $this->assertNotNull($component, 'Component was not found in the GridField');

        $displayFields = $component->getDisplayFields($field);
        $this->assertEquals([
            'ShowInResultsView' => _t('SilverStripe\\CKANRegistry\\Page\\CKANRegistryPage.IN_RESULTS', 'In Results'),
            'ShowInDetailView' => _t('SilverStripe\\CKANRegistry\\Page\\CKANRegistryPage.IN_DETAIL', 'In Detail'),
        ], $displayFields, 'Correct display fields were not found');
    }
}

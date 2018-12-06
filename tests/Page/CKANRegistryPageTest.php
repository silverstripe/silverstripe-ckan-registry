<?php

namespace SilverStripe\CKANRegistry\Tests\Page;

use SilverStripe\CKANRegistry\Page\CKANRegistryPage;
use SilverStripe\Dev\SapphireTest;

class CKANRegistryPageTest extends SapphireTest
{
    protected static $fixture_file = 'CKANRegistryPageTest.yml';

    public function testHasItemsPerPageSetting()
    {
        /** @var CKANRegistryPage $page */
        $page = $this->objFromFixture(CKANRegistryPage::class, 'animal_centers');

        $this->assertNotNull($page->getSettingsFields()->fieldByName('Root.Settings.ItemsPerPage'));
    }
}

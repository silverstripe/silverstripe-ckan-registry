<?php

namespace SilverStripe\CKANRegistry\Tests\Page;

use SilverStripe\CKANRegistry\Page\CKANRegistryPage;
use SilverStripe\Dev\SapphireTest;

class CKANRegistryPageTest extends SapphireTest
{
    public function testHasItemsPerPageSetting()
    {
        $page = new CKANRegistryPage();
        $this->assertNotNull($page->getSettingsFields()->fieldByName('Root.Settings.ItemsPerPage'));
    }
}

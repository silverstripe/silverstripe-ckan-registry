<?php

namespace SilverStripe\CKANRegistry\Tests;

use SilverStripe\CKANRegistry\CKANRegistryPage;
use SilverStripe\Dev\SapphireTest;

class CKANRegistryPageTest extends SapphireTest
{
    protected $usesDatabase = true;

    /**
     * A temporary unit test to ensure that CI is running before development begins
     */
    public function testEnsureTestsAreRunning()
    {
        $page = new CKANRegistryPage();
        $page->Title = 'Test';
        $id = $page->write();

        $this->assertGreaterThan(0, $id, 'Page should have an ID assigned');
    }
}

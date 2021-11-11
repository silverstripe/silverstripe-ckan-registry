<?php

namespace SilverStripe\CKANRegistry\Tests\Forms;

use SilverStripe\CKANRegistry\Forms\GridFieldResourceTitle;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\GridField\GridField;

class GridFieldResourceTitleTest extends SapphireTest
{
    public function testGetHTMLFragments()
    {
        $resource = new Resource();
        $resource->Name = 'Ministry of Silly Walks';
        $resource->ResourceName = 'Face the Press';

        $gridField = new GridField('Test');
        $component = new GridFieldResourceTitle($resource, 'my-target-fragment');
        $result = $component->getHTMLFragments($gridField);

        $this->assertNotEmpty(
            $result['my-target-fragment'],
            'Should be assigned to the specified fragment'
        );
        $this->assertStringContainsString(
            'Ministry of Silly Walks | Face the Press',
            $result['my-target-fragment'],
            'Should contain title'
        );
        $this->assertStringContainsString(
            'Edit resource',
            $result['my-target-fragment'],
            'Edit button should exist'
        );
    }
}

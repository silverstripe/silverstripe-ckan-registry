<?php

namespace SilverStripe\CKANRegistry\Tests\Forms;

use SilverStripe\CKANRegistry\Forms\ResultConditionsField;
use SilverStripe\Dev\SapphireTest;

class ResultConditionsFieldTest extends SapphireTest
{
    public function testGetMatchOptionsDataStructure()
    {
        $result = ResultConditionsField::getMatchOptions();

        $this->assertNotEmpty($result, 'Match options should be returned');
        $this->assertArrayHasKey('value', $result[0], 'Unexpected data structure returned');
        $this->assertArrayHasKey('title', $result[0], 'Unexpected data structure returned');
    }
}

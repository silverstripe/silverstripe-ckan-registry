<?php

namespace SilverStripe\CKANRegistry\Tests\Model\ResourceFilterTest;

use SilverStripe\CKANRegistry\Model\ResourceFilter;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Dev\TestOnly;

/**
 * Represents an invalid {@link ResourceFilter} implementation, used for testing error handling
 */
class InvalidResourceFilter extends ResourceFilter implements TestOnly
{
    protected $fieldType = HTTPResponse::class;
}

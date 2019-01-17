<?php

namespace SilverStripe\CKANRegistry\Page;

use PageController;

class CKANRegistryPageController extends PageController
{
    private static $url_handlers = [
        // Route all requests for this page, including sub-URLs, to the index action.
        // The frontend components should take care of handling sub-URL routing from here.
        '$Item' => 'index',
    ];
}

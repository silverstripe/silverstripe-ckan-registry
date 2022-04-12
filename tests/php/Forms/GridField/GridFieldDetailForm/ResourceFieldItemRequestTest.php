<?php

namespace SilverStripe\CKANRegistry\Tests\Forms\GridField\GridFieldDetailForm;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\CKANRegistry\Forms\GridField\GridFieldDetailForm\ResourceFieldItemRequest;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Model\ResourceField;
use SilverStripe\CKANRegistry\Page\CKANRegistryPage;
use SilverStripe\CKANRegistry\Service\ResourcePopulator;
use SilverStripe\CKANRegistry\Service\ResourcePopulatorInterface;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig;
use SilverStripe\Forms\GridField\GridFieldDetailForm;
use SilverStripe\Security\SecurityToken;

class ResourceFieldItemRequestTest extends SapphireTest
{
    protected static $fixture_file = 'ResourceFieldItemRequest.yml';

    protected function setUp(): void
    {
        $populator = $this->createMock(ResourcePopulator::class);
        Injector::inst()->registerService($populator, ResourcePopulatorInterface::class);

        $populator->method('populateFields')->willReturnSelf();
        $populator->method('populateMetadata')->willReturnSelf();

        parent::setUp();
    }

    public function testSortingOnResourceSave()
    {
        $this->moveFieldFixture('subject', 1);

        /** @var Resource $resource */
        $resource = $this->objFromFixture(Resource::class, 'teachers');

        $this->assertArrayEqualsInOrder(
            [
                'Subject' => '1',
                'First name' => '2',
                'Last name' => '3',
                'City' => '4',
                'School' => '5',
                'Gender' => '6',
            ],
            $resource->Fields()->sort('Position', 'ASC')->map('OriginalLabel', 'Position')->toArray()
        );

        $this->moveFieldFixture('firstname', 5);

        $this->assertArrayEqualsInOrder(
            [
                'Subject' => '1',
                'Last name' => '2',
                'City' => '3',
                'School' => '4',
                'First name' => '5',
                'Gender' => '6',
            ],
            $resource->Fields()->sort('Position', 'ASC')->map('OriginalLabel', 'Position')->toArray()
        );

        $this->moveFieldFixture('subject', 9);

        $this->assertArrayEqualsInOrder(
            [
                'Last name' => '1',
                'City' => '2',
                'School' => '3',
                'First name' => '4',
                'Gender' => '5',
                'Subject' => '9',
            ],
            $resource->Fields()->sort('Position', 'ASC')->map('OriginalLabel', 'Position')->toArray()
        );

        $this->moveFieldFixture('gender', 1);

        $this->assertArrayEqualsInOrder(
            [
                'Gender' => '1',
                'Last name' => '2',
                'City' => '3',
                'School' => '4',
                'First name' => '5',
                'Subject' => '9',
            ],
            $resource->Fields()->sort('Position', 'ASC')->map('OriginalLabel', 'Position')->toArray()
        );
    }

    protected function moveFieldFixture($fixture, $newPosition)
    {
        // Locate the resource fixture and the specified fixture
        /** @var Resource $resource */
        $resource = $this->objFromFixture(Resource::class, 'teachers');
        $field = $this->objFromFixture(ResourceField::class, $fixture);

        // Form a request
        $token = SecurityToken::create();
        $request = new HTTPRequest('POST', 'ItemEditForm', [], [
            'Position' => $newPosition,
            'action_doSave' => 1,
            $token->getName() => $token->getValue(),
        ]);
        $request->setSession(Controller::curr()->getRequest()->getSession());

        // Build the gridfield and component
        $config = GridFieldConfig::create();
        $detailForm = new GridFieldDetailForm();
        $config->addComponent($detailForm->setItemRequestClass(ResourceFieldItemRequest::class));
        $gridField = new GridField('Test', 'Test', $resource->Fields(), $config);
        $formMock = $this->createMock(Form::class);
        $formMock->method('FormAction')->willReturn('test');
        $gridField->setForm($formMock);
        $controllerMock = $this->createMock(Controller::class);
        $controllerMock->method('Link')->willReturn('test');
        $controllerMock->method('getRequest')->willReturn($request);

        // Create an item request
        $itemRequest = new ResourceFieldItemRequest(
            $gridField,
            $detailForm,
            $field,
            $controllerMock,
            'Test'
        );

        // Handle our request
        $itemRequest->handleRequest($request);
    }

    protected function assertArrayEqualsInOrder($expected, $actual)
    {
        $message = 'Failed asserting array in order. Expected ' . print_r($expected, true) .
            '. Actual: ' . print_r($actual, true);

        foreach ($actual as $key => $value) {
            $expectedKey = key($expected ?? []);
            $expectedValue = array_shift($expected);
            $this->assertSame($expectedKey, $key, $message);
            $this->assertEquals($expectedValue, $value, $message);
        }

        $this->assertEmpty($expected, $message);
    }
}

<?php

namespace SilverStripe\CKANRegistry\Tests\Service;

use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\StreamInterface;
use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Service\Client;
use SilverStripe\Dev\SapphireTest;

class ClientTest extends SapphireTest
{
    /**
     * @var \GuzzleHttp\Client
     */
    protected $guzzleClient;

    /**
     * @var Response
     */
    protected $response;

    /**
     * @var StreamInterface
     */
    protected $mockBody;

    /**
     * @var Resource
     */
    protected $resource;

    protected function setUp()
    {
        parent::setUp();

        $this->guzzleClient = $this->createMock(\GuzzleHttp\Client::class);
        $this->response = $this->createMock(Response::class);
        $this->mockBody = $this->createMock(StreamInterface::class);
        $this->resource = new Resource();
    }

    /**
     * @expectedException RuntimeException
     * @expectedExceptionMessage CKAN API is not available. Error code 123
     */
    public function testExceptionThrownOnInvalidHttpStatusCode()
    {
        $this->guzzleClient->expects($this->once())->method('send')->willReturn($this->response);
        $this->response->expects($this->once())->method('getStatusCode')->willReturn(123);

        $client = new Client();
        $client->setGuzzleClient($this->guzzleClient);
        $client->getData($this->resource);
    }

    /**
     * @expectedException RuntimeException
     * @expectedExceptionMessage CKAN API returns an invalid response: Content-Type is not JSON
     */
    public function testExceptionThrownOnNonJsonResponse()
    {
        $this->guzzleClient->expects($this->once())->method('send')->willReturn($this->response);
        $this->response->expects($this->once())->method('getStatusCode')->willReturn(200);
        $this->response->expects($this->once())->method('getHeader')->with('Content-Type')->willReturn(['junk']);

        $client = new Client();
        $client->setGuzzleClient($this->guzzleClient);
        $client->getData($this->resource);
    }

    /**
     * @expectedException RuntimeException
     * @expectedExceptionMessage CKAN API returns an invalid response: Responded as invalid
     */
    public function testExceptionThrownOnUnsuccessfulResponse()
    {
        $this->guzzleClient->expects($this->once())->method('send')->willReturn($this->response);
        $this->response->expects($this->once())->method('getStatusCode')->willReturn(200);
        $this->response->expects($this->once())->method('getHeader')->willReturn(['application/json']);
        $this->response->expects($this->once())->method('getBody')->willReturn($this->mockBody);
        $this->mockBody->expects($this->once())->method('getContents')->willReturn('{
            "success": false
        }');

        $client = new Client();
        $client->setGuzzleClient($this->guzzleClient);
        $client->getData($this->resource);
    }

    public function testReturnsResponseData()
    {
        $this->guzzleClient->expects($this->once())->method('send')->willReturn($this->response);
        $this->response->expects($this->once())->method('getStatusCode')->willReturn(200);
        $this->response->expects($this->once())->method('getHeader')->willReturn(['application/json']);
        $this->response->expects($this->once())->method('getBody')->willReturn($this->mockBody);
        $this->mockBody->expects($this->once())->method('getContents')->willReturn('{
            "success": true,
            "data": "test"
        }');

        $client = new Client();
        $client->setGuzzleClient($this->guzzleClient);
        $result = $client->getData($this->resource);

        $this->assertSame('test', $result['data'], 'Raw response body should be returned');
    }
}

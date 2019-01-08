<?php

namespace SilverStripe\CKANRegistry\Service;

use GuzzleHttp\Psr7\Request;
use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;

class Client implements ClientInterface
{
    use Extensible;
    use Injectable;

    private static $dependencies = [
        'GuzzleClient' => '%$' . \GuzzleHttp\Client::class,
    ];

    /**
     * @var \GuzzleHttp\Client
     */
    protected $guzzleClient;

    public function getData(Resource $resource)
    {
        $endpoint = sprintf(
            '%s/api/3/action/datastore_search?id=%s',
            trim($resource->Endpoint, '/'),
            $resource->Identifier
        );

        $request = new Request('GET', $endpoint);
        $response = $this->getGuzzleClient()->send($request, $this->getClientOptions());

        $statusCode = $response->getStatusCode();
        if ($statusCode < 200 || $statusCode >= 300) {
            throw new RuntimeException('CKAN API is not available. Error code ' . $statusCode);
        }

        if (!count(preg_grep('#application/json#', $response->getHeader('Content-Type')))) {
            throw new RuntimeException('CKAN API returns an invalid response: Content-Type is not JSON');
        }

        $responseBody = json_decode($response->getBody()->getContents(), true);

        if (!$responseBody || !isset($responseBody['success']) || !$responseBody['success']) {
            throw new RuntimeException('CKAN API returns an invalid response: Responded as invalid');
        }

        return $responseBody;
    }

    /**
     * @return \GuzzleHttp\Client
     */
    protected function getGuzzleClient()
    {
        return $this->guzzleClient;
    }

    /**
     * @param \GuzzleHttp\Client $guzzleClient
     * @return $this
     */
    public function setGuzzleClient(\GuzzleHttp\Client $guzzleClient)
    {
        $this->guzzleClient = $guzzleClient;
        return $this;
    }

    /**
     * Get Guzzle client options
     *
     * @return array
     */
    protected function getClientOptions()
    {
        $options = [
            'http_errors' => false,
        ];
        $this->extend('updateClientOptions', $options);
        return $options;
    }
}

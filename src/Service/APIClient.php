<?php

namespace SilverStripe\CKANRegistry\Service;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;

class APIClient implements APIClientInterface
{
    use Extensible;
    use Injectable;

    private static $dependencies = [
        'GuzzleClient' => '%$' . Client::class,
    ];

    /**
     * @var Client
     */
    protected $guzzleClient;

    /**
     * Instance cache for repeated calls within the same request
     *
     * @var array[]
     */
    protected $cache;

    public function getPackage(Resource $resource)
    {
        return $this->getData($resource, 'package_show', 'DataSet');
    }

    public function getSearchData(Resource $resource)
    {
        return $this->getData($resource, 'datastore_search', 'Identifier');
    }

    public function getData(Resource $resource, $action = 'datastore_search', $id = 'Identifier')
    {
        $endpoint = sprintf(
            '%s/api/%s/action/%s?id=%s',
            trim($resource->Endpoint ?? '', '/'),
            APIClientInterface::API_VERSION,
            $action,
            $resource->{$id}
        );

        // Check for a cached result
        if (isset($this->cache[$endpoint])) {
            return $this->cache[$endpoint];
        }

        $request = new Request('GET', $endpoint);
        $response = $this->getGuzzleClient()->send($request, $this->getClientOptions());

        $statusCode = $response->getStatusCode();
        if ($statusCode < 200 || $statusCode >= 300) {
            throw new RuntimeException('CKAN API is not available. Error code ' . $statusCode);
        }

        if (!count(preg_grep('#application/json#', $response->getHeader('Content-Type') ?? []) ?? [])) {
            throw new RuntimeException('CKAN API returns an invalid response: Content-Type is not JSON');
        }

        $responseBody = json_decode($response->getBody()->getContents() ?? '', true);

        if (!$responseBody || !isset($responseBody['success']) || !$responseBody['success']) {
            throw new RuntimeException('CKAN API returns an invalid response: Responded as invalid');
        }

        // Store cached result for subsequent calls within the same request
        $this->cache[$endpoint] = $responseBody;

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
     * @param Client $guzzleClient
     * @return $this
     */
    public function setGuzzleClient(Client $guzzleClient)
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

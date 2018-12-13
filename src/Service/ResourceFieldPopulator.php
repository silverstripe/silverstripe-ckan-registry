<?php
namespace SilverStripe\CKANRegistry\Service;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Model\ResourceField;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;

/**
 * This service will take a CKAN Resource and populate its Fields `has_many` relationship from the CKAN API
 */
class ResourceFieldPopulator implements ResourceFieldPopulatorInterface
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

    public function populateFields(Resource $resource)
    {
        if (!$resource->Endpoint && !$resource->Identifier) {
            throw new RuntimeException('Could not fetch fields for a resource that is not fully configured');
        }

        $fieldSpecs = $this->doFieldRequest($resource);

        $newFields = [];
        $fields = $resource->Fields();

        foreach ($fieldSpecs as $fieldSpec) {
            $id = $fieldSpec['id'];

            // Skip fields that may already exist
            if ($fields->find('Name', $id)) {
                continue;
            }

            // Create a new field
            $newFields[] = $field = ResourceField::create();
            $field->Name = $id;
            // Attempt to parse a readable name
            $field->ReadableName = $this->parseName($id);
            $field->Type = $fieldSpec['type'];
        }

        // Add our new fields
        $fields->addMany($newFields);
    }

    /**
     * Perform a request to the CKAN endpoint provided by the given resource to fetch field definitons
     *
     * @param Resource $resource
     * @return array
     * @throws \GuzzleHttp\Exception\GuzzleException|RuntimeException
     */
    protected function doFieldRequest(Resource $resource)
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

        return $responseBody['result']['fields'];
    }

    /**
     * Parse given column ID for a more readable version
     *
     * @param string $id
     * @return string
     */
    protected function parseName($id)
    {
        // Parse "camelCase" to "space case"
        $name = strtolower(preg_replace('/(?<=[a-z\d])([A-Z])/', ' \1', $id));

        // Swap out certain characters with spaces
        $name = str_replace(['_', '-'], ' ', $name);

        // Remove non-alphanumeric characters
        $name = trim(preg_replace('/[^\w\s]/', '', $name));

        return ucfirst($name);
    }

    /**
     * @return Client
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

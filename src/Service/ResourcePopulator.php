<?php

namespace SilverStripe\CKANRegistry\Service;

use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Model\ResourceField;
use SilverStripe\Core\Injector\Injectable;

/**
 * This service will take a CKAN Resource and populate its Fields `has_many` relationship and other data
 * from the CKAN API
 */
class ResourcePopulator implements ResourcePopulatorInterface
{
    use Injectable;

    private static $dependencies = [
        'APIClient' => '%$' . APIClientInterface::class,
    ];

    /**
     * @var APIClientInterface
     */
    protected $apiClient;

    /**
     * Populates the {@link Resource} with metadata from the API response, such as the name of the data set
     *
     * @param Resource $resource
     * @return $this
     */
    public function populateMetadata(Resource $resource)
    {
        $this->validateResource($resource);

        $data = $this->getAPIClient()->getPackage($resource);

        // Get the title of the data set
        $datasetTitle = isset($data['result']['title']) ? $data['result']['title'] : '';

        // Get the title of the selected resource
        $resources = isset($data['result']['resources'])
            ? array_column($data['result']['resources'], 'name', 'id')
            : [];
        $resourceTitle = isset($resources[$resource->Identifier]) ? $resources[$resource->Identifier] : '';

        $resource->Name = $datasetTitle;
        $resource->ResourceName = $resourceTitle;

        return $this;
    }

    /**
     * Take a CKAN {@link Resource} and populate its Fields `has_many` relationship and other data
     * from the CKAN API response.
     *
     * @param Resource $resource
     * @return $this
     */
    public function populateFields(Resource $resource)
    {
        $this->validateResource($resource);

        $data = $this->getAPIClient()->getSearchData($resource);
        $fieldSpecs = isset($data['result']['fields']) ? $data['result']['fields'] : [];

        $newFields = [];
        $fields = $resource->Fields();
        $position = 1;

        foreach ($fieldSpecs as $fieldSpec) {
            $id = $fieldSpec['id'];

            // Skip fields that may already exist
            if ($fields->find('OriginalLabel', $id)) {
                continue;
            }

            // Create a new field
            $newFields[] = $field = ResourceField::create();
            $field->OriginalLabel = $id;
            $field->Position = $position++;
            // Attempt to parse a readable name
            $field->ReadableLabel = $this->parseName($id);
            $field->Type = $fieldSpec['type'];
        }

        // Add our new fields
        $fields->addMany($newFields);

        return $this;
    }

    /**
     * Validates that the given {@link Resource} has the necessary data to make the request
     *
     * @param Resource $resource
     * @return bool True if successful
     * @throws RuntimeException If validation fails
     */
    protected function validateResource(Resource $resource)
    {
        if (!$resource->Endpoint || !$resource->DataSet || !$resource->Identifier) {
            throw new RuntimeException('Could not fetch fields for a resource that is not fully configured');
        }
        return true;
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
        $name = strtolower(preg_replace('/(?<=[a-z\d])([A-Z])/', ' \1', $id ?? '') ?? '');

        // Swap out certain characters with spaces
        $name = str_replace(['_', '-'], ' ', $name ?? '');

        // Remove some non-alphanumeric characters
        $name = trim(preg_replace('/[^\/\w\s]/', '', $name ?? '') ?? '');

        // Remove extra spaces around slashes
        $name = str_replace(' / ', '/', $name ?? '');

        return ucfirst($name ?? '');
    }

    /**
     * @return APIClientInterface
     */
    public function getAPIClient()
    {
        return $this->apiClient;
    }

    /**
     * @param APIClientInterface $client
     * @return $this
     */
    public function setAPIClient(APIClientInterface $apiClient)
    {
        $this->apiClient = $apiClient;
        return $this;
    }
}

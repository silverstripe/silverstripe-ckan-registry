<?php

namespace SilverStripe\CKANRegistry\Service;

use RuntimeException;
use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\CKANRegistry\Model\ResourceField;
use SilverStripe\Core\Injector\Injectable;

/**
 * This service will take a CKAN Resource and populate its Fields `has_many` relationship from the CKAN API
 */
class ResourceFieldPopulator implements ResourceFieldPopulatorInterface
{
    use Injectable;

    private static $dependencies = [
        'Client' => '%$' . ClientInterface::class,
    ];

    /**
     * @var ClientInterface
     */
    protected $client;

    public function populateFields(Resource $resource)
    {
        if (!$resource->Endpoint && !$resource->Identifier) {
            throw new RuntimeException('Could not fetch fields for a resource that is not fully configured');
        }

        $fieldSpecs = $this->doFieldRequest($resource);

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
    }

    /**
     * Perform a request to the CKAN endpoint provided by the given resource to fetch field definitons
     *
     * @param Resource $resource
     * @return array
     */
    protected function doFieldRequest(Resource $resource)
    {
        $data = $this->getClient()->getData($resource);
        return isset($data['result']['fields']) ? $data['result']['fields'] : [];
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
     * @return ClientInterface
     */
    public function getClient()
    {
        return $this->client;
    }

    /**
     * @param ClientInterface $client
     * @return $this
     */
    public function setClient(ClientInterface $client)
    {
        $this->client = $client;
        return $this;
    }
}

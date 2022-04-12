<?php

namespace SilverStripe\CKANRegistry\Forms;

use InvalidArgumentException;
use SilverStripe\Forms\FormField;
use SilverStripe\ORM\DataObjectInterface;

class ResourceLocatorField extends FormField
{
    /**
     * The default CKAN endpoint to be used in a default isn't provided on construction
     * @see ResourceLocatorField::$defaultEndpoint
     *
     * @config
     * @var string
     */
    private static $default_endpoint = 'https://demo.ckan.org/';

    /**
     * The default CKAN endpoint to be used in this field. This will allow consumers of the field to only provide
     * package or dataset IDs and still work. If not set the configured default will instead be used.
     *
     * @var string|null
     */
    protected $defaultEndpoint;

    /**
     * Set a site name that can be used to refer to the CKAN endpoint. By default this will be "a CKAN website".
     *
     * @var string|null
     */
    protected $siteName = null;

    /**
     * The name of the subfield to save the endpoint value of this field into
     *
     * @var string
     */
    protected $endpointFieldName = 'Endpoint';

    /**
     * The name of the subfield to save the dataset value of this field into
     *
     * @var string
     */
    protected $datasetFieldName = 'DataSet';

    /**
     * The name of the subfield to save the resource value of this field into
     *
     * @var string
     */
    protected $resourceFieldName = 'Identifier';

    /**
     * @param string $name
     * @param string $title
     * @param string $value
     * @param string $defaultEndpoint
     */
    public function __construct($name, $title = null, $value = null, $defaultEndpoint = null)
    {
        parent::__construct($name, $title, $value);
        $this->setDefaultEndpoint($defaultEndpoint);

        // Set a default description
        $this->setDescription(_t(
            __CLASS__ . '.DESCRIPTION',
            'Connect to a data source from {site}. Once added and saved you can configure the appearance and add search'
            . ' filters.',
            [ 'site' => $this->getSiteName() ]
        ));
    }

    public function getSchemaDataDefaults()
    {
        return array_merge(parent::getSchemaDataDefaults(), [
            'hideLabels' => true,
            'defaultEndpoint' => $this->getDefaultEndpoint(),
        ]);
    }

    public function performReadonlyTransformation()
    {
        // Set read only and clone to maintain immutability
        $clone = clone $this->setReadonly(true);

        // Clear out the description that's only relevant when the field is editable.
        $clone->setDescription('');

        return $clone;
    }


    public function setValue($value, $data = null)
    {
        // Handle the case where this is being set as a legitimate "spec" containing endpoint, dataset and resource
        if (is_array($value)) {
            $this->value = $value;
            return $this;
        }

        // If it's still not valid we'll just run with an empty value (assume the relation isn't created)
        if (!$value instanceof DataObjectInterface) {
            $this->value = null;
            return $this;
        }

        $endpoint = $value->{$this->getEndpointFieldName()};
        $dataset = $value->{$this->getDatasetFieldName()};
        $resource = $value->{$this->getResourceFieldName()};

        // Validate we have a dataset
        if (!$dataset) {
            $this->value = null;
            return $this;
        }

        // Validate we have an endpoint (or a default to fall back upon)
        if (!$endpoint) {
            $endpoint = $this->getDefaultEndpoint();
            if (!$endpoint) {
                $this->value = null;
                return $this;
            }
        }

        $this->value = compact('endpoint', 'dataset', 'resource');
        return $this;
    }

    public function setSubmittedValue($value, $data = null)
    {
        return $this->setValue(json_decode($value ?? '', true));
    }

    public function dataValue()
    {
        // Although by default this "saves into" a child object we provide a JSON encoded value in case this method is
        // used.
        return json_encode($this->Value());
    }

    public function saveInto(DataObjectInterface $dataObject)
    {
        // Duplicate existing logic where the field is skipped given there's no name on this field.
        if (!$this->name) {
            return;
        }

        // Find what we're actually saving into
        $resource = $dataObject->{$this->name};

        if (!$resource || !$resource instanceof DataObjectInterface) {
            throw new InvalidArgumentException('Could not determine where to save the value of ' . __CLASS__);
        }

        // Pull the value that'll be null or an associative array of our specification
        $value = $this->Value();
        $resource->setCastedField($this->getEndpointFieldName(), $value ? $value['endpoint'] : null);
        $resource->setCastedField($this->getDatasetFieldName(), $value ? $value['dataset'] : null);
        $resource->setCastedField($this->getResourceFieldName(), $value ? $value['resource'] : null);

        // Now set the updated resource back on the parent
        $dataObject->setCastedField($this->name, $resource);

        // Ensure changes are persisted as this is not saved on page save if the ID of the resource did not change.
        $resource->write();
    }

    /**
     * @see ResourceLocatorField::$defaultEndpoint
     * @return string
     */
    public function getDefaultEndpoint()
    {
        if (!$this->defaultEndpoint) {
            return self::config()->get('default_endpoint');
        }

        return $this->defaultEndpoint;
    }

    /**
     * @see ResourceLocatorField::$defaultEndpoint
     * @param string $defaultEndpoint
     * @return $this
     */
    public function setDefaultEndpoint($defaultEndpoint)
    {
        $this->defaultEndpoint = $defaultEndpoint;
        return $this;
    }

    /**
     * @return null|string
     */
    public function getSiteName()
    {
        // Allow empty site names
        if ($this->siteName === null) {
            return _t(__CLASS__ . '.GENERIC_SITE_NAME', 'a CKAN website');
        }

        return $this->siteName;
    }

    /**
     * @param null|string $siteName
     * @return $this
     */
    public function setSiteName($siteName)
    {
        $this->siteName = $siteName;
        return $this;
    }

    /**
     * @return string
     */
    public function getEndpointFieldName()
    {
        return $this->endpointFieldName;
    }

    /**
     * @param string $endpointFieldName
     * @return $this
     */
    public function setEndpointFieldName($endpointFieldName)
    {
        $this->endpointFieldName = $endpointFieldName;
        return $this;
    }

    /**
     * @return string
     */
    public function getDatasetFieldName()
    {
        return $this->datasetFieldName;
    }

    /**
     * @param string $datasetFieldName
     * @return $this
     */
    public function setDatasetFieldName($datasetFieldName)
    {
        $this->datasetFieldName = $datasetFieldName;
        return $this;
    }

    /**
     * @return string
     */
    public function getResourceFieldName()
    {
        return $this->resourceFieldName;
    }

    /**
     * @param string $resourceFieldName
     * @return $this
     */
    public function setResourceFieldName($resourceFieldName)
    {
        $this->resourceFieldName = $resourceFieldName;
        return $this;
    }
}

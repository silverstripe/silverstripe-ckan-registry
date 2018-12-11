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
    private static $default_endpoint = 'https://catalogue.data.govt.nz/';

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
    protected $resourceFieldName = 'Resource';

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

        $this->addExtraClass('ckan-resource-locator__container');
    }

    public function getSchemaDataDefaults()
    {
        $schemaData = parent::getSchemaDataDefaults();

        $schemaData['defaultEndpoint'] = $this->getDefaultEndpoint();

        return $schemaData;
    }

    public function setValue($value, $data = null)
    {
        // $value should be the child DataObject but if it isn't we can use `getSaveTarget`
        if (!$value instanceof DataObjectInterface) {
            $value = $this->getSaveTarget($data);

            // If it's still not valid we'll just run with an empty value (assume the relation isn't created)
            if (!$value instanceof DataObjectInterface) {
                $this->value = null;
                return $this;
            }
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
    }

    public function setSubmittedValue($value, $data = null)
    {
        return $this->setValue(json_decode($value, true));
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
        $child = $this->getSaveTarget($dataObject);

        if (!$child || !$child instanceof DataObjectInterface) {
            throw new InvalidArgumentException('Could not determine where to save the value of ' . __CLASS__);
        }

        // Pull the value that'll be null or an associative array of our specification
        $value = $this->Value();
        $child->setCastedField($this->getEndpointFieldName(), $value ? $value['endpoint'] : null);
        $child->setCastedField($this->getDatasetFieldName(), $value ? $value['dataset'] : null);
        $child->setCastedField($this->getResourceFieldName(), $value ? $value['resource'] : null);
    }

    /**
     * Provide the object that this field actually saves into.
     * By default this is a relation access with __get. Eg. given $dataObject is a page; $page->CKANResource where
     * "CKANResource" is the name of this field.
     *
     * @param DataObjectInterface $dataObject
     * @return mixed
     */
    public function getSaveTarget(DataObjectInterface $dataObject)
    {
        $target = $dataObject->{$this->name};

        $this->extend('updateSaveTarget', $target, $dataObject);

        return $target;
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

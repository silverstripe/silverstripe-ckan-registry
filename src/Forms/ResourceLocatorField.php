<?php
namespace SilverStripe\CKANRegistry\Forms;

use SilverStripe\Forms\FormField;

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
}

<?php

namespace SilverStripe\CKANRegistry\Forms;

use SilverStripe\CKANRegistry\Model\Resource;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Forms\GridField\GridField_HTMLProvider;
use SilverStripe\View\ArrayData;

/**
 * Presents a title for the {@link Resource} data set and selected resource, as well as a toggle to hide or show
 * the resource locator field in the CMS.
 *
 * This component is designed to be used on CKANRegistryPage instances.
 */
class GridFieldResourceTitle implements GridField_HTMLProvider
{
    use Injectable;

    /**
     * @var Resource
     */
    protected $resource;

    /**
     * @var string
     */
    protected $targetFragment = '';

    /**
     * @param Resource $resource
     * @param string $targetFragment
     */
    public function __construct(Resource $resource, $targetFragment = 'buttons-before-left')
    {
        $this->setResource($resource);
        $this->setTargetFragment($targetFragment);
    }

    public function getHTMLFragments($gridField)
    {
        $data = ArrayData::create([
            'Resource' => $this->resource,
            'EditLinkTitle' => _t(__CLASS__ . '.EDIT_LINK_TITLE', 'Edit resource'),
            'ReadOnly' => $gridField->isReadonly(),
        ]);
        $result = $data->renderWith(__CLASS__);

        return [
            $this->targetFragment => $result,
        ];
    }

    /**
     * @param Resource $resource
     * @return $this
     */
    public function setResource(Resource $resource)
    {
        $this->resource = $resource;
        return $this;
    }

    /**
     * @param string $targetFragment
     * @return $this
     */
    public function setTargetFragment($targetFragment)
    {
        $this->targetFragment = (string) $targetFragment;
        return $this;
    }
}

<?php

namespace SilverStripe\CKANRegistry\Forms\GridField\GridFieldDetailForm;

use SilverStripe\CKANRegistry\Model\ResourceField;
use SilverStripe\Forms\GridField\GridFieldDetailForm_ItemRequest;
use SilverStripe\ORM\Queries\SQLUpdate;

class ResourceFieldItemRequest extends GridFieldDetailForm_ItemRequest
{
    protected function saveFormIntoRecord($data, $form)
    {
        // Update the record so that we can investigate the changes
        $form->saveInto($this->record);
        $changes = $this->record->getChangedFields();

        // Delegate to the parent now to do the save
        /** @var ResourceField $record */
        $record = parent::saveFormIntoRecord($data, $form);

        // Continue out if the sort order has not changed
        if (!isset($changes['Position'])) {
            return $record;
        }

        $change = $changes['Position'];
        $oldPosition = (int) $change['before'];
        $newPosition = (int) $change['after'];

        if ($oldPosition === $newPosition) {
            return $record;
        }

        // Otherwise we might need to update the position of other columns belonging to the resource
        $resource = $record->Resource;


        // If we've moved up the list that means other records need to move down
        $operator = $newPosition < $oldPosition ? '+' : '-';

        // Now we just need to target all objects between the new and old positions
        if ($newPosition < $oldPosition) {
            $where = [
                '"Position" >= ?' => $newPosition,
                '"Position" < ?' => $oldPosition,
            ];
        } else {
            $where = [
                '"Position" > ?' => $oldPosition,
                '"Position" <= ?' => $newPosition,
            ];
        }

        $update = SQLUpdate::create(
            $record->baseTable(),
            [],
            $where + ['"ID" != ?' => $record->ID, '"ResourceID"' => $resource->ID]
        );

        $update->assignSQL("\"Position\"", "\"Position\" $operator 1");

        $update->execute();

        return $record;
    }
}

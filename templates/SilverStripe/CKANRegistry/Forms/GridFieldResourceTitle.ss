<% if $Resource.Name %>
    <h2 class="grid-field__title title ckan-columns__title">
        $Resource.Name<% if $Resource.ResourceName %> | $Resource.ResourceName<% end_if %>
        <a href="#" class="btn btn-link btn-sm font-icon-edit ckan-columns__edit-resource">
            <span class="sr-only">$EditLinkTitle</span>
        </a>
    </h2>
<% end_if %>

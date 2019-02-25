<% if $Resource.Name %>
    <h2 class="grid-field__title title ckan-columns__title">
        $Resource.Name<% if $Resource.ResourceName %> | $Resource.ResourceName<% end_if %>
        <% if not $ReadOnly %>
        <a href="#" class="btn btn-link btn-sm font-icon-edit ckan-columns__edit-resource">
            <span class="sr-only">$EditLinkTitle</span>
        </a>
        <% end_if %>
    </h2>
<% end_if %>

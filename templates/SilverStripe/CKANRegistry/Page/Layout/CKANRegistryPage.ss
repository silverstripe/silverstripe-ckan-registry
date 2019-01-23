<% require css('silverstripe/ckan-registry: client/dist/styles/bundle.css') %>

<div class="container">
    <section class="title">
        <div class="page-header">
            $Breadcrumbs
            <h1>$Title</h1>
        </div>
    </section>
    <section class="content">
        <% if $ElementalArea %>
            <%-- Support for content blocks, if enabled --%>
            $ElementalArea
        <% else %>
            $Content
        <% end_if %>
        <% with $DataResource %>
            <% include SilverStripe\CKANRegistry\CKANRegistry Record=$Up %>
        <% end_with %>
        $Form
    </section>
</div>

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
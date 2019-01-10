<%--
    Note: GridFieldResourceTitle allows toggling of visibility, use "hide" to hide it initially if there is a value set
    Also note that we do this in the field holder template to ensure that the "hide" class isn't propagated down to the
    actual form field itself - same with the container class.
--%>
<div $getAttributesHTML('class', 'value') data-schema="$SchemaData.JSON" class="<% if $Value %>hide <% end_if %>ckan-resource-locator__container $ExtraClass">
    <%-- Field is rendered by React components --%>
    <input type="hidden" name="$Name" value="$Value.JSON" />
</div>

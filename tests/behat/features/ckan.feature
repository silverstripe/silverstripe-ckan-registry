Feature: Use CKAN
  As a website user
  I want to use CKAN

  Background:
    Given the "group" "EDITOR group" has permissions "CMS_ACCESS_LeftAndMain"

  Scenario: Operate CKAN pages

    # This will pass the test, but shouldn't need ADMIN permissions to use CKAN
    # Bug where neither CMS_ACCESS_LeftAndMain nor CMS_ACCESS_CMSMain cannot view results
    # https://github.com/silverstripe/silverstripe-ckan-registry/issues/253
    # Once issue has been fixed remove ADMIN login above and uncomment EDITOR login below
    Given I am logged in with "ADMIN" permissions
    # Given I am logged in with "EDITOR" permissions

    When I go to "/admin/pages"
    And I press the "Add new" button
    And I select the "CKAN Registry Page" radio button
    And I press the "Create" button
    And I fill in "Page name" with "My CKAN Registry Page"
    And I press the "Save" button
    Then I should see a "Saved" success toast
    When I click the "Data" CMS tab
    When I fill in "DataResource-uri" with "https://catalogue.data.govt.nz/dataset/family-services-directory"
    And I wait for 5 seconds
    And I should see "Family Services Directory"
    When I select "FSD_provider_DIA_RPT.csv" from the ".ckan-resource-locator__resource-select select" field
    And I wait for 5 seconds
    And I press the "Save" button
    Then I should see a "Saved" success toast
    And I should see "Id"
    And I should see "_id"
    When I check "Form_DataColumns_GridFieldEditableColumns_2_ShowInResultsView"
    And I check "Form_DataColumns_GridFieldEditableColumns_3_ShowInResultsView"
    And I check "Form_DataColumns_GridFieldEditableColumns_4_ShowInResultsView"
    And I press the "Save" button
    And I go to "/my-ckan-registry-page?stage=Stage"
    Then I should see "http://www.homebuilderstrust.co.nz"
    And I should see "Homebuilders West Coast Trust"
    And I should see "Search"

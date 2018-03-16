## Property Details section    
[Example of API call](https://fl-api.gridics.com/api/ui-api?action=_property_record&type=_property_record&geometryFormat=json&rows=10&offset=0&ignoreStatus=&indent=&fields[]=neighborhood&fields[]=id&fields[]=title&fields[]=folioNumber&fields[]=address&fields[]=city&fields[]=county&fields[]=state&fields[]=postalCode&fields[]=primary_owners&fields[]=owner_mailing_address&fields[]=legalDesc&fields[]=millageCode&fields[]=landUseDorCode&fields[]=yearBuilt&fields[]=buildings&fields[]=bedrooms&fields[]=baths&fields[]=livingUnits&fields[]=propertySize&fields[]=abuttingProperties&fields[]=abuttingStreets&fields[]=abuttingStreets&fields[]=building:real&fields[]=neighborhood:real&point_search={%22geometry%22:%22POINT%20(-80.16534805297853%2026.112132472475302)%22}&&publicToken=3jKTnjs7ddiyg1zJEByPx/Xra0J8Ch0Q2mLfmNWcSeQ=)     
  
### Fields     
`id` - Node ID    
`title` - Property Title    
`folioNumber` - Folio    
`address` - Address    
`city` - Places - City    
`county` - Places - County // Not Added Yet    
`state` - State    
`postalCode` - Places - Zip Code    
`primary_owners` - Owner(s)  
`owner_mailing_address` - Owner Address  
`legalDesc` - Property Description  
`millageCode` - Millage Code  
`landUseDorCode` - Detailed Use  
`yearBuilt` - Year Built of Property  
`buildings` - Number of Buildings  
`bedrooms` - Bed Count  
`baths` - Bath Count  
`livingUnits` - Number of Units  
`propertySize` - Property Sq Ft  
`abuttingProperties` - Neighboring Properties  
`abuttingStreets` - Places - Street(s)  
`neighborhood:real` - Places - Neighborhood  
`floodZone` - FEMA Flood Zone  
  
## Transit section:  
  
  
## Planning & Community Development section  
### Fields  
`floodZone` - FEMA Flood Zone (This is from Property Details call)  
  
  
## Service Delivery section  
*will get all this info at a later phase*  
  
  
## Administrative / Regulatory section  
[Example of API call](https://fl-api.gridics.com/api/ui-api?action=_school&type=_school&fields%5B%5D=name&fields%5B%5D=schoolGradesName&fields%5B%5D=capacity&fields%5B%5D=schoolEnroll&fields%5B%5D=currentGrade&rows=10&offset=0&ignoreStatus=1&folio_by_id=824741&f[1]=field_type_school:E&publicToken=3jKTnjs7ddiyg1zJEByPx%2FXra0J8Ch0Q2mLfmNWcSeQ%3D)  
  
### Possible Filters  
`f[1]=field_type_school:E&folio_by_id=824741` - Assigned Elementary School filtered by property id.  
`f[1]=field_type_school:M&folio_by_id=824741` - Assigned Middle School filtered by property id.  
`f[1]=field_type_school:S&folio_by_id=824741` - Assigned High School filtered by property id.  
  
### Fields  
`name` - Assigned Elementary School  
`schoolGradesName` - School Grades  
`capacity` - Capacity  
`schoolEnroll` - Enrollment  
`currentGrade` - Rating  
  
## Assessments section  
[Example of API call](https://fl-api.gridics.com/api/ui-api?action=_tax&type=_tax&fields[]=marketValue&fields[]=landValue&fields[]=buildingValue&fields[]=extraFeatureValue&fields[]=countyTax&fields[]=cityTax&fields[]=assessedValue&fields[]=schoolTax&order_by=taxYear&sort_order=desc&rows=2&offset=0&ignoreStatus=1&folio_by_id=824741&publicToken=3jKTnjs7ddiyg1zJEByPx/Xra0J8Ch0Q2mLfmNWcSeQ=)  
  
### Possible Filters  
`order_by=taxYear` - add field by which we run sorting  
`sort_order=desc` - set ordering option  
`rows=2&offset=0` - rows **must** be set to 2 since we need to compare market value  
`folio_by_id=824741` - add filter by property id  
  
### Fields:  
`marketValue` - Current Just / Market Value  
`landValue` - Just Land Value  
`buildingValue` - Just Building Value  
`extraFeatureValue` - Just Other Value  
`countyTax` - County Taxable Value  
`cityTax` - City Taxable Value  
`assessedValue` - Current Assessed / Save Our Home Value  
`schoolTax` - School Taxable Value  
  
## Sales History section  
[Example of API call](https://fl-api.gridics.com/api/ui-api?action=_recorded_sale&type=_recorded_sale&fields[]=saleDate&fields[]=price&fields[]=pricePerPropertysf&fields[]=transferCode&order_by=saleDate&sort_order=desc&rows=60&offset=0&path=sold&ignoreStatus=1&folio_by_id=824741&publicToken=3jKTnjs7ddiyg1zJEByPx/Xra0J8Ch0Q2mLfmNWcSeQ=)  
### Possible Filters  
`folio_by_id=824741` - Recorded Sale filtered by property id.  
`order_by=saleDate&sort_order=desc` - latest sakes needs to be at top  
`rows=60&offset=0` - just because API needs this  
  
### Fields:  
`saleDate` - 1st Sale Date  
`price` - 1st Sale Amount  
`pricePerPropertysf` - Avg Price per Sq Ft  
`transferCode` - 1st Deed Type  
 

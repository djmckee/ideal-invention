// Client-side JavaScript goes here!!!

/**
* Perform a quick data refresh from the API via AJAX. Then display the data in
* the table, and in a chart.js graph.
*/
function refreshData() {

}

/**
* HTML document has loaded - attach event listeners.
*/
$(document).ready(function() {
    // Page has loaded, do clever stuff...

    // Attach event listeners to the inputs so data is refreshed when they change...
    $('#fromCountryDropdown').change(function(){
        refreshData();
    });
    $('#toCountryDropdown').change(function(){
        refreshData();
    });

});

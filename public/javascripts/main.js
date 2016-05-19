// Client-side JavaScript goes here!!!


var myLineChart;

/**
* Perform a quick data refresh from the API via AJAX. Then display the data in
* the table, and in a chart.js graph.
*/
function refreshData() {
    console.log('refreshData()');
    // Remove existing migration entries...
    $('.migration-table-entry').remove();
    var fromCountryId = $('#fromCountryDropdown').val();
    var toCountryId = $('#toCountryDropdown').val();

    var queryString = "get_data?fromCountryId=" + fromCountryId + "&toCountryId=" + toCountryId;
    console.log(queryString);

    $.get(queryString, function(data) {
        console.log(data);
        // Add table entries...
        var yearLabels = [];
        var gdpValues = [];
        var refugeeCounts = [];

        data.forEach(function(item){
            yearLabels.push(String(item.year));
            gdpValues.push(item.growth * 100);
            refugeeCounts.push(item.refugees);
        });

        var reversedData = data.reverse();

        reversedData.forEach(function(item){
            var plusIcon = '';
            if (item.growth > 0) {
                plusIcon = '+';
            }
            var element = '<tr class="migration-table-entry"><td>' + item.year + '</td><td>' + item.refugees + '</td><td>' + item.totalMigration + '</td><td>' + plusIcon + item.growth.toFixed(2) + '</td></tr>';
            $('#migration-table-body').append(element);
        });

        // TODO: Graph!
        var ctx = $("#chart");


        var data = {
            labels: yearLabels,
            datasets: [
                {
                    label: "∆GDP",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(192, 57, 43,1.0)",
                    borderColor: "rgba(192, 57, 43,1.0)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(192, 57, 43,1.0)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(192, 57, 43,1.0)",
                    pointHoverBorderColor: "rgba(192, 57, 43,1.0)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: gdpValues,
                },
                {
                    label: "Refugees",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: refugeeCounts,
                }
            ]
        };

        if (myLineChart != null) {
            myLineChart.destroy();
            myLineChart = null;
        }

        myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: null
        });

    });
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

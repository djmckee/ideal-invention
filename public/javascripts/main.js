// Client-side JavaScript goes here!!!

var randomScalingFactor = function() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
};
var randomColorFactor = function() {
    return Math.round(Math.random() * 255);
};
var randomColor = function() {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',.7)';
};
/**
* HTML document has loaded - attach event listeners.
*/
$(document).ready(function() {
    $.get("get_data", function(data) {
        console.log(data);
        // Page has loaded, do clever stuff...
        var myChartContext = $('#chart');

        var positiveCountries = [];
        var negativeCountries = [];

        var labels = [];

        for (var i = 0; i < data.length; i++) {
            var country = data[i];

            var multi = Math.abs(country.score);
            if (multi < 0.1) {
                multi = 0.1;
            }

            var graphObject = {x:country.score, y:country.score, r: 30 * multi, label: country.name};
            labels.push(country.name);

            if (country.score > 0) {
                positiveCountries.push(graphObject);
            } else {
                negativeCountries.push(graphObject);
            }
        }

        var bubbleChartData = {
            animation: {
                duration: 10000
            },
            labels: labels,
            datasets: [{
                label: "At risk countries",
                backgroundColor: "rgba(46, 204, 113,1.0)",
                data: negativeCountries
            }, {
                label: "Improving countries",
                backgroundColor: "rgba(192, 57, 43,1.0)",
                data: positiveCountries

            }]
        };

        var myChart = new Chart(myChartContext, {
            type: 'bubble',
            data: bubbleChartData,
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:'Countries at risk of refugee crisis (from IDP growth)'
                },
                options: {
                    tooltipTemplate: "<%= label %> - <%= value %>"
                }
            }
        });
    });

});

/*
 * graph.js
 * 
 * Handle graph creation for NEAT
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */

var neat = neat || {};

google.load('visualization', '1.1', {packages: ['corechart']});

/*
 * createGraph
 *
 * Creates a graph based on the internal state of the NEAT app. Accepts one
 * parameter. If it is true, then the graph is animated when drawn.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.createGraph = function (bAnimate) {

    if (neat.graphType == neat.MAJORS) {
       
        //Setup the DataTable
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Year');
        for (i in neat.selectedMajors) {
            major = neat.selectedMajors[i];
            data.addColumn('number', neat.majorsAbbr[major]);
        }

        //All the data for graph
        rows = [];

        //Add the data to the DataTable
        for (i in neat.dataBase.enrollmentYears) {

            var year = neat.dataBase.enrollmentYears[i];
            var row = [year];

            for (j in neat.selectedMajors) {
                var major = neat.selectedMajors[j];
                var sum = 0;
                //Add up data for all selected classes
                for (k in neat.selectedClasses) { 
                    var cls = neat.selectedClasses[k]
                    sum += neat.dataBase.enrollment[major][year][cls];
                }
                row.push(sum);
            }
            rows.push(row);
        }

        data.addRows(rows);

        //Now with the dataTable set up, we may create the actual graph.
        //Code based off of https://developers.google.com/chart/interactive/docs/gallery/linechart 
        
        var options = {
            title: neat.graphType,
            legend: { position: 'bottom' },
            width: 500,
            height: 500,
        };

        var chart = new google.visualization.LineChart(document.getElementById('graph_div'));
        chart.draw(data, options);

    } else {
        //TODO
    }
}

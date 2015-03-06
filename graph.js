/*
 * graph.js
 * 
 * Handle graph creation for NEAT
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */

var neat = neat || {};

google.load('visualization', '1', {packages: ['corechart']});

/*
 * createGraph
 *
 * Creates a graph based on the internal state of the NEAT app.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.createGraph = function () {
    if (neat.graphType == neat.MAJORS) {
       
       //Code based off of https://developers.google.com/chart/interactive/docs/gallery/linechart 

        //Setup the DataTable
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Year');
        for (i of neat.selectedMajors) {
            data.addColumn('number', neat.majorsAbbr[i]);
        }

        //All the data for graph
        rows = [];

        //Add the data to the DataTable
        for (year of neat.dataBase.enrollmentYears) {

            var row = [year];

            for (i of neat.selectedMajors) {
                var sum = 0;
                //Add up data for all selected classes
                for (cls of neat.selectedClasses) { 
                    sum += neat.dataBase.enrollment[i][year][cls];
                }
                row.push(sum);
            }

            console.log(row);

            rows.push(row);
        }

        data.addRows(rows);



    } else {
        //TODO
    }
}

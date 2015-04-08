/*
 * graph.js
 * 
 * Handle graph creation for NEAT
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */

var neat = neat || {};

neat.graph_options = {
    legend: { position: 'bottom' },
    hAxis: {format: '####'},
};

neat.line_options = {};
neat.line_options[neat.EE] = {color: 'green'};
neat.line_options[neat.CS] = {color: 'blue'};
neat.line_options[neat.ME] = {color: 'red'};
neat.line_options[neat.CE] = {color: 'gray'};

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
        data = new google.visualization.DataTable();
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
        
        neat.graph_data = data;

        //Set the title of the graph to be appropriate to the tab we are on.
        neat.graph_options.title = neat.graphType;

        //Set the properties specific to each line
        neat.graph_options.series = {};
        for (var i=0; i < neat.selectedMajors.length; ++i) {
            neat.graph_options.series[i] = 
                neat.line_options[neat.selectedMajors[i]];
        }

        neat.current_chart = new google.visualization.LineChart(document.getElementById('majors_graph_div'));

        neat.resizeGraph();
    } else {
        //TODO
    }
}

/*
 * resizeGraph
 *
 * Resizes the current graph 
 * parameter. If it is true, then the graph is animated when drawn.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.resizeGraph = function() {

    var disp_div;
    var menu_div;

    if (neat.graphType == neat.MAJORS) {
        disp_div = document.getElementById("majors_disp_div");
        menu_div = document.getElementById("majors_menu_div");
    } else {
        disp_div = document.getElementById("profs_disp_div");
        menu_div = document.getElementById("profs_menu_div");
    }

    neat.graph_options.height = disp_div.offsetHeight * .84;
    neat.graph_options.width = (disp_div.offsetWidth - menu_div.offsetWidth);

    neat.current_chart.draw(neat.graph_data, neat.graph_options);
}


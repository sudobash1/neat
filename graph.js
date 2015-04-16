/*
 * graph.js
 * 
 * Handle graph creation for NEAT
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */

var neat = neat || {};

//Set the default graph options
neat.graph_options = {
    animation: {
        startup: true,
        duration: 1000,
        easing: 'out',
    },
    legend: { position: 'bottom' },
    hAxis: {
        format: '####',
        title: 'Year (Spring Semester)'
    },
    vAxis: {
        title: 'Students Enrolled',
        format: '#',
        minValue: 0
    },
};

//Set custom options for each line.
neat.line_options = {};
neat.line_options[neat.EE] = {color: 'green'};
neat.line_options[neat.CS] = {color: 'blue'};
neat.line_options[neat.ME] = {color: 'red'};
neat.line_options[neat.CE] = {color: 'gray'};

google.load('visualization', '1.1', {packages: ['corechart']});

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
       
        //Setup the DataTable
        data = new google.visualization.DataTable();
        data.addColumn('number', 'Year');
        for (i in neat.selectedMajors) {
            major = neat.selectedMajors[i];
            data.addColumn('number', neat.majorsAbbr[major]);
            data.addColumn({type: 'string', role: 'tooltip'});
        }

        //All the data for graph
        rows = [];

        //Add the data to the DataTable
        for (var i=0; i < neat.dataBase.enrollmentYears.length; ++i) {

            var year = neat.dataBase.enrollmentYears[i];
            var row = [year];

            for (var j=0; j < neat.selectedMajors.length; ++j) {

                var major = neat.selectedMajors[j];
                var sum = 0;
                var comment = "";

                //Add up data for all selected classes
                for (var k=0; k < neat.selectedClasses.length; ++k) {

                    var cls = neat.selectedClasses[k]
                    var classEnrollemnt = 
                        neat.dataBase.enrollment[major][year][cls];
                    sum += classEnrollemnt;

                    // Add to the comment the number of students for this 
                    // class
                    comment += classEnrollemnt + " " + neat.classes[cls];
                    comment += " " + " students\n";
                }

                if (neat.selectedClasses.length > 1) {
                    comment += "\n" + sum + " total";
                }

                row.push(sum);
                row.push(comment);
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

        neat.graph_options.vAxis.maxValue = neat.dataBase.maxEnrollent;

        neat.current_chart = new google.visualization.LineChart(
            document.getElementById('google_graph_div')
        );

        neat.resizeGraph();

        //After we create the graph for the first time, remove animation
        neat.graph_options.animation = null;
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

    var disp_div = document.getElementById("disp_div");
    var menu_div = document.getElementById("menu_div");

    //Calculate the dimensions of the graph to fit ideally.
    height = disp_div.offsetHeight * .84;
    width = (disp_div.offsetWidth - menu_div.offsetWidth);

    neat.graph_options.height = height
    neat.graph_options.width = width

    neat.current_chart.draw(neat.graph_data, neat.graph_options);
}


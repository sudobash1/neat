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
neat.profs_line_options = {color: 'green'};

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
        //We are displaying the MAJORS graph
       
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

                var comment = "In " + year + " the " + 
                    neat.majorsAbbr[major] + " enrollment was:\n\n";

                //Add up data for all selected classes
                for (var k=0; k < neat.selectedClasses.length; ++k) {

                    var cls = neat.selectedClasses[k]
                    var classEnrollment = 
                        neat.dataBase.enrollment[major][year][cls];
                    sum += classEnrollment;

                    // Add to the comment the number of students for this 
                    // class
                    comment += classEnrollment + " " + neat.classes[cls];
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

        neat.graph_data = data;

        //Set the title of the graph to be appropriate to the tab we are on.
        neat.graph_options.title = neat.graphType;
        neat.graph_options.vAxis.title = 'Students Enrolled';

        //Set the properties specific to each line
        neat.graph_options.series = {};
        for (var i=0; i < neat.selectedMajors.length; ++i) {
            neat.graph_options.series[i] = 
                neat.line_options[neat.selectedMajors[i]];
        }

        neat.graph_options.vAxis.maxValue = neat.dataBase.maxEnrollent;

    } else {
        //We are displaying the PROFESSORS graph.

        //Setup the DataTable
        data = new google.visualization.DataTable();
        data.addColumn('number', 'Year');

        if (neat.profs_ratio_display) {
            data.addColumn('number', 'CS student:professor ratio');
            data.addColumn({type: 'string', role: 'tooltip'});
        } else {
            data.addColumn('number', 'CS students');
            data.addColumn({type: 'string', role: 'tooltip'});
            data.addColumn('number', 'CS professors');
            data.addColumn({type: 'string', role: 'tooltip'});
        }

        //All the data for graph
        rows = [];

        //Add the data to the DataTable
        for (var i=0; i < neat.dataBase.years.length; ++i) {

            var year = neat.dataBase.years[i];
            var row = [year];

            var students_sum = 0;

            var students_comment = "In " + year + " the CS enrollment was:\n\n";

            //Add up data for all selected classes
            for (var k=0; k < neat.selectedClasses.length; ++k) {

                var cls = neat.selectedClasses[k]
                var classEnrollment = 
                    neat.dataBase.enrollment[neat.CS][year][cls];
                students_sum += classEnrollment;

                // Add to the comment the number of students for this 
                // class
                students_comment += classEnrollment + " " + neat.classes[cls];
                students_comment += " " + " students\n";
            }

            var profs_sum = 0;
            var profs_comment = "";

            console.log(year);
            var profs = neat.dataBase.profs[year];
            profs_comment = "In " + year + " the CS professors were:\n";
            for (var k=0; k < profs.length; ++k) {
                profs_comment += "\n" + profs[k];
            }

            if (neat.selectedClasses.length > 1) {
                students_comment += "\n" + students_sum + " total";
            }

            if (neat.profs_ratio_display) {
                var ratio = students_sum / profs.length;
                var comment = profs_comment + "\n\n" + students_comment + 
                    "\n\n student:professor ratio " + ratio;
                row.push(ratio);
                row.push(comment);
            } else {
                row.push(students_sum);
                row.push(students_comment);
                row.push(profs.length);
                row.push(profs_comment);
            }

            rows.push(row);
        }

        data.addRows(rows);

        neat.graph_data = data;

        delete neat.graph_options.vAxis.maxValue

        neat.graph_options.series = {};
        if (neat.profs_ratio_display) {
            neat.graph_options.series[0] = neat.profs_line_options;
            neat.graph_options.vAxis.title = 'Student:Professor Ratio';
        } else {
            neat.graph_options.series[0] = neat.line_options[neat.CS]
            neat.graph_options.series[1] = neat.profs_line_options;
            neat.graph_options.vAxis.title = 'Count';
        }
    }

    //Set the title of the graph to be appropriate to the tab we are on.
    neat.graph_options.title = neat.graphType;

    neat.current_chart = new google.visualization.LineChart(
        document.getElementById('google_graph_div')
    );

    neat.resizeGraph();

    // After we create the graph for the first time, remove animation
    neat.graph_options.animation = null;

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


/*
 * neat.js
 *
 * Page control file.
 * The master js for the NEAT App.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */

var neat = neat || {};

//Keep track of the current graph type.

//graphType enum
neat.MAJORS = "Number of students declaired per major.";
neat.PROFS = "Number of CS students compared to CS professors.";

neat.graphType = neat.MAJORS;

//Enum for the different classes
neat.FRESHMAN = 0;
neat.SOPHMORE = 1;
neat.JUNIOR = 2;
neat.SENIOR = 3;

//Currently selected classes
neat.selectedClasses = [neat.FRESHMAN,
                        neat.SOPHMORE,
                        neat.JUNIOR,
                        neat.SENIOR];

//The different class's names indexed.
neat.classes = ['Freshman', 'Sophmore', 'Junior', 'Senior'];

//Enum for the different majors
neat.EE = 0;
neat.CS = 1;
neat.ME = 2;
neat.CE = 3;

//Currently selected majors
neat.selectedMajors = [neat.EE,
                       neat.CS,
                       neat.ME,
                       neat.CE];

//The different major's abbreviations indexed.
neat.majorsAbbr = ['EE', 'CS', 'ME', 'CE'];
//The different major's full names indexed.
neat.majors = ['Electrical Engineering',
               'Computer Science',
               'Mechanical Engineering',
               'Civil Engineering'];

/*
 * init 
 *
 * initialize the NEAT app. Cache the data and make sure the DOM matches the
 * app's internal state.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.init = function() {

    neat.updateChecks();

    neat.cacheData(function(){

        animation.stopSpinners();
        hidden_elts = document.getElementsByClassName('hide_until_init')
        for (i = 0; i < hidden_elts.length; i++){
            hidden_elts[i].style.visibility = "visible";
        }

        neat.createGraph(true);
    });
}

/*
 * updateChecks
 *
 * Update the check boxes shown on the html document to reflect the
 * internal state of the NEAT app.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.updateChecks = function() {
    for (i = neat.majors.length - 1; i >= 0; --i) {
        var selected = (neat.selectedMajors.indexOf(i) >= 0);
        document.getElementById(neat.majorsAbbr[i]).checked = selected; 
    }
}

/*
 * updateGraph
 * 
 * The is the callback for whenever a checkbox/radio button is ticked or
 * unticked. It will call update the state of the checked options and call
 * neat.createGraph.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.updateGraph = function() {
    neat.selectedMajors = [];
    for (i = neat.majors.length - 1; i >= 0; --i) {
        if (document.getElementById(neat.majorsAbbr[i]).checked) {
            neat.selectedMajors.push(i);
        }
    }

    if (neat.selectedMajors.length > 0) {
        //We are just updating the graph, so do not animate it.
        neat.createGraph(false);
    } else {
        document.getElementById("graph_div").innerHTML = "Please select majors to display."
    }
}

/*
 * namesController
 * 
 * Allow angular to access class and major names
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.namesController = function ($scope, $timeout) {
    $scope.classes = neat.classes;
    $scope.majorsAbbr = neat.majorsAbbr;
    $scope.majors = neat.majors;
    $timeout(neat.init, 0);
}


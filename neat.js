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

//the display divs for the different data the app can display
neat.MAJORS_TAB_DIV = "majors_tab_div";
neat.PROFS_TAB_DIV = "profs_tab_div";

//the current graph type
neat.graphType = neat.MAJORS;

//Enum for the different classes
neat.FRESHMAN = 0;
neat.SOPHMORE = 1;
neat.JUNIOR = 2;
neat.SENIOR = 3;

neat.CLASSES_COUNT = 4;

//Whether or not to display professor student data as a ratio.
neat.profs_ratio_display = true;

//Currently selected classes
neat.selectedClasses = [neat.FRESHMAN, neat.SOPHMORE, neat.JUNIOR,
                        neat.SENIOR];

//The different class's names indexed.
neat.classes = ['Freshman', 'Sophmore', 'Junior', 'Senior'];

//Enum for the different majors
neat.EE = 0;
neat.CS = 1;
neat.ME = 2;
neat.CE = 3;

neat.MAJORS_COUNT = 4;

//Currently selected majors
neat.selectedMajors = [neat.EE, neat.CS, neat.ME, neat.CE];


//The different major's abbreviations indexed by the enum.
neat.majorsAbbr = ['EE', 'CS', 'ME', 'CE'];
//The different major's full names indexed by the enum.
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
    neat.hideClass('profs_display');

    neat.cacheData(function(){
        animation.stopSpinners();
        neat.unhideClass('hide_until_init');
        neat.createGraph();
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
    for (i = neat.MAJORS_COUNT - 1; i >= 0; --i) {
        var selected = (neat.selectedMajors.indexOf(i) >= 0);
        document.getElementById(neat.majorsAbbr[i]).checked = selected; 
    }

    for (i = neat.CLASSES_COUNT - 1; i >= 0; --i) {
        var selected = (neat.selectedClasses.indexOf(i) >= 0);
        document.getElementById(neat.classes[i]).checked = selected; 
    }

    if (neat.profs_ratio_display) {
        document.getElementById("profs_ratio").checked = true;
    } else {
        document.getElementById("profs_raw").checked = true;
    }
}

/*
 * switchTabTo
 *
 * Perform a swich to change the type of data the NEAT app is displaying.
 *
 * @author Stephen Robinson
 * @since: Mar 19, 2015
 */
neat.switchTabTo = function(graphType) {

    if (graphType != neat.graphType) {

        neat.graphType = graphType;

        majorsTab = document.getElementById(neat.MAJORS_TAB_DIV);
        profsTab = document.getElementById(neat.PROFS_TAB_DIV);

        // Hide the graph for now
        document.getElementById("google_graph_div").innerHTML = "";

        // Change the tab design and display only the elements which are
        // relevant to this tab.
        if (graphType == neat.MAJORS) {
            majorsTab.className = "tab";
            profsTab.className = "tab non_selected_tab";

            neat.hideClass('profs_display');
            neat.unhideClass('majors_display');

        } else {
            majorsTab.className = "tab non_selected_tab";
            profsTab.className = "tab";

            neat.hideClass('majors_display');
            neat.unhideClass('profs_display');
        }

        //OK, now we are ready for the new graph
        neat.updateGraph();
    }
}

/*
 * hideClass
 *
 * All html elements with the specified class name are hidden.
 *
 * @author Stephen Robinson
 * @since: Apr 16, 2015
 */
neat.hideClass = function(className) {
    var hide_els = document.getElementsByClassName(className);
    for (var i=0; i < hide_els.length; ++i) {
        hide_els[i].style.visibility = "hidden";
        hide_els[i].style.display = "none";
    }
}

/*
 * unhideClass
 *
 * All html elements with the specified class name are unhidden.
 * The display style will be set to block.
 *
 * @author Stephen Robinson
 * @since: Apr 16, 2015
 */
neat.unhideClass = function(className) {
    var unhide_els = document.getElementsByClassName(className);
    for (var i=0; i < unhide_els.length; ++i) {
        unhide_els[i].style.visibility = "visible";
        unhide_els[i].style.display = "block";
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
    for (majorNum = neat.MAJORS_COUNT - 1; majorNum >= 0; --majorNum) {
        if (document.getElementById(neat.majorsAbbr[majorNum]).checked) {
            neat.selectedMajors.push(majorNum);
        }
    }

    neat.selectedClasses = [];
    for (classNum = neat.CLASSES_COUNT - 1; classNum >= 0; --classNum) {
        if (document.getElementById(neat.classes[classNum]).checked) {
            neat.selectedClasses.push(classNum);
        }
    }

    if (neat.selectedMajors.length > 0) {
        if (neat.selectedClasses.length > 0) {
            neat.createGraph();
        } else {
            document.getElementById("google_graph_div").innerHTML =
                "Please select classes to display.";
        }
    } else {
        document.getElementById("google_graph_div").innerHTML =
            "Please select majors to display.";
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


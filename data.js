/*
 * data.js
 *
 * Handle obtaining and processing all the enrollment and teacher data from
 * the Google Fusion Tables.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */

var neat = neat || {};

neat.dataBase = {

    // A dictionary with keys being year numbers and the items being a list
    // of CS professors teaching that year.
    profs: {},

    //The years we have of prof data sorted low to high.
    profYears: [],

    // An object containing enrollment data for each major. For each major
    // there is a dict associating years to a list containing the enrollment
    // for each class.
    enrollment: {},

    //The years we have of enrollment data sorted low to high.
    enrollmentYears: [],

    //The years we have of prof and enrollment data sorted low to high.
    years: [],

    //The maximum total enrollment for a year in any discipline,
    maxEnrollent: 1,
};

//Initialize the enrollment data to an empty array for each major
neat.dataBase.enrollment[neat.CS] = {};
neat.dataBase.enrollment[neat.EE] = {};
neat.dataBase.enrollment[neat.ME] = {};
neat.dataBase.enrollment[neat.CE] = {};


//Our Google API key.
neat.key = 'AIzaSyAoPgc2vvLx1clco30E9PwsP4f2deS3iSA'


/*
 * casheData
 *
 * Pull and preprocess all the data from the fusion table. We will load all
 * the data at once.
 *
 * Accepts as an argument a function to run on data loading completion.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.cacheData = function(done) {
    return neat.getProfessorData().done( function(){
        neat.getEnrollmentData()
            .done( function() {

                //Determine which years are in common.
                for (var i = 0; i < neat.dataBase.profYears.length; ++i) {
                    var index =
                        neat.dataBase.enrollmentYears.indexOf(
                            neat.dataBase.profYears[i]
                    );

                    if (index >= 0) {
                        neat.dataBase.years.push(neat.dataBase.profYears[i]);
                    }
                }
                done();
            })

    });
}

/* 
 * getProfessorData
 *
 * Pull and preprocess all the data from the professor fusion table.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.getProfessorData = function() {

    /*************************************************************************
     * Professor data
     *
     * The professor fusion table has the columns.
     *
     * name: The professor's name. Must be unique.
     * start: The year the professor started.
     * end: The year the professor left.
     *
     *************************************************************************/

    var profTable = '19O_duUEyzyvPIIF2PgL42ayPX4jvLfjoeDqsl-Ih';

    // get the data from the professor data fusion table
    var query = "SELECT * FROM " + profTable;
    var encodedQuery = encodeURIComponent(query);

    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=' + neat.key);

    url = url.join('');

    return $.getJSON(url, function(data) {
        rows = data['rows']

        for (var i in rows) {
            var name = rows[i][0];
            var start = new Date(Date.parse(rows[i][1]));
            var end = new Date(Date.parse(rows[i][2]));

            for (var year = start.getFullYear(); year <= end.getFullYear(); ++year) {
                if (neat.dataBase.profs[year] == undefined) {
                    neat.dataBase.profs[year] = [name];
                } else {
                    neat.dataBase.profs[year].push(name);
                }

                if (neat.dataBase.profYears.indexOf(year) < 0) {
                    neat.dataBase.profYears.push(year);
                }
            }
        }
        neat.dataBase.profYears.sort();
    });
}

/* 
 * getEnrollmentData
 *
 * Pull and preprocess all the data from the enrolled fusion table.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.getEnrollmentData = function() {

    /*************************************************************************
     * Enrollment data
     *
     * The engineering enrollment fusion table has the columns:
     *
     * Year: The year for this entry.
     * EE: The number of EE students enrolled this year. (All classes)
     * CS: The number of CS students enrolled this year. (All classes)
     * ME: The number of ME students enrolled this year. (All classes)
     * CE: The number of CE students enrolled this year. (All classes)
     *
     * TODO: We need to further split our columns. We need to have students in
     * each major & class. For now we are assuming that everyone is a senior.
     *
     *************************************************************************/

    var enrollmentTable = '1oBObMleyP9ci-LNUlSS5zyDX21aRa93lmVvLLiik';

    // get the data from the enrollment data fusion table
    var query = "SELECT * FROM " + enrollmentTable;
    var encodedQuery = encodeURIComponent(query);

    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=' + neat.key);

    url = url.join('');

    return $.getJSON(url, function(data) {
        rows = data['rows']

        for (var i in rows) {
            var year = parseInt(rows[i][0]);

            var ce_freshman = parseInt(rows[i][1]);
            var ce_sophmore = parseInt(rows[i][2]);
            var ce_junior = parseInt(rows[i][3]);
            var ce_senior = parseInt(rows[i][4]);

            var cs_freshman = parseInt(rows[i][5]);
            var cs_sophmore = parseInt(rows[i][6]);
            var cs_junior = parseInt(rows[i][7]);
            var cs_senior = parseInt(rows[i][8]);

            var ee_freshman = parseInt(rows[i][9]);
            var ee_sophmore = parseInt(rows[i][10]);
            var ee_junior = parseInt(rows[i][11]);
            var ee_senior = parseInt(rows[i][12]);

            var me_freshman = parseInt(rows[i][13]);
            var me_sophmore = parseInt(rows[i][14]);
            var me_junior = parseInt(rows[i][15]);
            var me_senior = parseInt(rows[i][16]);

            neat.dataBase.enrollment[neat.EE][year] = [
                ee_freshman, ee_sophmore, ee_junior, ee_senior
            ];
            neat.dataBase.enrollment[neat.CS][year] = [
                cs_freshman, cs_sophmore, cs_junior, cs_senior
            ];
            neat.dataBase.enrollment[neat.ME][year] = [
                me_freshman, me_sophmore, me_junior, me_senior
            ];
            neat.dataBase.enrollment[neat.CE][year] = [
                ce_freshman, ce_sophmore, ce_junior, ce_senior
            ];

            neat.dataBase.enrollmentYears.push(year);

            //Determine what the maximum enrollment is so we can set the vAxis
            //height.
            yearsMaxEnrollent = Math.max(
                ee_freshman + ee_sophmore + ee_junior + ee_senior,
                cs_freshman + cs_sophmore + cs_junior + cs_senior,
                me_freshman + me_sophmore + me_junior + me_senior,
                ce_freshman + ce_sophmore + ce_junior + ce_senior
            );

            neat.dataBase.maxEnrollent = Math.max(
                yearsMaxEnrollent,
                neat.dataBase.maxEnrollent
            );

        }
        neat.dataBase.enrollmentYears.sort();
    });
}

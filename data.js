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
    profs : {},

    // A list containing enrollemnt data for each major. For each major there
    // is a dict associating years to a list containing the enrollment for
    // each class.
    enrollment : [
        {},
        {},
        {},
        {},
    ],
};

/*
 * casheData
 *
 * Pull and preprocess all the data from the fusion table. We will load all
 * the data at once.
 *
 * @author Stephen Robinson
 * @since: Mar 5, 2015
 */
neat.cacheData = function() {

    //Our API key.
    key = 'AIzaSyAoPgc2vvLx1clco30E9PwsP4f2deS3iSA'

    /*************************************************************************
     * Professor data
     *
     * Download the professor data from the professor fusion table.
     * The professor fusion table has the columns.
     *
     * name: The professor's name. Must be unique.
     * start: The year the professor started.
     * end: The year the professor left.
     *
     *************************************************************************/

    var profTable = '1Jtr4Bk4CD0pBHw3A7WQiY3k50Dk-vp1KF9minqMr';

    // get the data from the professor data fusion table
    var query = "SELECT * FROM " + profTable;
    var encodedQuery = encodeURIComponent(query);

    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=' + key);

    url = url.join('');

    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function (data) {

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
                }
            }
        }
    });

    /*************************************************************************
     * Enrollment data
     *
     * Download the engineering enrollment data from the fusion table.
     * The engineering enrollment fusion table has the columns.
     *
     * TODO: We need to further split our columns. We need to have students in
     * each major & class. For now we are assuming that everyone is a senior.
     *
     * Year: The year for this entry.
     * EE: The number of EE students enrolled this year. (All classes)
     * CS: The number of CS students enrolled this year. (All classes)
     * ME: The number of ME students enrolled this year. (All classes)
     * CE: The number of CE students enrolled this year. (All classes)
     *
     *************************************************************************/

    var enrollmentTable = '1IZjUJRBNObS2hIUrCW44zTaLvvS8RgFSOmBT3vBR';

    // get the data from the enrollment data fusion table
    var query = "SELECT * FROM " + enrollmentTable;
    var encodedQuery = encodeURIComponent(query);

    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=' + key);

    url = url.join('');

    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function (data) {

            rows = data['rows']

            for (var i in rows) {
                var year = rows[i][0];

                var ee_freshman = 0; //XXX
                var ee_sophmore = 0; //XXX
                var ee_junior = 0; //XXX
                var ee_senior = rows[i][1];

                var cs_freshman = 0; //XXX
                var cs_sophmore = 0; //XXX
                var cs_junior = 0; //XXX
                var cs_senior = rows[i][2];

                var me_freshman = 0; //XXX
                var me_sophmore = 0; //XXX
                var me_junior = 0; //XXX
                var me_senior = rows[i][3];

                var ce_freshman = 0; //XXX
                var ce_sophmore = 0; //XXX
                var ce_junior = 0; //XXX
                var ce_senior = rows[i][4];

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
            }
        }
    });
}

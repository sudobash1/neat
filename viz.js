/*
* viz.js
*
*Runs a query on our fusion table to gather and chart dummy data
* That is currently stored in the table.

* Initial code based on an example provided in the Google Charts API
* documentation. See:
*
* https://developers.google.com/chart/interactive/docs/gallery/columnchart#Examples
*
* @author: Chandler Underwood
* @since: Feb 10, 2015
*/

// <script type="text/javascript" src="https://www.google.com/jsapi?autoload={'modules':[{'name':'visualization', 'version':'1','packages':['timeline']}]}"></script>

google.load('visualization', '1', {packages: ['corechart', 'timeline']});
function drawVisualization() 
{
    // draw the line chart
    google.visualization.drawChart(
    {
        "containerId": "line_visualization_div",
        "dataSourceUrl": 'https://www.google.com/fusiontables/gvizdata?tq=',
        "query":"SELECT Year, EE, CS, ME, CE FROM 19OmeFKjr6yVPNLqJn8it05u-uvTD1ggKjDxfJYpd",
        "refreshInterval": 5,
        "chartType": "LineChart",
        "options": 
        {
            "title":"Students enrolled in a given major.",
            "vAxis": {"title": "# of Degrees"},
            "hAxis": {"title": "Date"},
        }
    });

    //get the data from the fusion table
    var query = "SELECT * FROM 1Jtr4Bk4CD0pBHw3A7WQiY3k50Dk-vp1KF9minqMr";
    var encodedQuery = encodeURIComponent(query);

     // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=AIzaSyAoPgc2vvLx1clco30E9PwsP4f2deS3iSA');

    url = url.join('')

    var rows = []
    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function (data) {

            var container = document.getElementById('time_visualization_div');
            var chart = new google.visualization.Timeline(container);
            var dataTable = new google.visualization.DataTable();

            dataTable.addColumn({ type: 'string', id: 'Name' });
            dataTable.addColumn({ type: 'date', id: 'Start' });
            dataTable.addColumn({ type: 'date', id: 'End' });

            var json_rows = data['rows'];
            
            for (var i in json_rows) {
                var name = json_rows[i][0];
                var start = new Date(Date.parse(json_rows[i][1]));
                var end = new Date(Date.parse(json_rows[i][2]));
                rows.push([name, start, end]);
            }

            dataTable.addRows(rows);
            chart.draw(dataTable);
        }
    });
}

google.setOnLoadCallback(drawVisualization);

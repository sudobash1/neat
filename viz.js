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
    google.load('visualization', '1', {packages: ['corechart']});
    function drawVisualization() 
	{
      google.visualization.drawChart(
	  {
        "containerId": "visualization_div",
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
   }

    google.setOnLoadCallback(drawVisualization);

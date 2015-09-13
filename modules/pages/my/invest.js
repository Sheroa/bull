/**
 * @function : 我要理财
 * @author :  ZY
 */


 var api     = require("api/api"),
 	sidebar = require("util/sidebar"),
 	toolbar = require('util/toolbar_pp'),
  	navBar = require("util/navbar");

  toolbar.init();

  navBar.init(index);
  sidebar.init();

  var invest = {
  	init:function(){
  		var data = [
  		    {
  		        value: 100,
  		        color:"#F7464A",
  		        highlight: "#FF5A5E",
  		        label: "Red"
  		    },
  		    {
  		        value: 50,
  		        color: "#46BFBD",
  		        highlight: "#5AD3D1",
  		        label: "Green"
  		    },
  		    {
  		        value: 50,
  		        color: "#FDB45C",
  		        highlight: "#FFC870",
  		        label: "Yellow"
  		    }
  		]

  		var ctx = document.getElementById("myChart_finance").getContext("2d");
  		var ctx_1 = document.getElementById("myChart_revenue").getContext("2d");
  		new Chart(ctx).Pie(data);
  		new Chart(ctx_1).Pie(data);
  	},
  	UI:function(){

  	}
  }

  invest.init();
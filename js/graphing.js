var mode = false;
var noScoreSeries = [];
var scoreSeries = [];
var descriptionData = [];
var chart = nv.models.lineChart();

function getData(subreddit, topic, startDate, endDate, series, series2, callback) {
    console.log("Requested ", subreddit, topic);
    $.post("/process", {subreddit: subreddit, topic: topic, startDate: startDate, endDate: endDate})
    .done(function(data) {
        console.log(data);
        processData(data, series, series2);
        callback();
    })
    .fail(function(err) {
        console.log("Failed");
    });
}

var processData = function(data, series, series2) {
    var response;
    try {
       response = JSON.parse(data);
    }
    catch(err) {
    }
    if(typeof response == 'object'){
        data = response;
    }
    var otherInfo = [];
    var init = new Date(0);
    init.setUTCSeconds(data.data[0].created);
    var tempMonth = init.getMonth();
    var tempYear = init.getFullYear();
    var num = 0;
    var score = 0;
    for (var i = 0; i < data.data.length; i++) {
        var d = new Date(0);
        d.setUTCSeconds(data.data[i].created);
        if (tempMonth != d.getMonth()) {
            var tempDay = new Date(0);
            tempDay.setMonth(tempMonth, 1);
            tempDay.setFullYear(tempYear);
            series.push({
                x: tempDay,
                y: num
            });
            series2.push({
                x: tempDay,
                y: score
            });
            descriptionData.push({date: tempDay, info: otherInfo});
            otherInfo = [];
            tempMonth--;
            if (tempMonth == -1) {
                tempMonth = 11;
                tempYear--;
            }
            num = 0;
            score = 0;
        }
        if (tempMonth == d.getMonth()) {
            score += parseInt(data.data[i].score);
            num += 1;
            otherInfo.push({date: data.data[i].created, permalink: data.data[i].permalink, title: data.data[i].title, score: data.data[i].score});
            if(i == data.data.length -1){
                var tempDay = new Date(0);
                tempDay.setMonth(tempMonth, 1);
                tempDay.setFullYear(tempYear);
                series.push({
                    x: tempDay,
                    y: num
                });
                series2.push({
                    x: tempDay,
                    y: score
                });
            }
        }
    }
}

function modeChangeData(callback){
    if(mode == false){
        return noScoreSeries;
    }
    else{
        return scoreSeries;
    }
}

function changeMode(){
    if(mode == true){
        mode = false;
        document.getElementById("modeText").innerText = "Hits";
    }
    else{
        mode = true;
        document.getElementById("modeText").innerText = "Score";
    }

    d3.select("svg")
    .datum(modeChangeData(function() {
        chart.update();
    }))
    .transition().duration(500).call(chart);
    chart.xAxis.axisLabel("Date (m/y)").tickFormat(function(d) {
        return d3.time.format("%m/%y")(new Date(d))
    });
    chart.yAxis
    .axisLabel("Y-axis Label")
    .tickFormat(d3.format("d"));

    nv.utils.windowResize(
        function() {
            chart.update();
        }
        );
}

function addKeyword(){
    d3.select("svg")
    .datum(insertData(function() {
        chart.update();
    }))
    .transition().duration(500).call(chart);
    chart.xAxis.axisLabel("Date (m/y)").tickFormat(function(d) {
        return d3.time.format("%m/%y")(new Date(d))
    });
    chart.yAxis
    .axisLabel("Y-axis Label")
    .tickFormat(d3.format("d"));

    nv.utils.windowResize(
        function() {
            chart.update();
        }
        );
}

function insertData(callback) {
    var beginDate = new Date();
    if(document.getElementById("datepicker").value == ""){
        beginDate.setFullYear(2005, 5, 23);
    }
    else{
        var d = document.getElementById("datepicker").value;
        var month = parseInt(d[0].concat(d[1]));
        var day = parseInt(d[3].concat(d[4]));
        var year = parseInt(d[6].concat(d[7]).concat(d[8]).concat(d[9]));
        beginDate.setFullYear(year,month-1,day);
    }
    var endDate = new Date();
    if(document.getElementById("datepicker2").value != ""){
        var d = document.getElementById("datepicker2").value;
        var month = parseInt(d[0].concat(d[1]));
        var day = parseInt(d[3].concat(d[4]));
        var year = parseInt(d[6].concat(d[7]).concat(d[8]).concat(d[9]));
        endDate.setFullYear(year,month-1,day);
    }
    var tempScoreSeries = [];
    var tempNoScoreSeries = [];
    getData(document.getElementById("subreddit").value, document.getElementById("keyword").value, Math.round(beginDate.getTime()/1000), Math.round(endDate.getTime()/1000), tempNoScoreSeries, tempScoreSeries,callback);
    var tempNoScore = {
        key: document.getElementById("keyword").value,
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: document.getElementById("keyword").value,
        values: tempScoreSeries
    };
    noScoreSeries.push(tempNoScore);
    scoreSeries.push(tempScore);
    if(mode == false){
        return noScoreSeries;
    }
    else{
        return scoreSeries;
    }
}


function myData(callback) {
    return [];
}

function clearGraph(){
    noScoreSeries = [];
    scoreSeries = [];
    d3.selectAll("svg > *").remove();
}



$(document).ready(function(){
    $('#description').DataTable( 
        {"columns":[
        {"title": "Date"},
        {"title": "Title"},
        {"title": "Score"},
        {"title": "Link"}
        ],
        "order": [[ 2, "desc" ]],
        "filter" : false,
        "bLengthChange": false,
        "iDisplayLength": 10
    } );
});

$(function() {
    $( "#datepicker" ).datepicker();
});
$(function() {
    $( "#datepicker2" ).datepicker();
});
chart.lines.dispatch.on('elementClick', function(e) {
   var pointOnChart = e.point.x;
   $("#description").DataTable().clear();
   for (var i = 0; i < descriptionData.length; i++) {
    if(pointOnChart == descriptionData[i].date){
       $(descriptionData[i].info).each(function(index, element){  
        var d = new Date(0);
        d.setUTCSeconds(element.date);
        $('#description').DataTable().row.add([(d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear(),element.title,element.score,'<a href="'+ element.permalink + '">Link</a>']).draw();       
    })
   }
}
$('#description').DataTable().columns.adjust().draw();
});

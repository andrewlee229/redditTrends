var mode = false;
var noScoreSeries = [];
var scoreSeries = [];
var descriptionData = [];
var chart = nv.models.lineChart();
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
function getData(subreddit, topic, startDate, endDate, series, series2, callback) {
    console.log("Requested ", subreddit, topic);
    $.post("/process", {subreddit: subreddit, topic: topic, startDate: startDate, endDate: endDate})
    .done(function(data) {
        console.log(data);
        processData(data, series, series2);
        callback();
    })
    .fail(function(err) {
        console.log("It faiiiiillleeeeeddd :(((");
    });
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
// THIS JUST TEMPORARY UNTIL I FIGURE OUT HOW TO DO BETTER AT THE PRESENTS
// THIS TRIPLES THE CODE PRETTY MUCH :(
// BEGINNING OF BAD CODE
function addMusic(){
    d3.select("svg")
    .datum(insertData1(function() {
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
function insertData1(callback) {
    var tempScoreSeries = [];
    var tempNoScoreSeries = [];
    getData1(document.getElementById("subreddit").value, document.getElementById("keyword").value, tempNoScoreSeries, tempScoreSeries, 0, callback);
    var tempNoScore = {
        key: "One Direction",
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: "One Direction",
        values: tempScoreSeries
    };
    noScoreSeries.push(tempNoScore);
    scoreSeries.push(tempScore);
    tempScoreSeries = [];
    tempNoScoreSeries = [];
    getData1(document.getElementById("subreddit").value, document.getElementById("keyword").value, tempNoScoreSeries, tempScoreSeries, 1, callback);
    var tempNoScore = {
        key: "Wu Tang Clan",
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: "Wu Tang Clan",
        values: tempScoreSeries
    };
    noScoreSeries.push(tempNoScore);
    scoreSeries.push(tempScore);
    tempScoreSeries = [];
    tempNoScoreSeries = [];
    getData1(document.getElementById("subreddit").value, document.getElementById("keyword").value, tempNoScoreSeries, tempScoreSeries, 2, callback);
    var tempNoScore = {
        key: "Taylor Swift",
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: "Taylor Swift",
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
function getData1(subreddit, topic, series, series2, number, callback) {
        $.post("/music", {num: number})
        .done(function(data) {
            processData(data, series, series2);
            callback();
        })
        .fail(function(err) {
            console.log("It faiiiiillleeeeeddd :(((");
        });
}
function addProgramming(){
    d3.select("svg")
    .datum(insertData2(function() {
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
function insertData2(callback) {
    var tempScoreSeries = [];
    var tempNoScoreSeries = [];
    getData2(document.getElementById("subreddit").value, document.getElementById("keyword").value, tempNoScoreSeries, tempScoreSeries, 0, callback);
    var tempNoScore = {
        key: "C++",
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: "C++",
        values: tempScoreSeries
    };
    noScoreSeries.push(tempNoScore);
    scoreSeries.push(tempScore);
    tempScoreSeries = [];
    tempNoScoreSeries = [];
    getData2(document.getElementById("subreddit").value, document.getElementById("keyword").value, tempNoScoreSeries, tempScoreSeries, 1, callback);
    var tempNoScore = {
        key: "Java",
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: "Java",
        values: tempScoreSeries
    };
    noScoreSeries.push(tempNoScore);
    scoreSeries.push(tempScore);
    tempScoreSeries = [];
    tempNoScoreSeries = [];
    getData2(document.getElementById("subreddit").value, document.getElementById("keyword").value, tempNoScoreSeries, tempScoreSeries, 2, callback);
    var tempNoScore = {
        key: "Ruby",
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: "Ruby",
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
function getData2(subreddit, topic, series, series2, number, callback) {
        $.post("/programming", {num: number})
        .done(function(data) {
            processData(data, series, series2);
            callback();
        })
        .fail(function(err) {
            console.log("It faiiiiillleeeeeddd :(((");
        });
}
function addMovies(){
    d3.select("svg")
    .datum(insertData3(function() {
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
function insertData3(callback) {
    var tempScoreSeries = [];
    var tempNoScoreSeries = [];
    getData3(document.getElementById("subreddit").value, document.getElementById("keyword").value, tempNoScoreSeries, tempScoreSeries, 0, callback);
    var tempNoScore = {
        key: "Hobbit",
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: "Hobbit",
        values: tempScoreSeries
    };
    noScoreSeries.push(tempNoScore);
    scoreSeries.push(tempScore);
    tempScoreSeries = [];
    tempNoScoreSeries = [];
    getData3(document.getElementById("subreddit").value, document.getElementById("keyword").value, tempNoScoreSeries, tempScoreSeries, 1, callback);
    var tempNoScore = {
        key: "Hunger Games",
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: "Hunger Games",
        values: tempScoreSeries
    };
    noScoreSeries.push(tempNoScore);
    scoreSeries.push(tempScore);
    tempScoreSeries = [];
    tempNoScoreSeries = [];
    getData3(document.getElementById("subreddit").value, document.getElementById("keyword").value, tempNoScoreSeries, tempScoreSeries, 2, callback);
    var tempNoScore = {
        key: "Star Wars",
        values: tempNoScoreSeries
    };
    var tempScore = {
        key: "Star Wars",
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
function getData3(subreddit, topic, series, series2, number, callback) {
        $.post("/movies", {num: number})
        .done(function(data) {
            processData(data, series, series2);
            callback();
        })
        .fail(function(err) {
            console.log("It faiiiiillleeeeeddd :(((");
        });
}
// END OF REALLY BAD CODING PRACTICE FOR PRESETS
function myData(callback) {
    return [];
}
$(function() {
    $( "#datepicker" ).datepicker();
});
$(function() {
    $( "#datepicker2" ).datepicker();
});
function clearGraph(){
    noScoreSeries = [];
    scoreSeries = [];
    d3.selectAll("svg > *").remove();
}
function getData(subreddit, topic, startDate, endDate, series, series2, callback) {
    console.log("Requested ", subreddit, topic);
    $.post("/process", {subreddit: subreddit, topic: topic, startDate: startDate, endDate: endDate})
    .done(function(data) {
        console.log(data);
        processData(data, series, series2);
        callback();
    })
    .fail(function(err) {
        console.log("It faiiiiillleeeeeddd :(((");
    });
}
function whatsTrending() {
    console.log("Updating ");
    $.post("/trending", {})
    .done(function(data) {
        //console.log(data);
        processTrendData(data);
    })
    .fail(function(err) {
        console.log("It faiiiiillleeeeeddd :(((");
    });
}

var processTrendData = function(data) {
    var response;
    try {
       response = JSON.parse(data);
   }
   catch(err) {

   }
   if(typeof response == 'object'){
    data = response;
}
var title = "";
var titleSplit = [];
// part of this was derived from http://iamnotagoodartist.com/web/quick-and-dirty-word-frequency-analysis-with-javascript/
// mostly modified to meet needs though
var ignore = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because",
"been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did", "didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers",
"herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only",
"or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there",
"there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're",
"we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","your's","yourself","yourselves",
"-","can", "", "new", "looking", "[w]","just","need","first","like","help","one","get","time","best","make","want","1","2","3","4",
"anyone","good","think","will","know","people","made","&amp;","question","really","[h]","[m4f]","found","vog","got","someone","hm","now","use",
"post","lfg","ever","little","video","game","lvl","[ps4]","day","else","way","getting","something","go",
"plaly","please","find","love", "us","|","de","vs","[build","big","today","still","without", "ama","la","amp","reddit","city"];
var counts = {};
for (var i = 0; i < data.data.length; i++) {
    title = data.data[i].title.toLowerCase();
    titleSplit = title.split(" ");
    //console.log(titleSplit);
    for(var j = 0; j < titleSplit.length; j++){
        if(ignore.indexOf(titleSplit[j]) > -1){

        }
        else{
            counts[titleSplit[j]] = counts[titleSplit[j]] || 0;
            counts[titleSplit[j]]++;
        }
    }
}
var arr = [];
for (word in counts) {
    arr.push({
        text: word,
        frequency: counts[word]
    });
}
arr.sort(function(a,b){
    return (a.frequency > b.frequency) ? -1 : ((a.frequency < b.frequency) ? 1 : 0);
});
var str = "";
for(var i = 0; i < 20; i++){
    str += (i+1).toString() + ". " + arr[i].text + "\n";
}
document.getElementById("keywords").innerText = str;
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

// count, max, mean, min, mt, tw
var starttime = 500,
    endtime = 3000,
    unit = "ms",
    resampleto = 1000;

$().ready(function()
{
    $.getJSON("/data",{'starttime':starttime,'endtime':endtime,'unit':unit,'resampleto':resampleto},
    function(sample, status, xhr)
    {
        var times = new Array(sample.length),
            means = new Array(sample.length),
            mins = new Array(sample.length),
            maxes = new Array(sample.length);
        for(var i = 0; i < sample.length; i++) {
            times[i] = sample[i].mt;
            means[i] = sample[i].mean;
            mins[i] = sample[i].min;
            maxes[i] = sample[i].max;
        }

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var svgContainer = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        /*
        var xaxis_sel = svgContainer.select("xaxis")
            .append("svg")
            .attr("class", "xaxis")
            .attr("width", 1440)
            .attr("height",30)
            .append("g")
            .attr("transform", "translate(0,30)")
            .call(axis);
            */

    /*
        var yaxis_sel = svgContainer.select("yaxis")
            .data(means)
            .enter()
            .append("ypoint");
            */

        var x = d3.scale.linear()
            .domain([starttime, endtime])
            .range([0, width]);

        var max = Math.max.apply(Math, means),
            min = Math.min.apply(Math, means);

        var y = d3.scale.linear()
            .domain([min,max])
            .range([height,0]);

        var dx = d3.scale.linear()
            .range([0, width-100]);

        var xaxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yaxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            //.x(function(d) { return (d.mt).toFixed(2); })
            //.y(function(d) { return (d.mean).toFixed(2); })
            .x(function(d) { return x(d.mt); })
            .y(function(d) { return y(d.mean); })
            .interpolate("linear");

        var xaxis_graph = svgContainer.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(" + 0 + "," + (height) + ")")
            .call(xaxis);

        var yaxis_graph = svgContainer.append("g")
            .attr("class", "y_axis")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .call(yaxis);

        var linegraph = svgContainer.append("path")
            .attr("class", "line")
            //.attr("clip-path", "url(#clip)")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .attr("d", line(sample));
    });
});

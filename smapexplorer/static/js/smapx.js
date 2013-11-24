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
            //times[i] = sample[i].mt;
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
       
        var x = d3.scale.linear()
            .domain([starttime, endtime])
            .range([0, width]);

        var max = Math.max.apply(Math, maxes),
            min = Math.min.apply(Math, mins);

        var y = d3.scale.linear()
            .domain([min,max])
            .range([height,0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.mt); })
            .y(function(d) { return y(d.mean); })
            .interpolate("linear");

        var xAxis_graph = svgContainer.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(" + 0 + "," + height + ")")
            .call(xAxis);

        var yAxis_graph = svgContainer.append("g")
            .attr("class", "y_axis")
            .call(yAxis);

        var lineGraph = svgContainer.append("path")
            .attr("class", "line")
            .attr("clip-path", "url(#clip)")
            .attr("d", line(sample));

        /* Begin zooming */

        var zoom = d3.behavior.zoom()
            .on("zoom", draw);

        svgContainer.append("clipPath")
            .attr("id", "clip")
        .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height);

        svgContainer.append("rect")
            .attr("class", "pane")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

        zoom.x(x);

        function draw() {
            svgContainer.select("g.x.axis").call(xAxis);
            svgContainer.select("g.y.axis").call(yAxis);
            svgContainer.select("path.line").attr("d",line(sample));
        }

        draw();
    });
});

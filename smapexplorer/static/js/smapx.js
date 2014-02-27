// count, max, mean, min, mt, tw
var starttime = 500,
    endtime = 3000,
    unit = "ms",
    resampleto = 1000;


$().ready(function()
{
    // create loading image
    $("#chart").html("<img src='/static/gray_load.gif' >");

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
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            // removing the loading image
            .call(function(d) {$("#chart img").remove();});
       
        //var x = d3.scale.linear()
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
            .attr("class", "x axis")
            .attr("transform", "translate(" + 0 + "," + height + ")")
            .call(xAxis);

        var yAxis_graph = svgContainer.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var lineGraph = svgContainer.append("path")
            .attr("class", "line")
            .attr("clip-path", "url(#clip)")
            .attr("d", line(sample));

        /* Begin data probe */

        var focus = svgContainer.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5)

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");
        
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                bisect = d3.bisector(function(d) { return d.mt; }).left,
                i = bisect(sample, x0, 1),
                d0 = sample[i - 1],
                d1 = x0 < endtime ? sample[i] : d0,
                d = x0 - d0.mt > d1.mt - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.mt) + "," + y(d.mean) + ")");
            focus.select("text").text((d.mt).toFixed(2) + ", " + (d.mean).toFixed(2));
        }

        /* Begin zooming */

        var zoom = d3.behavior.zoom()
            .on("zoom", draw);

        /*
         * not sure if this stuff is in the right direction but attempt to keep it from panning
         * offscreen
         *
        var t = zoom.translate(),
            s = zoom.scale();

        console.log("t " + t + " s " + s);
        console.log("width*(1-s) " + (width*(1-s)) + ", t[0] " + t[0]);
        tx = Math.min(0, Math.max(width * (1 - s), t[0]));
        console.log("width*(1-s) " + (height*(1-s)) + ", t[0] " + t[1]);
        ty = Math.min(0, Math.max(height * (1 - s), t[1]));

        zoom.translate([tx, ty]);
        */

        //to keep the graph from spilling over when dragging
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
            // this stuff is for the probe
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove)
            //
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

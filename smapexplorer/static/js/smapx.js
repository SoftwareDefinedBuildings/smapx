
var data = [1,2,3,5,3,2];

d3.select("#chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return d * 100 + "px"; } )
    .text(function(d) { return d; } );

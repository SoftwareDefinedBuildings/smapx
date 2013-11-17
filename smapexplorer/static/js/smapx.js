
var data = [1,2,3,5,3,2];

d3.select("#chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return d * 100 + "px"; } )
    .text(function(d) { return d; } );
    
$().ready(function()
{
    $.getJSON("/data",{'start':500,'end':3000,'subsample':1000},
        function(data, status, xhr)
        {
            console.log("retval: ",data);
            $('#target').text(data["data"]);
        });
  
});

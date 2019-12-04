var margin = {top : 10, right: 30, bottom: 20, left:50};
var width = 1000 -margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var colors=["#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#8dd3c7","#ffffb3","#bebada"];
var barHeight=100;

div=d3.select("body").append("div").attr("class",'barChart');

svg =div.append("svg")
            .attr("width",width + margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom)
            .attr("transform","translate("+[margin.left,margin.top ]+")"); 
var tooltip = d3.select("#barChart")
                .append("div")
                .style("position","absolute")
                .style("visibility","hidden");
                      
d3.csv("exploitType_byYear.csv",function(data){
    // console.log(data);
    var count_extent = d3.extent(data,function(d){return +d.count;});
    update(2002);
    function update(year){
        var dataFilter=data.filter(function(d){
            return d.year == year;
        })
        let cumulative=0;
        var cur_total_count = d3.sum(dataFilter,function(d){return +d.count;});
        // console.log(cur_total_count);
        var xScale = d3.scaleLinear()
                   .domain([0,cur_total_count])
                   .range([0,width]);
        dataFilter = dataFilter.map(function(d){
            cumulative+=+d.count;
            return {
                year:d.year,
                type:d.type,
                count:+d.count,
                cumulative:cumulative-(+d.count),
                percent:(+d.count/cur_total_count)*100
            }
        })
        // console.log(dataFilter);
        var chart = svg.selectAll('rect')
                  .data(dataFilter);
        var chartEnter = chart.enter()
                    .append("rect")
                    .attr("y",height/2 - barHeight/2)
                    .attr("x",function(d){
                        return xScale(d.cumulative);
                    })
                    .attr("width",function(d){return xScale(d.count);})
                    .attr("height",barHeight)
                    .style("fill",function(d,i){
                        return colors[i];});
        chart.merge(chartEnter);
        var exploit_label = svg.selectAll(".exploit_type")
                         .data(dataFilter)
                         .enter().append("text")
                         .attr("class","exploit_type")
                         .attr("text-anchor","middle")
                         .attr("y",height/2 +(barHeight/2)*1.3)
                         .attr("x",function(d){
                            return xScale(d.cumulative) + xScale(d.count)/2;
                         })
                         .text(function(d){return d.type;})
                         .style("fill",function(d,i){return colors[i];});    
    
        var count_label = svg.selectAll(".count_label")
                            .data(dataFilter)
                            .enter().append("text")
                            .attr("class","count_label")
                            .attr("text-anchor","middle")
                            .attr("x",function(d){
                                return xScale(d.cumulative) + xScale(d.count)/2;
                            })
                            .attr("y",height/2 +5)
                            .text(function(d){return d.count;})
                            .style("fill","#ffffff")
                            ;
        var percent_label = svg.selectAll(".percent_label") 
                                .data(dataFilter)
                                .enter().append("text")
                                .attr("class","percent_label")
                                .attr("text-anchor","middle")
                                .attr("x",function(d){return xScale(d.cumulative)+xScale(d.count)/2;})
                                .attr('y',height/2-barHeight/2*1.1)
                                .text(function(d){
                                    return d.percent.toFixed(2) +" %";});
    }
    d3.select("#selectButton_year").on("change",function(d){
        
        var selectedOption =d3.select(this).property("value");
        console.log(selectedOption);
        d3.selectAll("rect").remove();
        d3.selectAll(".percent_label").remove();
        d3.selectAll(".count_label").remove();
        d3.selectAll(".exploit_type").remove();
        update(selectedOption);
    })

});


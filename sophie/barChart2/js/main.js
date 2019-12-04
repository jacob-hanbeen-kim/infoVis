
// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 150},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select("body").append("div").attr("id","#barChart2")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
function update(exploit_type){
    d3.selectAll(".bar2_rect").remove();
    d3.selectAll(".bar2_label").remove();
    d3.select("#xAxis").remove();
    d3.select("#yAxis").remove();
    d3.csv("count.csv",dataPreprocessor).then(function(data){
        // console.log(data);
        dataset = data;
        
        drawChart(exploit_type);
    });
}

function drawChart(exploit_type){
    var filter_data = dataset.filter(function(row){
        return row.exploit_type ==exploit_type;
    });
    // console.log(filter_data);
     //x axis
    var max_val = d3.max(filter_data,function(d){return d.count;});//console.log(max_val);
   
    var x = d3.scaleLinear()
    .domain([0, max_val])
    .range([ 0, width]);

    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("id","xAxis")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    // y axis
    control_means= filter_data.map(function(d){return d.control_mean;}) ;//console.log(control_means);
    var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(control_means)
    .padding(.1);
    
    svg.append("g")
    .attr("id","yAxis")
    .call(d3.axisLeft(y));
    //bars
    var bars = svg.selectAll("myRect")
        .data(filter_data);
    var bars_enter = bars.enter()
        .append("rect")
        .attr("class","bar2_rect")
        .attr("x", x(0) )
        .attr("y", function(d) {
             return y(d.control_mean); })
        .attr("width", function(d) { return x(d.count); })
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
    ;
    
    bars.enter().append("text").attr("class","bar2_label")
                            //  .attr("y", y.bandwidth() /2 +150)
                            //  .attr("dy", ".20em") 
                             .attr("text-anchor", "end")
                             .text(function(d){
                                 return d.count;
                             })
                            .attr("x", function(d){return x(d.count)+25;} )
                            .style("font-size","10px")
                            .attr("y", function(d) {
                                    return y(d.control_mean) +10; });
    bars.merge(bars_enter);
}

function dataPreprocessor(row) {
    return {
        exploit_type: row["exploit_type"],
        control_mean:row["control_mean"],
        count:+row['count']
    };
}
update("sexual_exploitation");
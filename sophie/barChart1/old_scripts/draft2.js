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
                      
d3.csv("cleanData.csv",dataProcessor).then(function(data){
    // console.log(data);
    data.sort(function(a,b){
        var textA =a.exploit_type;
        var textB = b.exploit_type;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
    // console.log(data);
    nestedData = nestedData(data);
    
    updateChart('all-years');
    

});
function updateChart(year){
    // console.log(nestedData[year]);
    cur_data=nestedData[year]
    exploit_types = d3.extent(cur_data,function(d){return d.exploit_type;});
    exploit_counts = {};
    //create something like this {Sexual exploitation: 830, Unknown: 299}
    cur_data.forEach(function(row){
        exploit_types.forEach(function(type){
            if(row.exploit_type==type){
                if(!exploit_counts[type]) exploit_counts[type]=1;
                else exploit_counts[type]++;
            }
        })
    }) //end of forEach 
    // console.log(exploit_counts);
    //create something like this 0: {type: "Sexual exploitation", count: 830}  1: {type: "Unknown", count: 299}
    dataset = [];
    Object.keys(exploit_counts).forEach(function(type){
        dataset.push({"type":type,"count":exploit_counts[type]});
    })
    console.log(dataset);
    //
    let cumulative=0;
    cur_total_count = d3.sum(dataset,function(d){return d.count;}) ; //console.log(cur_total_count);
    dataset= dataset.map(function(d){
        cumulative+=+d.count;
        return {
            type:d.type,
            count:+d.count,
            cumulative:cumulative-(+d.count),
            percent:(+d.count/cur_total_count)*100
        }
    })
    var xScale = d3.scaleLinear()
                   .domain([0,cur_total_count])
                   .range([0,width]);
                   var chart = svg.selectAll('rect')
                   .data(dataset);
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
                          .data(dataset)
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
                             .data(dataset)
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
                                 .data(dataset)
                                 .enter().append("text")
                                 .attr("class","percent_label")
                                 .attr("text-anchor","middle")
                                 .attr("x",function(d){return xScale(d.cumulative)+xScale(d.count)/2;})
                                 .attr('y',height/2-barHeight/2*1.1)
                                 .text(function(d){
                                     return d.percent.toFixed(2) +" %";});
}
function yearChange(){
    var select = d3.select('#selectButton_year').node();
    // Get current value of select element
    var selectedOption= select.options[select.selectedIndex].value;
    console.log(selectedOption);
    d3.selectAll("rect").remove();
    d3.selectAll(".percent_label").remove();
    d3.selectAll(".count_label").remove();
    d3.selectAll(".exploit_type").remove();
    updateChart(selectedOption);
}
function dataProcessor(d){
    return {
        year :+d["Year of Registration"],
        exploit_type:d["Type Of Exploitation"],
        labour_type:d['Type of Labour'],
        sex_type:d['Type of Sex']
    }
}
function nestedData(data,){
    var nestedData = d3.nest()
    .key(function(d){
        return d.year;
    })
    .object(data);
    return nestedData;
}

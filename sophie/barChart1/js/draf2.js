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

d3.csv("cleanData_refine.csv",dataProcessor).then(function(data){
    // console.log(data);
    dataset=splitCell(data);
    exploit_nestData = nest_exploitType(data); //console.log(exploit_nestData);
    draw_exploitChart("all-years");
});
function draw_exploitChart(year){
    // console.log(dataset);
    
    if (year == "all-years"){
        var selected_dataset = dataset;
        var exploit_nestData = nest_exploitType(dataset);
    }
    else{//select only row of that year
        // year=parseInt(year);
        var selected_dataset=dataset.filter(function(d){
            return d.year == year;
        })
        var exploit_nestData = nest_exploitType(selected_dataset);
    }
    // console.log(exploit_nestData);
    var values = Object.values(exploit_nestData)
    var max_height = d3.max(values, function(d){return d.length;}); //console.log(max_height);
    var min_height = d3.min(values,function(d){return d.length;})
    var xScale = d3.scaleLinear()
                   .domain([0,selected_dataset.length])
                   .range([0,width-100]);
    let cumulative=0;
    var chart = svg.append("g").selectAll('rect')
                   .data(Object.keys(exploit_nestData));
    var chartEnter = chart.enter()
                   .append("rect")
                   .attr("id",function(d){return d;})
                   .attr("y",height/2 - barHeight/2)
                   .attr("x",function(d,i){
                      cumulative=cumulative+exploit_nestData[d].length;
                      return xScale(cumulative-exploit_nestData[d].length);
                   })
                   .attr("width",function(d){return xScale(exploit_nestData[d].length);})
                   .attr("height",barHeight)
                   .style("fill",function(d,i){
                       return colors[i];
                      })
                    //   .on("mouseover",mouseover)
                    //   .on("mouseout",mouseout)
                  ;
                  chart.merge(chartEnter);
                  cumulative=0;
    var exploit_label = svg.selectAll(".exploit_label")
                           .data(Object.keys(exploit_nestData))
                            .enter()
                            .append("text")
                            .attr("class","exploit_label")
                            .attr("text-anchor","start")
                            .attr("y",height/2 +(barHeight/2)*1.3)
                            .attr("x",function(d,i){
                                cumulative=cumulative+exploit_nestData[d].length;
                                return xScale(cumulative-exploit_nestData[d].length);
                                })
                            .text(function(d){return d;})
                            .style("opacity",function(d){
                                if(xScale(exploit_nestData[d].length) < 10){
                                    return "0";
                                    };
                                })
                            .style("fill",function(d,i){return colors[i];});
                            cumulative=0;
    var count_label = svg.selectAll(".count_label")
                         .data(Object.keys(exploit_nestData))
                         .enter()
                         .append("text")
                         .attr("class","count_label")
                         .attr("text-anchor","start")
                         .attr("x",function(d){
                            cumulative=cumulative+exploit_nestData[d].length;
                             return xScale(cumulative-exploit_nestData[d].length);
                         })
                         .attr("y",height/2 +5)
                         .text(function(d){return exploit_nestData[d].length;})
                         .style("opacity",function(d){
                            if(xScale(exploit_nestData[d].length) < 10){
                                return "0";
                            };
                        })
                         .style("fill","#ffffff")
                         ;
   cumulative =0;
   var percent_label = svg.selectAll(".percent_label") 
                          .data(Object.keys(exploit_nestData))
                          .enter()
                          .append("text")
                          .attr("class","percent_label")
                          //.attr("text-anchor","middle")
                          .attr("x",function(d){
                            cumulative=cumulative+exploit_nestData[d].length;
                             return xScale(cumulative-exploit_nestData[d].length);
                         })
                          .attr('y',height/2-barHeight/2*1.1)
                          .style("opacity",function(d){
                             if(xScale(exploit_nestData[d].length) < 10){
                                 return "0";
                             };
                         })
                          .text(function(d){
                             val = (exploit_nestData[d].length / selected_dataset.length)*100;
                              return val.toFixed(2) +" %";});
}
// function count_total (an_object){
//     var total =0;
//     Object.keys(an_object).forEach(element => {
//         console.log(element);
//         total += an_object[element].length;
//     });
// }
function splitCell(data){
    var dataset = [];
    data.forEach(function(row){
        splits=row.exploit_type.split(";");
        if (splits.length >1){
            splits.forEach(function(s){
                dataset.push({year:row.year,exploit_type:s,labour_type:row.labour_type,sex_type:row.sex_type});
            })
        }else{
            dataset.push(row)
        }    
    })
    return dataset;
}
function dataProcessor(d){
    return {
        year :+d["Year of Registration"],
        exploit_type:d["Type Of Exploitation"],
        labour_type:d['Type of Labour'],
        sex_type:d['Type of Sex']
    }
}
function nest_exploitType(data){
    var nestedData = d3.nest()
                       .key(function(d){
                           return d.exploit_type;
                       })
                       .object(data);
    return nestedData;
}
function yearChange(){
    var select = d3.select('#selectButton_year').node();
    // Get current value of select element
    var selectedOption= select.options[select.selectedIndex].value;
    d3.selectAll(".exploit_chart").remove();
    d3.selectAll(".exploit_label").remove();
    d3.selectAll(".percent_label").remove();
    d3.selectAll(".count_label").remove();
    // d3.selectAll(".arc").remove();
   
    draw_exploitChart(selectedOption);
}
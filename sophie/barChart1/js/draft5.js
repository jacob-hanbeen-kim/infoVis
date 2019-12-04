var margin = {top : 10, right: 30, bottom: 20, left:50};
var width = 1000 -margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var colors=["#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#8dd3c7","#ffffb3","#bebada"];
var barWidth=100;

d3.csv("cleanData_refine.csv",dataProcessor).then(function(data){
    // console.log(data);
    div=d3.select("body").append("div").attr("class",'barChart');
    svg =div //d3.select("body") //div
            .append("svg")
            .attr("width",width/2+ margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom)
            .attr("transform","translate("+[margin.left,margin.top ]+")"); 

    dataset=splitCell(data);
    exploit_nestData = nest_exploitType(data); //console.log(exploit_nestData);
    draw_exploitChart("all-years");
});
function draw_exploitChart(year){
    // console.log(dataset);
    
    if (year == "all-years"){
        selected_dataset = dataset;
        exploit_nestData = nest_exploitType(dataset);
    }
    else{//select only row of that year
        // year=parseInt(year);
        selected_dataset=dataset.filter(function(d){
            return d.year == year;
        })
        exploit_nestData = nest_exploitType(selected_dataset);
    }
    // console.log(exploit_nestData);
    var values = Object.values(exploit_nestData)
    var max_height = d3.max(values, function(d){return d.length;}); //console.log(max_height);
    var min_height = d3.min(values,function(d){return d.length;})
    var xScale = d3.scaleLinear()
                   .domain([0,selected_dataset.length])
                   .range([0,width-100]);
    var yScale = d3.scaleLinear()
                   .domain([0,selected_dataset.length])
                   .range([0,height]);
    let cumulative=0;
    var chart = svg//.append("g")
                    .selectAll('rect')
                   .data(Object.keys(exploit_nestData));
    var chartEnter = chart.enter()
                   .append("rect")
                   .attr("class","exploit_chart")
                   .attr("id",function(d){return d;})
                   .attr("y",function(d){
                    cumulative=cumulative+exploit_nestData[d].length;
                    return yScale(cumulative-exploit_nestData[d].length);
                   })
                   .attr("x",width/2-300)
                   .attr("width",barWidth)
                   .attr("height",function(d){return yScale(exploit_nestData[d].length);})
                   .style("fill",function(d,i){
                       return colors[i];
                      })
                    .on("mouseover",mouseover)
                    //   .on("mouseout",mouseout)
                  ;
    chart.merge(chartEnter);
    cumulative=0;
    var exploit_label = svg//.append("g")
                            .selectAll(".exploit_label")
                           .data(Object.keys(exploit_nestData))
                            .enter()
                            .append("text")
                            .attr("class","exploit_label")
                            .attr("text-anchor","end")
                            .attr("y",function(d){
                                cumulative=cumulative+exploit_nestData[d].length;
                                return yScale(cumulative-exploit_nestData[d].length) + yScale(exploit_nestData[d].length)/2;
                               })
                            .attr("text-anchor","end")
                            .attr("x",width/2-210-barWidth)
                            .text(function(d){
                                return d  ;})
                            .style("opacity",function(d){
                                if(yScale(exploit_nestData[d].length) < 10){
                                    return "0";
                                    };
                                })
                            .style("fill",function(d,i){return colors[i];});
                            ;
    cumulative=0;
    var count_label = svg.selectAll(".count_label")
                         .data(Object.keys(exploit_nestData))
                        .enter()
                        .append("text")
                        .attr("class","count_label")
                        .attr("x",width/2-250-barWidth)
                        .attr("y",function(d){cumulative=cumulative+exploit_nestData[d].length;
                            return yScale(cumulative-exploit_nestData[d].length) + yScale(exploit_nestData[d].length)/2+15;
                        })
                        .text(function(d){
                            return exploit_nestData[d].length;})
                        .style("opacity",function(d){
                            if(yScale(exploit_nestData[d].length) < 10) return "0";
                                })
                        .style("fill",function(d,i){
                                    return colors[i];
                                   });
    cumulative=0;
    var percent_label = svg//.append("g")
                            .selectAll(".percent_label") 
                          .data(Object.keys(exploit_nestData))
                          .enter()
                          .append("text")
                          .attr("class","percent_label")
                          .attr("x",width/2-320 +barWidth/2)
                         .attr("y",function(d){
                            cumulative=cumulative+exploit_nestData[d].length;
                            return yScale(cumulative-exploit_nestData[d].length) + yScale(exploit_nestData[d].length)/2;
                           })
                          .style("opacity",function(d){
                             if(yScale(exploit_nestData[d].length) < 10){
                                 return "0";
                             };
                         })
                          .text(function(d){
                             val = (exploit_nestData[d].length / selected_dataset.length)*100;
                              return val.toFixed(2) +" %";})
                        .style("fill","#ffffff");

}
function mouseover(){
    // console.log(exploit_nestData);
    var exploit_type = d3.select(this)._groups[0][0].id;
    // all_exploitCharts=d3.selectAll(".exploit_chart")._groups[0];
    // all_exploitCharts.forEach(function(each){
    //     if(each.id != exploit_type){
    //         d3.select("#"+each.id).remove();
    //     }
    // })
    if(exploit_type.includes("sexual") || exploit_type.includes("Sexual")) {
        var extract_dataset = exploit_nestData[exploit_type];
        var nested_extractData = nest_sexType(extract_dataset);
    }
    if (exploit_type.includes("labour")){
        var extract_dataset = exploit_nestData[exploit_type];
        var nested_extractData = nest_labourType(extract_dataset);
    }
    // console.log(nested_extractData);
    draw_subChart(nested_extractData);
}
function draw_subChart(dataset){
    console.log(dataset);
    color = d3.scaleSequential(d3.interpolateBlues)
        .domain(Object.keys(dataset));
        
    var square_num=100; //100 people is in 1 square
    var max_width = d3.max(Object.values(dataset),function(d){return d.length;});
    var square_size=Math.round(width/(parseInt(max_width/square_num)+1)); //console.log(square_size);
    var xScale = d3.scaleLinear()
                   .domain([0,max_width])
                    .range([0,width]);
    // console.log(xScale(100));
    var yScale = d3.scaleBand()
                   .domain(Object.keys(dataset))
                   .range([0,height/5])
                   .padding(0.01);
    
    svg_subChart = d3.select("body").append("div").attr("class",'subChart')
                    .append("svg").attr("width",width);
    var new_dataset = create_new_dataset(dataset,square_num);
    // console.log(new_dataset);
    var rects = svg_subChart.selectAll("rect")
                             .data(new_dataset)
                             .enter()
                             .append("rect")
                             .attr("x",function(d){
                                 return xScale(d.value);
                             })  
                             .attr("y",function(d){
                                 return yScale(d.type);
                             }) 
                             .attr("width",square_size-1)
                             .attr("height",square_size)
                             ;    
    // var all_groups = svg_subChart.selectAll("g")
    //                     .data(Object.keys(dataset)).enter()
    //                     .append("g").attr("id",function(d){return d;});
    // var rects = all_groups.selectAll("rect")
    //                       .data(function(d){
    //                         //   console.log(d);
    //                         // console.log(dataset[d]);//return dataset[d];
    //                         return divide_into_group(dataset[d],square_num);
    //                         })
    //                     .enter()
    //                     .append("rect")
    //                     .attr("x",function(d,i){
    //                         // console.log(d);
    //                         return i*square_size;
    //                     })
    //                     .attr("y",function(d){
    //                         console.log(d);
    //                     })
    //                     .attr("width",function(d,i){
    //                         return i*square_size+square_size;
    //                     })
    //                     .attr("height",square_size);
    //                     ;
                    
        
    
}
function divide_into_group(dataset,square_width){
    var total_count = dataset.length; //console.log(each_type, total_count);
    var cur_dataset = [];
    for (var i =1; i<=parseInt(total_count/square_width);i++){
        cur_dataset.push(i*square_width);
    } 
    var remain = total_count -parseInt(total_count/square_width)*square_width;
    cur_dataset.push(remain);
    return cur_dataset;
}
function create_new_dataset(dataset,square_width){
    var big_dataset = [];//console.log(dataset);
    Object.keys(dataset).forEach(function(each_type){
        var total_count = dataset[each_type].length; //console.log(each_type, total_count);
        var cur_dataset = [];

        for (var i =1; i<=parseInt(total_count/square_width);i++){
            cur_dataset.push({type:each_type,value:i*square_width})
        } 
        var remain = total_count -parseInt(total_count/square_width)*square_width;
        cur_dataset.push({type:each_type,value:remain});
        // console.log(cur_dataset);
        big_dataset=big_dataset.concat(cur_dataset);
    }) //end of forEach loop
    return big_dataset;
}
function splitCell(data){
    var dataset = [];
    data.forEach(function(row){
        splits=row.exploit_type.split(";");
        if (splits.length >1){
            splits.forEach(function(s){
                dataset.push({year:row.year,exploit_type:s,labour_type:row.labour_type,sex_type:row.sex_type});
            })
        }else{
            dataset.push(row);
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
function nest_labourType(data){
    var nestedData = d3.nest()
                       .key(function(d){
                           return d.labour_type;
                       })
                       .object(data);
    return nestedData;
}
function nest_sexType(data){
    var nestedData = d3.nest()
                       .key(function(d){
                           return d.sex_type;
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
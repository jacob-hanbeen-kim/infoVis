var margin = {top : 10, right: 30, bottom: 20, left:50};
var width = 1100 -margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var colors=["#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#8dd3c7","#ffffb3","#bebada"];
var barWidth=100;

d3.csv("cleanData_refine.csv",dataProcessor).then(function(data){
    // console.log(data);
    div=d3.select("body").append("div").attr("class",'barChart');
    svg =div //d3.select("body") //div
            .append("svg")
            .attr("width",width/3+ margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom)
            .attr("transform","translate("+[0,margin.top ]+")"); 
            //.attr("transform","translate("+[margin.left,margin.top ]+")"); 

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
    // var xScale = d3.scaleLinear()
    //                .domain([0,selected_dataset.length])
    //                .range([0,width-100]);
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
    d3.select(".subChart").remove();
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
        draw_subChart(nested_extractData);
    }
    else if (exploit_type.includes("labour")){
        var extract_dataset = exploit_nestData[exploit_type];
        var nested_extractData = nest_labourType(extract_dataset);
        draw_subChart(nested_extractData);
    }
    // console.log(extract_dataset);
}
function draw_subChart(dataset){
    console.log(dataset); 
    var height= 500;
    var color = ['#c51b7d',"#fc9272",'#4d9221',"#3288bd",'#636363','#756bb1','#99d8c9',"#d73027",'#fa9fb5','#7fbc41'];

    var max_width = d3.max(Object.values(dataset),function(d){return d.length;}); //console.log(max_width);
    var xScale = d3.scaleLinear()
                    .domain([0,max_width])//.domain([0,Math.round(max_width/25)*2])//
                    .range([0,width]);//.range([0,width]);
    
    var yScale = d3.scaleBand()
                   .domain(Object.keys(dataset))
                   .range([0,height])
                   .padding(0.01);
    // var band = Math.floor(yScale.bandwidth()); console.log(band);
    //This is how I determined cell size
    var groupSize =100;
    var nRow=5;
    var max_cell_num = Math.round(max_width/groupSize); //console.log(max_cell_num)
    var max_col_num = Math.floor(max_cell_num/nRow)+1;//console.log(max_col_num);
    
    var new_data = divide_into_group(dataset,max_col_num,groupSize)[0]; //console.log(new_data);
    var svg_subChart = d3.select("body").append("div").attr("class",'subChart')
                    .append("svg").attr("width",width).attr("height",height)
                    .attr("transform","translate(" + -margin.left+ ","+50+ ")");
    
    var g_label = svg_subChart.append("g")
    				.attr("id","label")
    				.attr("transform","translate(" + 0+ ","+12+ ")");
    var labels=g_label .selectAll("text")
			            .data(divide_into_group(dataset,max_col_num,groupSize)[1])
			            .enter()
			            .append("text")
			            .style("text-anchor","start")
			            // .attr("x",0)
			            .attr("y",function(d){return d.height;})
			            .text(function(d){
			                return d.type ;})
			            
			            .style("fill",function(d){
			                var index = Object.keys(dataset).indexOf(d.type);
			                 return color[index];
			            });
			            
    var g_rect = svg_subChart.append("g")
                            .attr("id","sub_rect")
                            .attr("transform","translate(" + 150+ ","+0+ ")");
    var rects= g_rect.selectAll("rect")
			            .data(new_data)                      
			            .enter()
			            .append("rect")
			            .attr("x",function(d,i){
			                return d.x ;
			            })
			            .attr("y",function(d){
			                return d.y  ;})
			            .attr("width",20)
			            .attr("height",20)
			            //.attr("class","subChart_rect")
			            .attr("id",function(d){return d.type;})
			           .style("fill",function(d){
			                var index = Object.keys(dataset).indexOf(d.type);
			                return color[index];
			           });     
    var g_legend = svg_subChart.append("g")
                            .attr('id',"legend")
                            .attr("transform","translate(" + 860+ ","+0+ ")");
                            ;

    var legends=g_legend.selectAll("rect")
                       .data(Object.keys(dataset))
                       .enter()
                       .append("rect")
                       .attr("width",20)
                       .attr("height",20)
                    //    .attr("x",width-20)
                       .attr("y",function(d,i){
                           return i*20+i*5;
                       })
                       .style("fill",function(d){
                           console.log(d);
                          var index = Object.keys(dataset).indexOf(d);
                          return color[index];
                       })
                       ; 
                       var g_legend = svg_subChart.append("g")
                       .attr('id',"legend")
                       //.attr("transform","translate(" + 650+ ","+0+ ")");
                       ;
    var g_legend_text= svg_subChart.append("g")
                       .attr('id',"legend_text")
                       .attr("transform","translate(" + 880+ ","+14+ ")");
                       ;
    var legend_texts=g_legend_text.selectAll("text")
                  .data(Object.keys(dataset))
                  .enter()
                  .append("text")
                  .style("text-anchor","start")
                  .attr("y",function(d,i){
                      return i*20+i*5;
                  })
                  .text(function(d){
                      return groupSize + " person";
                  })
                  .style("fill",function(d){
                     var index = Object.keys(dataset).indexOf(d);
                     return color[index];
                  })
                  ;                                      
}

function divide_into_group(dataset,n_col, groupSize){
    //bandSize is 123
    var cellSize = 20;
    var gapSize=5;
    var big_dataset=[];
    var y_gap= 10;
    var cur_height =0;var next_height=0;
    var row_info=[];
    Object.keys(dataset).forEach(function(each_type){
        // console.log(each_type);
        row_info.push({type:each_type,height:next_height});
        var total_count = dataset[each_type].length; //console.log(each_type, total_count);
        var cur_dataset = [];
        var total_cells= Math.floor(total_count/groupSize)+1; 
        // // console.log(total_cells,groupSize);
        // var n_col = Math.floor(total_cells/nRow)+1; //console.log(total_cells,n_col);
        // var index = Object.keys(dataset).indexOf(each_type);  //console.log(index);
        var n_row = Math.floor(total_cells/n_col)+1; //console.log(n_row)
        
        // var cur_y_pos = bandSize*(index);console.log(each_type,cur_y_pos);
        for (var i =0; i<total_cells;i++){
            var x = (i%n_col)*cellSize + (i%n_col)*gapSize;
            var y = Math.floor(i/n_col)*cellSize +(Math.floor(i/n_col))*gapSize +next_height ; 
            cur_dataset.push({type:each_type,x:x,y:y})
        } 
        cur_height = (cellSize+gapSize)*n_row ; //console.log(cur_height);
        next_height = next_height+cur_height+y_gap;
        big_dataset=big_dataset.concat(cur_dataset);
    }) //end of forEach loop
    // console.log(big_dataset);
    // console.log(row_info);
    return [big_dataset,row_info];
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
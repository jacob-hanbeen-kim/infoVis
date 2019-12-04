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
    dataset = data;
    exploit_counts = {};
    // now look at Type of Explotation column, split and find frequency of each type of exploits
    data.forEach(row => {// console.log(row);
        year = row.year;
        if (!exploit_counts[year]){exploit_counts[year]={};}
        splits = row.exploit_type.split(";");
        splits.forEach(function(s){
            // console.log(splits,s);
            if (!exploit_counts[year][s]){
                // console.log(s);
                exploit_counts[year][s]=1
            }else {
                // console.log(exploit_counts[s]);
                exploit_counts[year][s]++;}
        }) 
    });//end of forEach for dataset
    // console.log(exploit_counts);
    updateChart('all-years');
});
function updateChart(year){
    selected_year = year;
    if (year == 'all-years'){
        cur_data={};
        Object.keys(exploit_counts).forEach(function(year){
            Object.keys(exploit_counts[year]).forEach(function(type){
                if(!cur_data[type]) cur_data[type]=exploit_counts[year][type];
                else cur_data[type]=cur_data[type]+exploit_counts[year][type];
            })
        });
    }
    else cur_data=exploit_counts[year];
    // console.log(cur_data);
    exploit_types=Object.keys(cur_data); 
    console.log(exploit_types);
    total_count = d3.sum(Object.values(cur_data)); //console.log(total_count)
    var xScale = d3.scaleLinear()
                   .domain([0,total_count])
                   .range([0,width]);
    let cumulative=0;
    var chart = svg.append("g").selectAll('rect')
                   .data(exploit_types);
    
    var chartEnter = chart.enter()
                     .append("rect")
                     .attr("id",function(d){return d;})
                     .attr("y",height/2 - barHeight/2)
                     .attr("x",function(d,i){
                        cumulative=cumulative+cur_data[d];
                        return xScale(cumulative-cur_data[d]);
                     })
                     .attr("width",function(d){return xScale(cur_data[d]);})
                     .attr("height",barHeight)
                     
                     .style("fill",function(d,i){
                         return colors[i];
                        })
                        .on("mouseover",mouseover)
                        .on("mouseout",mouseout)
                    ;
    chart.merge(chartEnter);
    cumulative=0;
    var exploit_label = svg.selectAll(".exploit_label")
                          .data(exploit_types)
                          .enter()
                          .append("text")
                          .attr("class","exploit_label")
                        //   .attr("text-anchor","middle")
                          .attr("y",height/2 +(barHeight/2)*1.3)
                          .attr("x",function(d){
                            cumulative=cumulative+cur_data[d];
                            cur_value= cumulative-cur_data[d];
                            return xScale(cumulative-cur_data[d]);
                          })
                          .text(function(d){return d;})
                          .style("opacity",function(d){
                              if(xScale(cur_data[d]) < 10){
                                  return "0";
                              };
                          })
                          .style("fill",function(d,i){return colors[i];})
                          
                          ;
    cumulative=0;
    var count_label = svg.selectAll(".count_label")
                             .data(exploit_types)
                             .enter()
                             .append("text")
                             .attr("class","count_label")
                             .attr("x",function(d){
                                cumulative=cumulative+cur_data[d];
                                 return xScale(cumulative-cur_data[d]);
                             })
                             .attr("y",height/2 +5)
                             .text(function(d){return cur_data[d];})
                             .style("opacity",function(d){
                                if(xScale(cur_data[d]) < 10){
                                    return "0";
  ;                              };
                            })
                             .style("fill","#ffffff")
                             ;
    cumulative =0;
    var percent_label = svg.selectAll(".percent_label") 
                                 .data(exploit_types)
                                 .enter()
                                 .append("text")
                                 .attr("class","percent_label")
                                 //.attr("text-anchor","middle")
                                 .attr("x",function(d){
                                    cumulative=cumulative+cur_data[d];
                                    return xScale(cumulative-cur_data[d]);})
                                 .attr('y',height/2-barHeight/2*1.1)
                                 .style("opacity",function(d){
                                    if(xScale(cur_data[d]) < 10){
                                        return "0";
                                    };
                                })
                                 .text(function(d){
                                    val = (cur_data[d] / total_count)*100;
                                     return val.toFixed(2) +" %";});
    
    var tooltip = d3.select("body").append("div")
                        .attr("class","tooltip")
                        .style("opacity",0)
                        .style("background-color","blue")
                        .style("border","solid")
                        .style("border-width","1px")
                        .style("border-radius","5px")
                        .style("padding","10px");
    

}
function mouseover (d){
    sexual_types ={}; labour_types= {}
    //[rect#Unknown] for d3.select(this)._groups[0], [0] to get rect, .id to get name of id
    var exploit_type = d3.select(this)._groups[0][0].id;
    // console.log(exploit_type);
    //["Sexual exploitation", "Unknown", "Forced labour", "Other", "Combined sexual and labour exploitation", "Slavery and similar practices", "Forced marriage"]
    if(exploit_type.includes("sexual") || exploit_type.includes("Sexual") || exploit_type.includes("labour")){ 
        // console.log(exploit_type);
        var extract_dataset=extract_data(exploit_type,selected_year);
        if(exploit_type.includes("sexual") || exploit_type.includes("Sexual")){
            extract_dataset.forEach(function(row){
                if( !sexual_types[row.sex_type])sexual_types[row.sex_type]=1;
                else sexual_types[row.sex_type] +=1;
            })    
        }
        else if(exploit_type.includes("labour") ){
        
            extract_dataset.forEach(function(row){
                if( !labour_types[row.labour_type])labour_types[row.labour_type]=1;
                else labour_types[row.labour_type] +=1;
            })    
        }
    }
    console.log(extract_dataset);
    // console.log(sexual_types,labour_types);
    if(Object.keys(sexual_types).length != 0){//if user clicks sexual exploitation 
        var count_types = [];
        Object.keys(sexual_types).forEach(function(each_type){
            count_types.push({type:each_type,count:sexual_types[each_type]});
        })
        
    }
    // if(Object.keys(labour_types).length != 0){//if user clicks labour
    //     var count_types = [];
    //     Object.keys(labour_types).forEach(function(each_type){
    //         count_types.push({type:each_type,count:labour_types[each_type]});
    //     })
    //     drawPieChart(count_types,Object.keys(labour_types));
    // }
    // if(Object.keys(sexual_types).length != 0 && Object.keys(labour_types).length ){
    //     console.log("both");
    // }

}
function mouseout(){
    d3.select("#svg_pieChart").remove();
}
function drawBeeSwarmChart(count_types,types){

}
function drawPieChart(count_types,types){
    // console.log(sexual_types);
    // console.log(types)
    // console.log(count_types); 
    var radius = Math.min(width,height)/2; //console.log(radius);
    var color = ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f','#bf5b17','#666666'];
    var arc = d3.arc()
                .innerRadius(radius*0.5)
                .outerRadius(radius*0.9);
    var outerArc = d3.arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9);
                
    var pie = d3.pie()
                .value(function(d){return d.count;})
                .sort(null);
    svg_pieChart = d3.select("#pieChart")
                 .append("svg")
                 .attr("id","svg_pieChart")
                 .attr("width",width)
                 .attr("height",height+100)
                 .append("g")
                 .attr("transform","translate("+width/2 + "," + height/2+")")  
                 //.attr("transform","translate("+width/3 + "," + height/4+")") 
                ;
    var arcs = svg_pieChart.selectAll(".arc")
                           .data(pie(count_types));
    arcs.enter()
        //.append("g")
        //.attr("transform","translate("+width/3 + "," + height/2+")") 
        .append("path")
        .attr("class","arc")
        .attr("stroke","white")
        .attr("fill",function(d,i){
             return color[i];
            })
        .attr("d",arc);
   
    svg_pieChart.selectAll("polyline")
        .data(pie(count_types))
        .enter()
        .append("polyline")
        .attr("class","arc_line")
        .attr("stroke","black").style("fill","none").attr("stroke-width",1)
        .attr("points",function(d){
            var posA = arc.centroid(d);
            var posB = outerArc.centroid(d); 
            var posC = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle -d.startAngle)/2;
            posC[0] = radius*0.95*(midangle < Math.PI ?1:-1)
            return [posA, posB, posC];
        });
        
    
    svg_pieChart.selectAll("text")
        .data(pie(count_types))
        .enter()
        .append("text")
        .attr("class","arc_label")
        .attr("text-anchor",function(d){
            var midangle = d.startAngle +(d.endAngle-d.startAngle)/2;
            return (midangle<Math.PI? 'start':'end');
        })
        .text(function(d){
            return d.data.type + "\t" +d.data.count;})
        .attr("transform",function(d){
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle +(d.endAngle - d.startAngle)/2;
            pos[0] = radius*0.99*(midangle<Math.PI?1:-1);
            return 'translate(' + pos + ')';
        });
    
}
function extract_data(exploit_type,selected_year){
    // console.log(dataset);
    var extract_dataset = dataset.filter(function(d){
        // console.log(d.exploit_type);
        return d.exploit_type === exploit_type;
    })
    if(selected_year != "all-years"){
        extract_dataset=extract_dataset.filter(function(d){
            return d.year==selected_year;
        })
    }
    
    return extract_dataset;
}
function yearChange(){
    var select = d3.select('#selectButton_year').node();
    // Get current value of select element
    var selectedOption= select.options[select.selectedIndex].value;
    // console.log(selectedOption);
    
    d3.selectAll(".exploit_chart").remove();
    d3.selectAll(".exploit_label").remove();
    d3.selectAll(".percent_label").remove();
    d3.selectAll(".count_label").remove();
    // d3.selectAll(".arc").remove();
   
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

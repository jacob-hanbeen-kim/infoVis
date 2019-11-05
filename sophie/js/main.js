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
    if (year == 'all-years'){
        cur_data={};
        Object.keys(exploit_counts).forEach(function(year){
            Object.keys(exploit_counts[year]).forEach(function(type){
                if(!cur_data[type]) cur_data[type]=exploit_counts[year][type];
                else cur_data[type]=cur_data[type]+exploit_counts[year][type];
            })
        });
        // console.log(cur_data);
    }
    else cur_data=exploit_counts[year];
    
    console.log(cur_data);
    exploit_types=Object.keys(cur_data); 
    total_count = d3.sum(Object.values(cur_data)); //console.log(total_count)
    var xScale = d3.scaleLinear()
                   .domain([0,total_count])
                   .range([0,width]);
    let cumulative=0;
    var chart = svg.selectAll('rect')
                   .data(exploit_types);
    
    var chartEnter = chart.enter()
                     .append("rect")
                     .attr("class",'exploit_chart')
                     .attr("y",height/2 - barHeight/2)
                     .attr("x",function(d,i){
                        cumulative=cumulative+cur_data[d];
                        return xScale(cumulative-cur_data[d]);
                     })
                     .attr("width",function(d){return xScale(cur_data[d]);})
                     .attr("height",barHeight)
                     
                     .style("fill",function(d,i){
                         return colors[i];
                        });
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
;                              };
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
      ;                              };
                                })
                                 .text(function(d){
                                    val = (cur_data[d] / total_count)*100;
                                     return val.toFixed(2) +" %";});
}
function yearChange(){
    var select = d3.select('#selectButton_year').node();
    // Get current value of select element
    var selectedOption= select.options[select.selectedIndex].value;
    console.log(selectedOption);
    
    d3.selectAll(".exploit_chart").remove();
    d3.selectAll(".exploit_label").remove();
    d3.selectAll(".percent_label").remove();
    d3.selectAll(".count_label").remove();
   
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

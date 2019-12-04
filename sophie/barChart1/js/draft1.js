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
    draw_exploitChart("2015");
});
function draw_exploitChart(year){
    
    if (year == "all-years"){
        var exploit_nestData = nest_exploitType(dataset);
    }
    else{//select only row of that year
        dataset=dataset.filter(function(d){
            return d.year == year;
        })
        var exploit_nestData = nest_exploitType(dataset);
    }
    console.log(exploit_nestData);
    // (exploit_nestData["Sexual exploitation"].length);
    var x = d3.scaleBand()
              .range([0,width])
              .domain(Object.keys(exploit_nestData))
              .padding(0.2);
    var values = Object.values(exploit_nestData)
    var max_height = d3.max(values, function(d){return d.length;}); console.log(max_height);
    var min_height = d3.min(values,function(d){return d.length;})
    var y =d3.scaleLinear()
             .domain([min_height,max_height])
             .range([height,min_height]);
    var chart = svg
                    .selectAll("rect")
                    .data(Object.keys(exploit_nestData))
                    .enter()
                    .append("rect")
                    .attr("x",function(d,i){
                        return i*x.bandwidth()})
                    .attr("y",function(d){
                        console.log(d);
                        return height-y(exploit_nestData[d].length);
                    })
                    .attr("width",x.bandwidth())
                    .attr("height",function(d){
                        return y(exploit_nestData[d].length);
                    })
                    ;
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

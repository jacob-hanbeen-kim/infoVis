d3.csv("realdata.csv").then(d => chart(d));

function chart(csv) { 
    var keys = csv.columns.slice(2);
    console.log(csv);
    var Year = [...new Set(csv.map(d => d.Year))];
    var Relations = [...new Set(csv.map(d => d.Relations))];
    console.log({Relations});
    var options = d3.select("#year").selectAll("option")
        .data(Year)
        .enter()
        .append("option")
        .text(d => d);

    console.log(keys);

    


    var svg = d3.select("#chart"),
       margin = {top:35, left: 35, bottom: 0, right: 18},
       width = +svg.attr("width") - margin.left - margin.right,
       height = +svg.attr("height") - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
                .range([margin.left, width - margin.right])
                .padding(0.1);

    var yScale = d3.scaleLinear()
                .rangeRound([height - margin.bottom, margin.top]);

    var xAxis = svg.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom})`)
                .attr("class", "x-axis");

    var yAxis = svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .attr("class", "y-axis");

    var z = d3.scaleOrdinal()
              .range(["lightpink", "lightblue"])
              .domain(keys);

    update(d3.select("#year").property("value"), 0);

    function update(input, speed) {

       var data = csv.filter(f => f.Year == input);

       data.forEach(function(d) {
         d.total = d3.sum(keys, k => +d[k]);
         return d;
       });


       yScale.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

       svg.selectAll(".y-axis").transition().duration(speed)
          .call(d3.axisLeft(yScale).ticks(null, "s"));

       data.sort(d3.select("#sort").property("checked")
          ? (a, b) => b.total - a.total
          : (a, b) => Relations.indexOf(a.Relations) - Relations.indexOf(b.Relations));
        
        // console.log (data.map(d => d.Relations));
       xScale.domain(data.map(d => d.Relations));

       var tip = d3.select(".d3-tooltip")
          .style("visibility", "hidden");

       svg.selectAll(".x-axis").transition().duration(speed)
          .call(d3.axisBottom(xScale).tickSizeOuter(0));

      (d3.stack().keys(keys)(data), d => {console.log(d)})
      
       var group = svg.selectAll("g.layer")
           .data(d3.stack().keys(keys)(data), (d) => {return d.key});

      console.log(group);
       group.exit().remove();

       group.enter().append("g")
         .classed("layer", true)
         .attr("fill", d => z(d.key))
        // .on("mouseover", function(d,e) {
        //   //to get the Relation
        //   let hoveredG = this;
        //   console.log(hoveredG);
          
          
        //   var num = d.key == "Female" ? d[4][1] : d[4][1] - d[4][0];
        //   // console.log("dkey= " + xScale. + " " + d3.event.pageX) //d.key + " d[0] " + d[4] + " len " + d.length)
        //   tip.html("<p>" + d.key + " " + num + "</p>")
        //     .style("left", (d3.event.pageX) + "px")
        //     .style("top", (d3.event.pageY - 28) + "px")
        //     .style("visibility", "visible");
        // })
        // .on("mouseout", function(d) {
        //   tip.style("visibility", "hidden");
        // }); 
         

       var bars = svg.selectAll("g.layer").selectAll("rect")
           .data(d => d, e => e.data.Relations);

       bars.exit().remove();

       bars.enter().append("rect")
           .attr("width", xScale.bandwidth())
           .merge(bars)
            .on("mouseover", function(d) {
             console.log(d);
             // get number of females
             let numF = +d.data.Female;
             // get number of males
             let numM = +d.data.Male;
             // get the Relations
             let Relations = d.data.Relations;
             
             // Evaluate the gender by comparing the mouseover data value for d[1] to the numF for 'Female'
             // or 
             // numF+numM
             let gender,value;
             if (d[1] === numF){
               gender = 'Female';
               value = numF;
             }else if (d[1] === numF+numM) {
               gender = 'Male';
               value = numM;
             }
            
            //produce the tooltip
            tip.html("<p>" +Relations + "<br>" + gender + ": " + value + "</p>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("visibility", "visible");
            })
            .on("mouseout", function(d) {
              tip.style("visibility", "hidden");
            })
       .transition().duration(speed)
           .attr("x", d => xScale(d.data.Relations))
           .attr("y", d => yScale(d[1]))
           .attr("height", d => yScale(d[0]) - yScale(d[1]));
           
       var text = svg.selectAll(".text")
           .data(data, d => d.Relations);

       text.exit().remove();

       text.enter().append("text")
           .attr("class", "text")
           .attr("text-anchor", "middle")
           .merge(text)
       .transition().duration(speed)
           .attr("x", d => xScale(d.Relations) + xScale.bandwidth() / 2)
           .attr("y", d => yScale(d.total) - 5)
           .text(d => d.total);
    }

    var select = d3.select("#year")
        .on("change", function() {
          update(this.value, 750);
        });

    var checkbox = d3.select("#sort")
        .on("click", function() {
          update(select.property("value"), 750);
        });

   svg.append("rect").attr("x",width-5).attr("y", 15).attr("width", 15).attr("height", 15).style("fill", "lightpink");
   svg.append("rect").attr("x",width-5).attr("y",45).attr("width", 15).attr("height", 15).style("fill", "lightblue");
   svg.append("text").attr("x", width +15).attr("y", 22).text("Female").style("font-size", "11px").attr("alignment-baseline","middle");
   svg.append("text").attr("x", width + 15).attr("y", 53).text("Male").style("font-size", "11px").attr("alignment-baseline","middle");

  }



  




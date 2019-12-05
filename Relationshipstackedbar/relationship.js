




d3.csv("realdata.csv").then(d => chart(d))

function chart(csv) { 
    var keys = csv.columns.slice(2);

    var Year = [...new Set(csv.map(d => d.Year))]
    var Relations = [...new Set(csv.map(d => d.Relations))]

    var options = d3.select("#year").selectAll("option")
        .data(Year)
        .enter()
        .append("option")
        .text(d => d)

    console.log(keys)

    


    var svg = d3.select("#chart"),
       margin = {top:35, left: 35, bottom: 0, right: 18},
       width = +svg.attr("width") - margin.left - margin.right,
       height = +svg.attr("height") - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
                .range([margin.left, width - margin.right])
                .padding(0.1)

    var yScale = d3.scaleLinear()
                .rangeRound([height - margin.bottom, margin.top])

    var xAxis = svg.append("g")
                .attr("transform", `translate(0, ${height - margin.bottom})`)
                .attr("class", "x-axis")

    var yAxis = svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .attr("class", "y-axis")

    var z = d3.scaleOrdinal()
              .range(["lightpink", "lightblue"])
              .domain(keys);

    update(d3.select("#year").property("value"), 0)

    function update(input, speed) {

       var data = csv.filter(f => f.Year == input)

       data.forEach(function(d) {
         d.total = d3.sum(keys, k => +d[k])
         return d
       })

      console.log(data[0])

       yScale.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

       svg.selectAll(".y-axis").transition().duration(speed)
          .call(d3.axisLeft(yScale).ticks(null, "s"))

       data.sort(d3.select("#sort").property("checked")
          ? (a, b) => b.total - a.total
          : (a, b) => Relations.indexOf(a.Relations) - Relations.indexOf(b.Relations))

       xScale.domain(data.map(d => d.Relations));

       var tip = d3.select(".d3-tooltip")
          .style("visibility", "hidden");

       svg.selectAll(".x-axis").transition().duration(speed)
          .call(d3.axisBottom(xScale).tickSizeOuter(0))

       var group = svg.selectAll("g.layer")
           .data(d3.stack().keys(keys)(data), d => d.key)

       group.exit().remove()

       group.enter().append("g")
         .classed("layer", true)
         .attr("fill", d => z(d.key));
         

       var bars = svg.selectAll("g.layer").selectAll("rect")
           .data(d => d, e => e.data.Relations);

       bars.exit().remove()

       bars.enter().append("rect")
           .attr("width", xScale.bandwidth())
           .merge(bars)
       .transition().duration(speed)
           .attr("x", d => xScale(d.data.Relations))
           .attr("y", d => yScale(d[1]))
           .attr("height", d => yScale(d[0]) - yScale(d[1]))
           
       var text = svg.selectAll(".text")
           .data(data, d => d.Relations);

       text.exit().remove()

       text.enter().append("text")
           .attr("class", "text")
           .attr("text-anchor", "middle")
           .merge(text)
       .transition().duration(speed)
           .attr("x", d => xScale(d.Relations) + xScale.bandwidth() / 2)
           .attr("y", d => yScale(d.total) - 5)
           .text(d => d.total)
    }

    var select = d3.select("#year")
        .on("change", function() {
          update(this.value, 750)
        })

    var checkbox = d3.select("#sort")
        .on("click", function() {
          update(select.property("value"), 750)
        })

   svg.append("rect").attr("x",width-5).attr("y", 15).attr("width", 15).attr("height", 15).style("fill", "lightpink")
   svg.append("rect").attr("x",width-5).attr("y",45).attr("width", 15).attr("height", 15).style("fill", "lightblue")
   svg.append("text").attr("x", width +15).attr("y", 22).text("Female").style("font-size", "11px").attr("alignment-baseline","middle")
   svg.append("text").attr("x", width + 15).attr("y", 53).text("Male").style("font-size", "11px").attr("alignment-baseline","middle")

  }



  




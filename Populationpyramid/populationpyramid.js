

var margin = { top: 0, right: 40, bottom: 50, left: 60 },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

state = { year: 2002, gender: 2 };


var svg = d3.select('#main')
  .append("svg")
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

d3.json('./years6.json').then(years => {





  var ageDomain = unique(years.map(row => row.age));
  //var age = ["0--8", "9--17", "18--20", "21--23", "24--26", "27--29", "30--38", "39--47", "48+"]
  var getRange = d => {
    const index = ageDomain.findIndex(item => item === d);
    if (index === 0) {
      return `0 - ${d}`;
    }
    else
      if (index === ageDomain.length - 1) {
        return `${d}+`;
      }
      else {
        return `${ageDomain[index - 1] + 1} - ${d}`;
      }
  }


  var xScale = d3.scaleBand().rangeRound([0, width])
    .padding(0.1)
    .domain(ageDomain);



  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .text(function (d) { console.log(d); return getRange(d); })
    .attr("transform", "translate(-10,0)rotate(-45")
    .style("text-anchor", "end");

  var peopleDomain = [0, d3.max(years, row => row.population)];

  var yScale = d3.scaleLinear()
    .range([height, 0])
    .domain(peopleDomain);

  svg.append("g")
    .call(d3.axisLeft(yScale));


  sexDomain = [1, 2];
  var maleColor = '#42adf4';
  var femaleColor = '#ff96ca';

  var color = d3.scaleOrdinal()
    .range([maleColor, femaleColor])
    .domain(sexDomain);

  svg.selectAll('text')
    .style("font-family", "sans-serif")


  title = svg.append("text")
    .attr("transform", "translate(" + ((width + margin.left + margin.right) / 2) + "," + 20 + ")")
    .style("text-anchor", "middle")
    .style("font-weight", 1000)
    .text("Census Age Group and missing population by gender");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-weight", 900)
    .text("population");

  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + "," + (height + margin.top + 40) + ")")
    .style("text-anchor", "middle")
    .style("font-weight", 900)
    .text("Age Group");


  var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + (i * 20) + ")"
    })
    .style('font-family', 'sans-serif')

  legend.append("rect")
    .attr('class', 'legend-rect')
    .attr("x", width + margin.right - 12)
    .attr("y", 65)
    .attr("width", 12)
    .attr("height", 12)
    .style("fill", color);


  legend.append("text")
    .attr('class', 'legend-text')
    .attr("x", width + margin.right - 22)
    .attr("y", 70)
    .style('font-size', "12px")
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) { return d === 1 ? 'Male' : 'Female'; });


  function isYearAndSex(row, year, gender) {
    return row.year === year && row.gender === gender;
  }


  var filteredData = years.filter(row => isYearAndSex(row, state.year, state.gender));

  bars = svg.selectAll('.bar').data(filteredData);

  var enterbars = bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => xScale(d.age))
    .attr('y', function (d) {
      console.log(yScale(d.population));
      return yScale(d.population)
    })
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => height - yScale(d.population))
    .attr('fill', (d) => color(d.gender));
  var tip = d3.tip()
    .attr('class', "d3-tip")
    .style("color", "white")
    .style("background-color", "black")
    .style("padding", "6px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .offset([-10, 0])
    .html(function (d) { return `<strong>${d3.format(',')(d.population)}</strong> population`; });

  svg.call(tip);

  svg
    .selectAll('.bar')
    .on('mouseover', function (d) {
      // show the tooltip on mouse over
      tip.show(d, this);
      // when the bar is mouse-overed, we slightly decrease opacity of the bar.
      d3.select(this).style('opacity', 0.7);
    })
    .on('mouseout', function (d) {
      // hide the tooltip on mouse out
      tip.hide();
      d3.select(this).style('opacity', 1)
    });


  legend
    .selectAll('.legend-rect')
    .style('opacity', d => d === state.gender ? 1 : 0.5);

  legend
    .selectAll('.legend-text')
    .style('opacity', d => d === state.gender ? 1 : 0.5)
    .style('font-weight', d => d === state.gender ? 700 : 400);

  legend
    .on('click', d => update(d, 0))

  legend
    .style('cursor', 'pointer');

  svg.selectAll('text').style("font-family", "sans-serif");

  function update(gender, step) {

    state.gender = gender;
    state.year += step;

    var newData = years.filter(row => isYearAndSex(row, state.year, state.gender));

    var bars = svg.selectAll('.bar')
      .data(newData, (d) => {
        if (d.year === state.year) {
          return d.age - step;
        } else {
          return d.age;

        }
      });

    bars.enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.age))
      .attr('y', d => yScale(0))
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', d => color(d.gender))
      .on('mouseenter', function (d) {
        tip.show(d, this);
        d3.select(this).style('opacity', 0.7);
      })
      .on('mouseout', function (d) {
        tip.hide();
        d3.select(this).style('opacity', 1)
      })
      .transition('enter-transition')
      .duration(500)
      .attr('y', d => yScale(d.population))
      .attr('height', d => height - yScale(d.population))

    bars.transition('update-transition')
      .duration(500)
      .attr('x', d => xScale(d.age))
      .attr('y', d => yScale(d.population))
      .attr('height', d => height - yScale(d.population))
      .attr('fill', d => color(d.gender));

    bars.exit()
      .transition('exit-transition')
      .duration(500)
      .attr('height', 0)
      .attr('y', yScale(0))
      .remove();

    // update legend
    legend.selectAll('.legend-rect')
      .style('opacity', d => d === state.gender ? 1 : 0.5);

    legend.selectAll('.legend-text')
      .style('opacity', d => d === state.gender ? 1 : 0.5)
      .style('font-weight', d => d === state.gender ? 700 : 400);

    // update the year text
    document.getElementById('curr-year').textContent = state.year;
  }

  document.getElementById('curr-year').textContent = state.year;
  document.getElementById('decrement').addEventListener('click', () => update(state.gender, -1));
  document.getElementById('increment').addEventListener('click', () => update(state.gender, 1));
  document.getElementById('switch-sex').addEventListener('click', () => update(state.gender === 1 ? 2 : 1, 0));


  d3.select('#viz')
    .node().appendChild(container.node());

});



function isYearAndSex(row, year, gender) {
  return row.year === year && row.gender === gender;
}

function unique(arr) {
  return arr.filter(d => arr.indexOf((v, i) => arr.indexOf(v) === i));
}




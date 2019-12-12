

// var margin = { top: 0, right: 40, bottom: 50, left: 60 },
//   width = 500 - margin.left - margin.right,
//   height = 500 - margin.top - margin.bottom;

state = { year: '2002', gender: 2 };



function updateGenderAge() {

  svg.selectAll('*').remove();
  margin = { top: 150, right: 200, bottom: 40, left: 50 }
  w = width - margin.left - margin.right;
  h = height - margin.top - margin.bottom;

  var ageDomain = unique(genderAgeData.map(row => row.age));
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

  var peopleDomain = [0, d3.max(genderAgeData, row => row.population)];

  xScale = d3.scaleBand().rangeRound([0, w])
    .padding(0.1)
    .domain(ageDomain);

  yScale = d3.scaleLinear()
    .domain(peopleDomain)
    .range([h, 0]);

  chartG = svg.append("g")
    .attr("transform", "translate(" + [margin.left, margin.top] + ")");

  var title = chartG.append('text')
    .attr('id', 'title')
    .attr('x', w / 2 + margin.left)
    .attr('y', 0 - (margin.top / 4))
    .attr('text-anchor', 'middle')
    .attr('fill', '#eee')
    //.style('font-size', '40px')
    .style('opacity', '0')
    .text("Census Age Group and missing population by gender");

  // Define and draw axes
  var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + [0, h] + ')');

  var yAxisG = chartG.append('g')
    .attr('class', 'y axis');

  xAxisG.transition()
    .duration(750)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .text(function (d) {
      return getRange(d);
    });

  yAxisG.transition()
    .duration(750)
    .call(d3.axisLeft(yScale));
  title.transition()
    .duration(750)
    .style('opacity', '1');


  sexDomain = [1, 2];
  var maleColor = '#42adf4';
  var femaleColor = '#ff96ca';

  color = d3.scaleOrdinal()
    .range([maleColor, femaleColor])
    .domain(sexDomain);

  svg.selectAll('text')
    .style("font-family", "sans-serif")

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (h / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-weight", 900)
    .text("population");

  svg.append("text")
    .attr("transform", "translate(" + [(w / 2) + margin.left, (h + margin.top + 40)] + ")")
    .attr('fill', '#eee')
    .style("text-anchor", "middle")
    .style("font-size", '13px')
    .text("Age Group");


  legend = chartG.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(" + [-margin.right, (i * 20)] + ")"
    })
    .style('font-family', 'sans-serif')

  legend.append("rect")
    .attr('class', 'legend-rect')
    .attr("x", w + margin.right - 12)
    .attr("y", 65)
    .attr("width", 12)
    .attr("height", 12)
    .style("fill", color);


  legend.append("text")
    .attr('class', 'legend-text')
    .attr("x", w + margin.right - 22)
    .attr("y", 70)
    .attr('fill', '#eee')
    .style('font-size', "12px")
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) { return d === 1 ? 'Male' : 'Female'; });


  function isYearAndSex(row, year, gender) {
    return row.year === year && row.gender === gender;
  }


  var filteredData = genderAgeData.filter(row => isYearAndSex(row, state.year, state.gender));

  bars = chartG.selectAll('.bar').data(filteredData);

  var enterbars = bars.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) {
      return xScale(d.age);
    })
    .attr('y', function (d) {
      return yScale(d.population);
    })
    .attr('width', xScale.bandwidth())
    .attr('height', function (d) {
      return h - yScale(d.population);
    })
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
    .on('click', d => update(d, state.year))

  legend
    .style('cursor', 'pointer');

  svg.selectAll('text').style("font-family", "sans-serif");


  var years = ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']
  var yearScale = d3.scaleBand()
    .domain(years)
    .range([0, w]);


  var slider = chartG.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + [30, 0] + ")");

  slider.append("line")
    .attr("class", "track")
    .attr("x1", yearScale.range()[0])
    .attr("x2", yearScale.range()[1] - yearScale.step())
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
      .on("start.interrupt", function () { slider.interrupt(); })
      .on("start drag", function () {
        var eachBand = yearScale.step();
        var index = Math.round((d3.event.x / eachBand));
        var d = yearScale.domain()[index];

        var step = +state.year - +d;
        handle.attr("cx", yearScale(d));
        label
          .attr("x", yearScale(d))
          .text(d);
        update(state.gender, d, step);
      })
    );

  slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(years)
    .enter()
    .append("text")
    .attr("x", yearScale)
    .attr("y", 10)
    .attr("fill", "#eee")
    .attr("text-anchor", "middle")
    .text(function (d) { return d; });

  var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("fill", "#eee")
    .attr("cx", yearScale(state.year))
    .attr("r", 9);

  var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("fill", "#eee")
    .text(state.year)
    .attr("x", yearScale(state.year))
    .attr("transform", "translate(0," + (-25) + ")")
}

function update(gender, year, step = 0) {

  state.gender = gender;
  state.year = year;

  var newData = genderAgeData.filter(row => isYearAndSex(row, state.year, state.gender));

  var bars = chartG.selectAll('.bar')
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
    .attr('height', d => h - yScale(d.population))

  bars.transition('update-transition')
    .duration(500)
    .attr('x', d => xScale(d.age))
    .attr('y', d => yScale(d.population))
    .attr('height', d => h - yScale(d.population))
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
}

function isYearAndSex(row, year, gender) {
  return row.year === year && row.gender === gender;
}

function unique(arr) {
  return arr.filter(d => arr.indexOf((v, i) => arr.indexOf(v) === i));
}

function updateGenderYearVal(gender, year) {
  state.gender = gender;
  state.year = year;
  updateGenderAge();
}


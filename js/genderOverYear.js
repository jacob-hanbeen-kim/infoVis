

function updateGenderOverYear() {

    data = { 1: {}, 2: {} }
    for (var i = 0; i < genderAgeData.length; i++) {
        if (genderAgeData[i].year in data[genderAgeData[i].gender]) {
            data[genderAgeData[i].gender][genderAgeData[i].year] += +genderAgeData[i].population;
        } else {
            data[genderAgeData[i].gender][genderAgeData[i].year] = 0;
        }
    }

    var x = d3.scaleTime()
        .domain([new Date('2002'), new Date('2019')])
        .range([10, width - 10]);

    svg.append('g')
        .attr('transform', 'translate(' + [0, height] + ')')
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([0, d3.max(genderAgeData, function (d) { return +d.population; })])
        .range([height, 0]);

    svg.append('g')
        .call(d3.axisLeft(y));

    sexDomain = [1, 2];
    var maleColor = '#42adf4';
    var femaleColor = '#ff96ca';

    var color = d3.scaleOrdinal()
        .range([maleColor, femaleColor])
        .domain(sexDomain);


    svg.selectAll('.line')
        .data(data)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', function (d) { console.log(d); return color(d.key); })
        .attr('stroke-width', 1.5)
        .attr('d',
            function (d) {
                return d3.line()
                    .x(function (d) { return x(new Date(d.year)); })
                    .y(function (d) { return y(+d.population); })
                    (d.values)
            });
}
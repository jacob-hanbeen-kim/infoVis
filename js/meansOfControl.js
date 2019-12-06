
var titleDict = {
    "sexual_exploitation": "Sexual Exploitation",
    "labour_exploitation": "Labour Exploitation"
}

function updateMeansOfControl(exploit_type, highlightMax = false, includeUnknown = false) {

    svg.selectAll('*').remove();

    var filter_data = meansOfControlData.filter(function (row) {
        if (includeUnknown) {
            return row.exploit_type == exploit_type;
        } else {
            if (row.exploit_type == exploit_type) {
                if (!(row.control_mean == "Unknown" || row.control_mean == "Not Specified")) {
                    return true;
                }
            }
        }
    });

    filter_data.sort(function (x, y) {
        return d3.descending(x.count, y.count);
    })

    var margin = { top: 150, right: 30, bottom: 40, left: 150 }
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;

    var max_val = d3.max(filter_data, function (d) { return d.count; });
    var xScale = d3.scaleLinear()
        .domain([0, max_val])
        .range([1, w]);

    var control_means = filter_data.map(function (d) { return d.control_mean; });
    var yScale = d3.scaleBand()
        .range([0, h])
        .domain(control_means)
        .padding(.1);

    // Create a group element for appending chart elements
    var chartG = svg
        .append('g')
        .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

    var title = chartG.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 - margin.right)
        .attr('y', 0 - (margin.top / 4))
        .attr('text-anchor', 'middle')
        .attr('fill', '#eee')
        .style('font-size', '40px')
        .style('opacity', '0')
        .text(titleDict[exploit_type]);

    var xAxisG = chartG.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + [0, h] + ')')

    var yAxisG = chartG.append('g')
        .attr('class', 'y axis');

    xAxisG.transition()
        .duration(750)
        .call(d3.axisBottom(xScale));
    yAxisG.transition()
        .duration(750)
        .call(d3.axisLeft(yScale));
    title.transition()
        .duration(750)
        .style('opacity', '1');

    //bars
    var bars = svg
        .selectAll('.mocBar')
        .data(filter_data);

    var barsEnter = bars.enter()
        .append('rect')
        .attr('class', 'mocBar')
        .style('opacity', '0');

    bars.merge(barsEnter)
        .attr('x', xScale(0) + margin.left)
        .attr('y', function (d) {
            return yScale(d.control_mean) + margin.top;
        })
        .attr('width', function (d) { return xScale(d.count); })
        .attr('height', yScale.bandwidth())
        .attr('fill', function (d) {
            if (highlightMax) {
                if (d.count == max_val) {
                    return '#CF6766';
                } else {
                    return '#69b3a2';
                }
            } else {
                return '#69b3a2';
            };
        })
        .transition()
        .duration(750)
        .style('opacity', '1');

    var label = svg
        .selectAll('.mocCount')
        .data(filter_data);

    var labelEnter = label.enter()
        .append('text')
        .attr('class', 'mocCount')
        .attr('fill', '#eee')
        .style('font-size', '10px')
        .style('opacity', '0')
        .attr('text-anchor', 'start');

    label.merge(labelEnter)
        .text(function (d) {
            return d.count;
        })
        .attr('x', function (d) { return xScale(d.count) + margin.left + 10; })
        .attr('y', function (d) {
            return yScale(d.control_mean) + margin.top + yScale.bandwidth() / 2 + 3;
        })
        .transition()
        .duration(750)
        .style('opacity', '1');

    bars.exit().remove();
    label.exit().remove();
}
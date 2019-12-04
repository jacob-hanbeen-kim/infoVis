countries =
    ['AE', 'AF', 'AL', 'AR', 'AT', 'BA', 'BD', 'BF', 'BG', 'BH', 'BO', 'BY',
        'CD', 'CI', 'CN', 'CO', 'CY', 'CZ', 'DK', 'EC', 'EG', 'ER', 'GH', 'GN',
        'GW', 'HK', 'HT', 'ID', 'IN', 'IT', 'JO', 'JP', 'KG', 'KH', 'KR', 'KW',
        'KZ', 'LA', 'LB', 'LK', 'MD', 'MG', 'MK', 'ML', 'MM', 'MU', 'MX', 'MY',
        'NE', 'NG', 'NP', 'OM', 'PH', 'PL', 'QA', 'RO', 'RU', 'SA', 'SG', 'SL',
        'SN', 'SV', 'SY', 'TH', 'TJ', 'TM', 'TR', 'TT', 'TW', 'UA', 'UG', 'Unknown',
        'US', 'UZ', 'VN', 'Y1', 'ZA', 'ZZ']


function clearSourceToTarget() {
    svg.selectAll('*').remove();
}
function updateSourceToTarget(year, removeAll = false) {
    if (removeAll) {
        svg.selectAll('*').remove();
    }

    var filteredData = humanTraffickingData.filter(function (d) {
        if (year == "allYears") {
            return true;
        } else {
            //console.log(d['Year of Registration']);
            return d['Year of Registration'] == year;
        }
    });

    var source = {};
    for (var i = 0; i < filteredData.length; i++) {
        var c = filteredData[i]['Citizenship'];
        if (c in source) {
            source[c] += 1;
        } else {
            source[c] = 1;
        }
    }

    var target = {};
    for (var i = 0; i < filteredData.length; i++) {
        var c = filteredData[i]['Country_of_Exploitation'];
        if (c in target) {
            target[c] += 1;
        } else {
            target[c] = 1;
        }
    }

    //Add the circle for the nodes
    var targetCircle = svg
        .selectAll(".target_countries")
        .data(countries);

    var targetCircleEnter = targetCircle.enter()
        .append('circle')
        .attr('class', 'target_countries')
        .attr("cx", 0)
        .attr("cy", 0)
        //.attr("r", function (d) { return 5; })
        .style("fill", "#CF6766")
        .attr("stroke", "white");

    targetCircle.merge(targetCircleEnter)
        .attr("r", function (d) {
            if (d in target) { return size(target[d]); }
            else { return 0; }
        })
        .attr('transform', function (d) {
            return 'translate(' + [x(d), height - 30] + ')';
        });

    var sourceCircle = svg
        .selectAll(".source_countries")
        .data(countries);

    var sourceCircleEnter = sourceCircle.enter()
        .append("circle")
        .attr('class', 'source_countries')
        .attr("cx", 0)
        .attr("cy", 0)
        //.attr("r", function (d) { return 5; })
        .style("fill", "#328CC1")
        .attr("stroke", "white");

    sourceCircle.merge(sourceCircleEnter)
        .attr("r", function (d) {
            if (d in source) { return size(source[d]); }
            else { return 0; }
        })
        .attr('transform', function (d) {
            return 'translate(' + [x(d), height - 30] + ')';
        });

    // Add the label
    var labels = svg.selectAll(".labels")
        .data(countries);

    var labelsEnter = labels.enter()
        .append('text')
        .attr('class', 'labels')
        .attr('x', 0)
        .attr('y', 0)
        .text(function (d) { return (d) })
        .style('text-anchor', 'end')
        .style('font-size', 6)
        .style('fill', '#eee');

    labels.merge(labelsEnter)
        .attr('transform', function (d) {
            return ('translate(' + x(d) + ',' + (height - 15) + ')rotate(-45)')
        });

    // Add the links
    destToSrc = {}
    var links = svg.selectAll(".links")
        .data(filteredData);

    var linksEnter = links.enter()
        .append('path')
        .attr('class', 'links')
        .style('fill', 'none')
        .attr('stroke', '#eee')
        .style('stroke-width', 1)

    links.merge(linksEnter)
        .attr('d', function (d) {
            var src = d['Citizenship']
            var dest = d['Country_of_Exploitation']

            var start = x(src)
            var end = x(dest)

            if (dest in destToSrc) {
                var arr = destToSrc[dest];
                arr.add(src);
                destToSrc[dest] = arr;
            } else {
                destToSrc[dest] = new Set([src]);
            }


            return ['M', start, height - 30,
                'A',
                (start - end) / 2, ',',
                (start - end) / 2, 0, 0, ',',
                start < end ? 1 : 0, end, ',', height - 30]
                .join(' ')
        })

    sourceCircleEnter
        .on('mouseover', function (d) {
            // Highlight the nodes: every node is green except of him
            sourceCircleEnter
                .style('opacity', .2)
            d3.select(this)
                .style('opacity', 1)

            targetCircleEnter
                .style('opacity', function (circle_d) { var set = destToSrc[circle_d]; return set ? (set.has(d) ? 1 : .2) : .2; })

            // Highlight the connections
            linksEnter
                .style('stroke', function (link_d) { return link_d['Citizenship'] === d ? '#328CC1' : '#eee'; })
                //.style('sroke-opacity', function (link_d) { return link_d['Citizenship'] === d || link_d['Country_of_Exploitation'] === d['Country_of_Exploitation'] ? 1 : .2; })
                .style('stroke-width', function (link_d) { return link_d['Citizenship'] === d ? 4 : 1; })

            labelsEnter
                .style('font-size', function (label_d) { var set = destToSrc[label_d]; return label_d === d || (set ? set.has(d) : false) ? 16 : 2 })
                .attr('y', function (label_d) { return label_d === d ? 10 : 0 })
        })
        .on('mouseout', function (d) {
            sourceCircleEnter.style('opacity', 1)
            targetCircleEnter.style('opacity', 1)
            linksEnter
                .style('stroke', '#eee')
                //.style('stroke-opacity', .8)
                .style('stroke-width', 1)
            labelsEnter
                .style('font-size', 6)
                .attr('y', 0)
        })

    targetCircle.exit().remove();
    sourceCircle.exit().remove();
    labels.exit().remove();
    links.exit().remove();
}

// event listener
function onYearChanged() {
    var select = d3.select('#stt_yearSelector').property('value');

    updateSourceToTarget(select);
}
// set the dimensions and margins of the graph
var margin = { top: 0, right: 30, bottom: 50, left: 60 },
    width = 1300 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#main")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// Load data and use this function to process each row
function dataPreprocessor(row) {
    return {
        'Year of Registration': row['Year of Registration'],
        'Datasource': row['Datasource'],
        'Gender': row['Gender'],
        'Age Broad': row['Age Broad'],
        'Majority Status': row['Majority Status'],
        'Majority At Exploit': row['Majority At Exploit'],
        'Majority Entry': row['Majority Entry'],
        'Citizenship': row['Citizenship'],
        'Means of Control': row['Means of Control'],
        'Reason for Trafficking': row['Reason for Trafficking'],
        'Type Of Exploitation': row['Type Of Exploitation'],
        'Type of Labour': row['Type of Labour'],
        'Type of Sex': row['Type of Sex'],
        'is Abduction': row['is Abduction'],
        'Recruiter Relationship': row['Recruiter Relationship'],
        'Country_of_Exploitation': row['Country_of_Exploitation']
    };
}

countries =
    ['AE', 'AF', 'AL', 'AR', 'AT', 'BA', 'BD', 'BF', 'BG', 'BH', 'BO', 'BY',
        'CD', 'CI', 'CN', 'CO', 'CY', 'CZ', 'DK', 'EC', 'EG', 'ER', 'GH', 'GN',
        'GW', 'HK', 'HT', 'ID', 'IN', 'IT', 'JO', 'JP', 'KG', 'KH', 'KR', 'KW',
        'KZ', 'LA', 'LB', 'LK', 'MD', 'MG', 'MK', 'ML', 'MM', 'MU', 'MX', 'MY',
        'NE', 'NG', 'NP', 'OM', 'PH', 'PL', 'QA', 'RO', 'RU', 'SA', 'SG', 'SL',
        'SN', 'SV', 'SY', 'TH', 'TJ', 'TM', 'TR', 'TT', 'TW', 'UA', 'UG', 'Unknown',
        'US', 'UZ', 'VN', 'Y1', 'ZA', 'ZZ']

// Read the data
d3.csv('cleanData.csv', dataPreprocessor).then(function (data) {

    humanTraffickingData = data
    // A linear scale to position the nodes on the X axis
    x = d3.scalePoint()
        .domain(countries)
        .range([0, width]);

    size = d3.scaleLinear()
        .domain([0, 1300])
        .range([5, 10]);

    update('allYears');
})




// event listener
function onYearChanged() {
    var select = d3.select('#yearSelector').property('value');

    update(select);
}


function update(year) {
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
        .style("fill", "rgb(255,0,0)")
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
        .style("fill", "rgb(0,0,255)")
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
        .style('font-size', 6);

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
        .attr('stroke', 'grey')
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
                .style('stroke', function (link_d) { return link_d['Citizenship'] === d ? '#0000FF' : 'grey'; })
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
                .style('stroke', 'grey')
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
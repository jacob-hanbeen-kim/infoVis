// set the dimensions and margins of the graph
var margin = { top: 0, right: 30, bottom: 50, left: 60 },
    width = 650 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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
    var x = d3.scalePoint()
        .domain(countries)
        .range([0, width]);

    var size = d3.scaleLinear()
        .domain([0, 1300])
        .range([1, 5]);

    var source = {};
    for (var i = 0; i < data.length; i++) {
        var c = data[i]['Citizenship'];
        if (c in source) {
            source[c] += 1;
        } else {
            source[c] = 1;
        }
    }

    var target = {};
    for (var i = 0; i < data.length; i++) {
        var c = data[i]['Country_of_Exploitation'];
        if (c in target) {
            target[c] += 1;
        } else {
            target[c] = 1;
        }
    }

    //Add the circle for the nodes
    var targetCircle = svg
        .selectAll("target_countries")
        .data(countries)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d); })
        .attr("cy", height - 30)
        .attr("r", function (d) { return (size(target[d])) })
        //.attr("r", function (d) { return 5; })
        .style("fill", "rgb(255,0,0)")
        .attr("stroke", "white")

    var sourceCircle = svg
        .selectAll("source_countries")
        .data(countries)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d); })
        .attr("cy", height - 30)
        .attr("r", function (d) { return (size(source[d])) })
        //.attr("r", function (d) { return 5; })
        .style("fill", "rgb(0,0,255)")
        .attr("stroke", "white")

    // Add the links
    var links = svg
        .selectAll("links")
        .data(data)
        .enter()
        .append('path')
        .attr('d', function (d) {
            start = x(d['Citizenship'])
            end = x(d['Country_of_Exploitation'])
            return ['M', start, height - 30,
                'A',
                (start - end) / 2, ',',
                (start - end) / 2, 0, 0, ',',
                start < end ? 1 : 0, end, ',', height - 30]
                .join(' ')
        })
        .style('fill', 'none')
        .attr('stroke', 'grey')
        .style('stroke-width', 1)

    sourceCircle
        .on('mouseover', function (d) {
            // Highlight the nodes: every node is green except of him
            sourceCircle
                .style('opacity', .2)
            d3.select(this)
                .style('opacity', 1)

            // Highlight the connections
            links
                .style('stroke', function (link_d) { return link_d['Citizenship'] === d['Citizenship'] || link_d['Country_of_Exploitation'] === d['Country_of_Exploitation'] ? color(d.grp) : '$b8b8b8'; })
                .style('sroke-opacity', function (link_d) { return link_d['Citizenship'] === d['Citizenship'] || link_d['Country_of_Exploitation'] === d['Country_of_Exploitation'] ? 1 : .2; })
                .style('stroke-width', function (link_d) { return link_d['Citizenship'] === d['Citizenship'] || link_d['Country_of_Exploitation'] === d['Country_of_Exploitation'] ? 4 : 1; })
        })
        .on('mouseout', function (d) {
            sourceCircle.style('opacity', 1)
            links
                .style('stroke', 'grey')
                .style('stroke-opacity', .8)
                .style('storke-width', '1')
        })
})


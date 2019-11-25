// set the dimensions and margins of the graph
width = getDivWidth('visualization') - 30;
height = 500;
// svg
svg = d3.select("svg");

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

    updateSourceToTarget('2002');

    scroll('div4', '10%', '2005', '2002');
    scroll('div6', '10%', '2007', '2005');
    scroll('div7', '10%', '2002', '2007');
    scroll2('div8', '10%', '2009', '2002');
    scroll3('div9', '10%', '2002', '2009');
});

function getDivWidth(id) {
    return document.getElementById(id).offsetWidth;
}

//waypoints scroll constructor
function scroll(n, offset, func1, func2) {
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            direction == 'down' ? updateSourceToTarget(func1) : updateSourceToTarget(func2);
        },
        // start 75% from the top of the div
        offset: offset
    })
}

function scroll2(n, offset, func1, func2) {
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            direction == 'down' ? updateTypoeOfExploit(func1, true) : updateSourceToTarget(func2, true);
        },
        // start 75% from the top of the div
        offset: offset
    })
}

function scroll3(n, offset, func1, func2) {
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            direction == 'down' ? updateTypoeOfExploit(func1) : updateTypoeOfExploit(func2);
        },
        // start 75% from the top of the div
        offset: offset
    })
}
// set the dimensions and margins of the graph
width = getDivWidth('visualization') - 30;
height = 700;
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

    //updateSourceToTarget('2002');
    var offset = '30%';
    var offset2 = '40%';
    fadeIn('story1', offset);
    fadeIn('story2', offset);
    fadeIn('story3', offset);
    fadeIn('story4', offset);

    scroll('content1', offset2, updateSourceToTarget, clearSourceToTarget, ['2002'], []);
    scroll('content2', offset2, updateSourceToTarget, updateSourceToTarget, ['2005'], ['2002']);
    scroll('content3', offset2, updateSourceToTarget, updateSourceToTarget, ['2007'], ['2005']);
    scroll('content4', offset2, updateSourceToTarget, updateSourceToTarget, ['2002'], ['2007']);
    scroll('content5', offset2, updateTypoeOfExploit, updateSourceToTarget, ['2009', true], ['2002', true]);
    scroll('content6', offset2, updateTypoeOfExploit, updateTypoeOfExploit, ['2002'], ['2009']);
});

function getDivWidth(id) {
    return document.getElementById(id).offsetWidth;
}

function fadeIn(n, offset) {
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            if (direction == 'down') {
                $(this.element).fadeTo(800, 1);
            } else {
                $(this.element).fadeTo(800, 0);
            }
        },
        offset: offset
    })
}
//waypoints scroll constructor

function scroll(n, offset, func1, func2, param1, param2) {
    fadeIn(n, offset);
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            if (param2.length == 0) {
                direction == 'down' ? func1(param1[0], param1[1]) : func2();
            } else if (param1.length == 1) {
                direction == 'down' ? func1(param1[0]) : func2(param2[0]);
            } else {
                direction == 'down' ? func1(param1[0], param1[1]) : func2(param2[0], param2[1]);
            }
        },
        offset: offset
    })
}
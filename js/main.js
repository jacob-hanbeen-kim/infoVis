// set the dimensions and margins of the graph
width = getDivWidth('visualization') - 30;
//height = 700;
// height = getDivWidth('graphic');
// height = height - height * .3;
height = 700;

margin = { top: 20, right: 30, bottom: 20, left: 30 };

// svg
svg = d3.select("svg");

// Load data and use this function to process each row
function mainDataPreprocessor(row) {
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

function mocDataProcessor(row) {
    return {
        exploit_type: row["exploit_type"],
        control_mean: row["control_mean"],
        count: +row['count']
    };
}

// Read the data
Promise.all([
    d3.csv('cleanData.csv', mainDataPreprocessor),
    d3.csv('meansOfControl.csv', mocDataProcessor)
]).then(function (data) {

    humanTraffickingData = data[0];
    meansOfControlData = data[1];

    var offset = '30%';
    var offset2 = '40%';

    fadeIn('story1', offset);
    fadeIn('story2', offset);
    fadeIn('story3', offset);
    fadeIn('story4', offset);
    fadeIn('story5', offset);
    fadeIn('story6', offset);
    fadeIn('story7', offset);

    fadeIn('meansOfControl1', offset);
    fadeIn('meansOfControl2', offset);
    scroll('meansOfControl3', '60%', updateMeansOfControl, clearSourceToTarget, ['sexual_exploitation', true], []);
    fadeIn('meansOfControl4', '60%');
    fadeIn('meansOfControl5', '60%');
    scroll('meansOfControl6', '60%', updateMeansOfControl, updateMeansOfControl, ['labour_exploitation', true], ['sexual_exploitation', true]);
    fadeIn('meansOfControl7', '60%');
    fadeIn('meansOfControl8', '60%');
    scroll('typeOfExploitation1', '60%', clearSourceToTarget, updateMeansOfControl, [], ['labour_exploitation', true]);
    scroll('typeOfExploitation2', offset2, updateTypoeOfExploit2, clearSourceToTarget, [], [], '20%');
    fadeIn('typeOfExploitation3', '20%');
    fadeIn('typeOfExploitation4', '20%');
    fadeIn('typeOfExploitation5', '20%');
    // scroll('typeOfExploitation6', offset2, updateTypoeOfExploit, updateTypoeOfExploit2, ['2016', true], []);
    scroll('sourceToTarget1', '60%', clearSourceToTarget, updateTypoeOfExploit2, [], []);
    fadeIn('sourceToTarget2', '60%');
    //scroll('sourceToTarget3', offset2, updateSourceToTarget, clearSourceToTarget, ['allYears', false, false], []);
    scroll('sourceToTarget3', offset2, loadSrcToDstAll, clearSourceToTarget, [], []);
    scroll('sourceToTarget4', offset2, updateSourceToTarget, loadSrcToDstAll, ['2002', true, true, true], []);
    scroll('sourceToTarget5', offset2, updateSourceToTarget, updateSourceToTarget, ['2016', true, true, true], ['2002', true, true, true], '60%');
    scroll('sourceToTarget6', offset2, updateSourceToTarget, updateSourceToTarget, ['2002', true], ['2016', true, true, true], '60%');

    scroll('final', offset2, clearSourceToTarget, updateSourceToTarget, [], ['2002', true]);
});

function getDivWidth(id) {
    return document.getElementById(id).offsetWidth;
}

function getDivHeight(id) {
    return document.getElementById(id).offsetHeight;
}

function clearSourceToTarget() {
    svg.selectAll('*').remove();
}

// fade in div
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

// waypoints scroll constructor
function scroll(n, offset, func1, func2, param1, param2, offset2 = "") {
    if (offset2 != "") {
        fadeIn(n, offset2);
    } else {
        fadeIn(n, offset);
    }
    return new Waypoint({
        element: document.getElementById(n),
        handler: function (direction) {
            direction == 'down' ? func1(param1[0], param1[1], param1[2], param1[3]) : func2(param2[0], param2[1], param2[2], param2[3]);
            // if (param1.length == 1 && param2.length == 0) {
            //     direction == 'down' ? func1(param1[0]) : func2();
            // } else if (param1.length == 2 && param2.length == 0) {
            //     direction == 'down' ? func1(param1[0], param1[1]) : func2();
            // } else if (param1.length == 1 && param2.length == 1) {
            //     direction == 'down' ? func1(param1[0]) : func2(param2[0]);
            // } else if (param1.length == 1 && param2.length == 2) {
            //     direction == 'down' ? func1(param1[0]) : func2(param2[0], param2[1]);
            // } else if (param1.length == 2 && param2.length == 1) {
            //     direction == 'down' ? func1(param1[0], param1[1]) : func2(param2[0]);
            // } else {
            //     direction == 'down' ? func1(param1[0], param1[1]) : func2(param2[0], param2[1]);
            // }
        },
        offset: offset
    })
}
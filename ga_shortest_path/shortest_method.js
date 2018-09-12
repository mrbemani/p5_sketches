// shortest_method.js


var points_distance_array = [];
var sorted_distances;
var ptslen = 0;
var pts = [];

function calcAllDistances(points_lists) {
    pts = points_lists;
    ptslen = points_lists.length;
    for (var i = 0; i < points_lists.length - 1; ++i) {
        var c1 = points_lists[i];
        for (var j = i + 1; j < points_lists.length; ++j) {
            var c2 = points_lists[j];
            points_distance_array.push([i, j, dist(c1.x, c1.y, c2.x, c2.y)]);
        }
    }
}

function lookUpDist(idx1, idx2) {
    if (idx1 == idx2) return 0;
    if (idx1 > idx2) {
        var t = idx1; 
        idx1 = idx2;
        idx2 = t; 
    }
    var idx = 0;
    for (var i = idx1 - 1; i >= 0; i--) {
        idx += ptslen - (i+1);
    }
    idx += idx2 - idx1 - 1;
    //var d = points_distance_array.find((elem) => (elem[0] == idx1 && elem[1] == idx2) || (elem[1] == idx1 && elem[0] == idx2))[2];
    //console.log(idx1, idx2, d);
    return points_distance_array[idx][2];
}

function handcraft_shortest_path(points) {
    calcAllDistances(points);
    sorted_distances = points_distance_array.slice().sort((a, b) => a[2] - b[2]);
    var ds = sorted_distances.slice();
    var connections = [];
    for (var i = 0; i < ds.length; ++i)
    {
        
        var c1 = ds[i][0];
        var c2 = ds[i][1];
        if (connections.find((el) => (c1 == el[0] || c2 == el[1]) || (c1 == el[1] || c2 == el[0]) ))
        {
            continue;
        }
        connections.push([c1, c2]);
    }
    /*
    var gaps = [];
    for (var i = 0; i < connections.length - 1; ++i)
    {
        var p0 = connections[i][0];
        var p1 = connections[i][1];
        for (var j = i + 1; j < connections.length; ++j)
        {
            var q0 = connections[j][0];
            var q1 = connections[j][1];
            var c1 = [p0, q0];
            var c2 = [p0, q1];
            var c3 = [p1, q0];
            var c4 = [p1, q1];
            
            if (gaps.find((el) => (c1[0] == el[0] && c1[1] == el[1]) || (c1[1] == el[0] && c1[0] == el[1]))) ;
            else gaps.push(c1);
            if (gaps.find((el) => (c2[0] == el[0] && c2[1] == el[1]) || (c2[1] == el[0] && c2[0] == el[1]))) ;
            else gaps.push(c2);
            if (gaps.find((el) => (c3[0] == el[0] && c3[1] == el[1]) || (c3[1] == el[0] && c3[0] == el[1]))) ;
            else gaps.push(c3);
            if (gaps.find((el) => (c4[0] == el[0] && c4[1] == el[1]) || (c4[1] == el[0] && c4[0] == el[1]))) ;
            else gaps.push(c4);
        }
    }
    console.log(gaps);
    var sorted_gaps = gaps.slice().sort((a,b) => lookUpDist(a[0], a[1]) - lookUpDist(b[0], b[1]));
    for (var i = 0; i < sorted_gaps.length; ++i)
    {
        
        var c1 = sorted_gaps[i][0];
        var c2 = sorted_gaps[i][1];
        if (connections.find((el) => (c1 == el[0] && c2 == el[1]) || (c1 == el[1] && c2 == el[0]) ))
        {
            continue;
        }
        connections.push([c1, c2]);
    }
    */
    return connections;
}
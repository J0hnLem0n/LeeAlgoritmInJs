var btnCoord = [];
var map = [
    [1, 1, 0, 1],
    [0, 0, 0, 1],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
];

function searchInArray (arr, val) {
    for (var i=0; i<arr.length; i++)
        if (arr[i].indexOf(val) != -1) {
            return [i,arr[i].indexOf(val)]
        }
    return -1;
}

function clickTd(coord) {
    var count = btnCoord.length;
    if (count <2) {
        btnCoord.push(coord);
        if (count == 0) {
            $('#'+coord).toggleClass("start");
        }
        else {
            $('#'+coord).toggleClass("end");
            if (btnCoord[0] != btnCoord[1]) {
                var coordPath = getPath(btnCoord);
                var coordPathLength = coordPath.length;
                for (var i=0; i<coordPathLength; i++) {
                    $('#'+coordPath[i]).toggleClass("path");
                }
            }
        }
    }
    else {
        $("td").removeClass("path start end")
        btnCoord = [];
    }
}

function getPath(coord) {
    var startP = coord[0].split('_');
    var endP = coord[1].split('_');;
    //var path = map;
    var path = [];
    for( var i=0; i < map.length; i++ ) path[i] =  [].concat(map[i]);
    var pathLength = path.length;
    var wall =-1;
    var clear = -2;
    var nIter = 0;
    var startPoint = 0;
    var endPoint =255;
    var maxIter = endPoint;

    for (var i = 0; i < pathLength; i++) {
        for (var j = 0; j < pathLength; j++) {
            var changeValArr = map[i][j];
            switch (changeValArr) {
                case 1:
                    path[i][j]=wall;
                    break;
                case 0:
                    path[i][j]=clear;
                    break;
                default :
                    path[i][j]=clear;
            }
        }
    }
    path[startP[0]][startP[1]] = startPoint;
    path[endP[0]][endP[1]] = endPoint;

    while (nIter < maxIter) {
        for (var i = 0; i < pathLength; i++) {
            for (var j = 0; j < path[i].length; j++) {
                if (path[i][j] == nIter) {
                    if (path[i][j + 1] == clear) {
                        path[i][j + 1] = nIter + 1;
                    }
                    if (j > 0) {
                        if (path[i][j - 1] == clear) {
                            path[i][j - 1] = nIter + 1;
                        }
                    }
                    if (i < pathLength-1) {
                        if (path[i + 1][j] == clear) {
                            path[i + 1][j] = nIter + 1;
                        }
                    }
                    if (i > 0) {
                        if (path[i - 1][j] == clear) {
                            path[i - 1][j] = nIter + 1;
                        }
                    }
                }
            }

        }
        nIter++;
    }
    var endPointCoord = searchInArray(path, endPoint);
    ////обратный цикл
    var min = maxIter;
    var x = endPointCoord[0];
    var y = endPointCoord[1];
    var xStart = 0;
    var yStart = 0;
    var finishPath = [];

    while (1) {
        if (x < path.length - 1) {
            if (path[x + 1][y] < min && path[x + 1][y] > wall) {
                min = path[x + 1][y];
                xStart = x + 1;
                yStart = y;
            }
        }
        if (x > 0) {
            if (path[x - 1][y] < min && path[x-1][y] > wall) {
                min = path[x - 1][y];
                xStart = x - 1;
                yStart = y;
            }
        }
        if (y < path.length - 1) {
            if (path[x][y + 1] < min && path[x][y + 1] > wall) {
                min = path[x][y + 1];
                xStart = x;
                yStart = y + 1;
            }
        }
        if (y > 0) {
            if (path[x][y - 1] < min && path[x][y - 1] > wall) {
                min = path[x][y - 1];
                xStart = x;
                yStart = y - 1;
            }
        }
        x = xStart;
        y = yStart;
        if (path[x][y] == 0) {
            break;
        }
        path[x][y] = maxIter+1;
        finishPath.push(x+'_'+y);
    }
    return finishPath;
}

function generateMap() {
    var table = "<table>"
    for (var n=0; n< map.length; n++) {
        table += '<tr>'
        for (var m=0; m<map[n].length; m++){
            if (map[n][m] !=1) {
                table += '<td class="road" id="'+n+'_'+m+'" onclick="clickTd(this.id)"></td>';
            }
            else {
                table += '<td class="wall" id="'+n+'_'+m+'"></td>';
            }
        }
        table += '</tr>'
    }
    table += "</table>"
    $('#gamedesk').append(table);
}

$(function() {
    generateMap();
});

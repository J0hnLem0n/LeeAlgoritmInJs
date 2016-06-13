var btnCoord = [];
var busCoord = [];

var map = [
    [1,1,1,1,0,0,0,0,1,0,1,1,1,1,0],
    [1,1,0,0,0,0,0,0,0,0,1,1,1,1,0],
    [1,1,1,1,0,0,1,0,1,0,1,1,1,1,0],
    [1,1,0,0,0,1,0,0,1,0,1,1,1,1,0],
    [1,1,1,1,0,0,1,0,1,0,1,1,1,1,0],
    [1,1,1,1,0,0,1,0,1,0,1,1,1,1,0],
    [1,1,0,0,0,1,0,1,0,0,1,1,1,1,0],
    [1,1,0,0,0,0,0,0,0,0,1,1,1,1,0],
    [1,1,1,1,0,0,1,0,1,0,1,1,1,1,0],
    [1,1,0,0,0,1,0,0,1,0,1,1,1,1,0],
    [1,1,1,1,0,0,1,0,1,0,1,1,1,1,0]
];

function searchInArray (arr, val) {
    for (var i=0; i<arr.length; i++)
        if (arr[i].indexOf(val) != -1) {
            return [i,arr[i].indexOf(val)]
        }
    return -1;
}

function moveTo(element, target) {
    var targetOffset = target.offset();
    element.animate({
        top: targetOffset.top,
    left: targetOffset.left
}, 400);
}
//$('button').click(function(){
//    moveTo($('.start'), $('#target'));
//});


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
                coordPath = coordPath.reverse();
                coordPath.unshift(btnCoord[0]);
                coordPath.push(btnCoord[1]);

                busCoord = coordPath;
                var coordPathLength = coordPath.length;
                for (var i=0; i<coordPathLength; i++) {
//                    $('#'+coordPath[i]).toggleClass("path");
                    var arrCoordElement = coordPath[i].split('_');
                    if (i < coordPath.length-1) {
                        var arrCoordNextElement = coordPath[i + 1].split('_');
                    };

                    var curElementX = arrCoordElement[0];
                    var curElementY = arrCoordElement[1];
                    var nextElementX = arrCoordNextElement[0];
                    var nextElementY = arrCoordNextElement[1];
                    var iconPath = '';

                    if (nextElementX > curElementX) {
                        iconPath = '<i class="fa fa-arrow-down"></i>';
                    } else
                    if (nextElementX < curElementX) {
                        iconPath = '<i class="fa fa-arrow-up"></i>';
                    } else
                    if (nextElementY < curElementY) {
                        iconPath = '<i class="fa fa-arrow-left"></i>';
                    } else
                    if (nextElementY > curElementY) {
                        iconPath = '<i class="fa fa-arrow-right"></i>';
                    }
                    if (i!=0) {
                        $('#' + coordPath[i]).append(iconPath);
                    }
                }
            }
        }
    }
    else {
        $('#gamedesk').append('<div id="auto"><i class="fa fa-bus"></i></div>');
        var targetOffset = $('#'+busCoord[0]).offset();
        console.log(targetOffset.top);
        $('#auto').offset({'top':top = targetOffset.top, 'left':targetOffset.left});
        $('#auto').show();
        for (var i= 1; i< busCoord.length; i++) {
            moveTo($('#auto'), $('#' + busCoord[i]));
        }
        $("td").removeClass("path start end");
        $("i").removeClass("fa-arrow-right fa-arrow-down fa-arrow-up fa-arrow-left");
        btnCoord = [];
    }
}

function getPath(coord) {
    var startP = coord[0].split('_');
    var endP = coord[1].split('_');;
    var path = [];
    for(var i=0; i < map.length; i++ ) {
        path[i] = [].concat(map[i]);
    }
    var pathLengthX = path.length;
    var pathLengthY = path[0].length;
    var wall =-1;
    var clear = -2;
    var nIter = 0;
    var startPoint = 0;
    var endPoint =255;
    var maxIter = endPoint;

    for (var i = 0; i < pathLengthX; i++) {
        for (var j = 0; j < pathLengthY; j++) {
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
        //console.log(nIter+'<'+maxIter);
        for (var i = 0; i < pathLengthX; i++) {
            for (var j = 0; j < path[i].length; j++) {
                if (path[i][j] == nIter) {
                    if (path[i][j + 1] == clear) {
                        path[i][j + 1] = nIter + 1;
                    }
                    if (j > 0) {
                        if (path[i][j - 1] == clear) {
                            path[i][j - 1] = nIter + 2;
                        }
                    }
                    if (i < pathLengthX-1) {
                        if (path[i + 1][j] == clear) {
                            path[i + 1][j] = nIter + 1;
                        }
                    }
                    if (i > 0) {
                        if (path[i - 1][j] == clear) {
                            path[i - 1][j] = nIter + 1
                        }
                    }
                }
            }

        }
        nIter++;
    }

    var endPointCoord = searchInArray(path, endPoint);
    //обратный цикл
    var min = maxIter;
    var x = endPointCoord[0];
    var y = endPointCoord[1];
    var xStart = 0;
    var yStart = 0;
    var finishPath = [];

    var break_ = 0;
    var error = '';
    while (1) {
        break_++;
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
        if (y < pathLengthY -1) {
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
        if (break_ == 2000) {
            error = 'Не возможно найти путь';
            break;
        }
    }
    if (error != '') {
        alert(error);
        throw "stop";
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

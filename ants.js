// This is an implementation of Multiple Langton's Ants.
// Run this file as follows:
// $ node <thisFile> <numberOfSteps> <jsonInitFile>

// If the <numberOfSteps> is negative,
// verbose mode is enabled.
if (Number.isInteger((process.argv[2]*1))) {
    if ((process.argv[2]*1) < 0) {
        var verboseMode = true;
        var totSteps = -(process.argv[2]*1);
    } else {
        var verboseMode = false;
        var totSteps = (process.argv[2]*1);
    }
} else {
    console.log('The total number of steps must be a nonzero integer.');
    console.log('Setting it to 1.');
    var verboseMode = false;
    var totSteps = 1;
};
if (totSteps === 0) {
    console.log('The total number of steps must not be zero.');
    console.log('Setting it to 1.');
    var totSteps = 1;
}

// the initial state is needed NOW,
// so the file is read synchronously
// (this might need improvement):
const fs = require('fs');
try{
    var currState = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
}catch (e) {
    console.log(e.stack);
};

// list of all black points (is always finite)
// (possible improvement: work without this redundant
// storage of black points in addition to playingfield)
var blackPoints = [];
for (let y = 0; y < currState.playingfield.length; y++){
    for (let x = 0; x < currState.playingfield[y].length; x++){
        if(currState.playingfield[y][x] === 1){
            blackPoints.push('['+x+','+y+']');
        };
    };
};

// The actual moves of the gameset:
// In order to account for the mutual independence
// of the ants, all ants are moved first,
// and the color flips are carried out afterwards.
// Using a Set(!) of strings(!) to prevent double
// entries of the same point.
var pointsToFlip = new Set();
for (var i = 1; i <= totSteps; i++){
    pointsToFlip.clear();
    for (var antNr = 0; antNr < currState.ants.length; antNr++) {
        var antX = currState.ants[antNr].x;
        var antY = currState.ants[antNr].y;
        pointsToFlip.add('['+antX+','+antY+']');
        var antO = currState.ants[antNr].orientation;
        // the ant might be outside the cropped playing field;
        // then currState.playingfield[antY] is undefined
        var antC = 0;// default color: white
        if(antX >= 0){
            if(antY >= 0){
                if(antY < currState.playingfield.length){
                    if(antX < currState.playingfield[antY].length){
                        var antC = currState.playingfield[antY][antX];
                    };
                };
            };
        };
        // turning the ant
        if(antC){
            antO = (antO + 1) % 4;
        }else{
            antO = (antO + 3) % 4;
        };
        // moving the ant
        switch (antO) {
            case 0:// north
                antY--;
                break;
            case 1:// east
                antX++;
                break;
            case 2:// south
                antY++;
                break;
            case 3:// west
                antX--;
                break;
        };
        currState.ants[antNr].x = antX;
        currState.ants[antNr].y = antY;
        currState.ants[antNr].orientation = antO;
    };
    // updating blackPoints
    pointsToFlip.forEach(function(pnt){
        var pntIndex = blackPoints.indexOf(pnt);
        if(pntIndex < 0){
            blackPoints.push(pnt);
        }else{
            blackPoints.splice(pntIndex,1);
        };
    });
    // determining x_min, x_max, y_min, y_max
    // of all black points
    var xMin = JSON.parse(blackPoints[0])[0];
    var xMax = xMin;
    var yMin = JSON.parse(blackPoints[0])[1];
    var yMax = yMin;
    blackPoints.forEach(function(pnt){
        var tuple = JSON.parse(pnt);
        if(tuple[0] < xMin){xMin = tuple[0]};
        if(tuple[0] > xMax){xMax = tuple[0]};
        if(tuple[1] < yMin){yMin = tuple[1]};
        if(tuple[1] > yMax){yMax = tuple[1]};
    });
    // shifting the origin of the coordinate system
    // possible improvement: execute this only if necessary
    for (let n = 0; n < blackPoints.length; n++){
        var tuple = JSON.parse(blackPoints[n]);
        var x = tuple[0] - xMin;
        var y = tuple[1] - yMin;
        blackPoints[n] = '['+x+','+y+']';
    };
    for (var antNr = 0; antNr < currState.ants.length; antNr++) {
        var antX = currState.ants[antNr].x - xMin;
        var antY = currState.ants[antNr].y - yMin;
        currState.ants[antNr].x = antX;
        currState.ants[antNr].y = antY;
    };
    // updating the playing field
    currState.playingfield = [];
    for (let i = 0; i < yMax - yMin + 1; i++){
        var fieldRow = [];
        for (let j = 0; j < xMax - xMin + 1; j++){
            fieldRow.push(0);
        };
        currState.playingfield.push(fieldRow);
    };
    for (let n = 0; n < blackPoints.length; n++){
        var tuple = JSON.parse(blackPoints[n]);
        var x = tuple[0];
        var y = tuple[1];
        currState.playingfield[y][x] = 1;
    };
    if(verboseMode) {
        console.log('\n****************');
        console.log('step',i,'yields');
        console.log('****************');
        console.log(currState);
    };
};

// writing the output file:
// const fs = require('fs');
fs.writeFile('./finalstate.json', JSON.stringify(currState), function (err){
    if(err) {
        return console.log(err);
    }
});

// end of file
var cols = 5;
var rows = 5;
var grid = new Array(cols);
var openSet = [];
var newopenSet = [];
var closedSet = [];
var start;
var end;
var w,h;
var path = [];
var nosolution = false;
var time = 0;
var startpoint=0;
var endpoint=0;
var startpoint1=0;
var endpoint1=0;
var s=null;
var e=null;
var s1=null;
var e1=null;
var startInterval;

function opencanvas(){
    
    // var startp = 0;
    // var endp = 0;
    // var startp1 = 9;
    // var endp1 = 9;
    
    var value = getval();
    console.log(value)
    var value1 = getnextval();
    console.log(value1);

    s = parseInt(value[0]);
    e = parseInt(value[1]);
    s1 = parseInt(value1[0]);
    e1 = parseInt(value1[1]);
    setup();
    // setInterval(() => {
    //     draw();
    // }, 1000);
    startInterval = setInterval(draw,100)
  
    // setup(startp,endp,startp1,endp1);
    // draw(startp,endp,closedSet);
}

function getval() {
    d = document.getElementById("start").value;
    var value = d.split(',');
    return value;
}

function getnextval() {
    d = document.getElementById("end").value;
    var value1 = d.split(',');
    return value1;
}

function removeFromArray(arr,elt){
    // console.log('the remove value start',arr)
     for(var i = arr.length-1; i >= 0; i--){
         if(arr[i] == elt){
             arr.splice(i,1);
         }
     }
 }
 
 function heuristic(a,b){
     var d = dist(a.i,a.j,b.i,b.j); //Euclidean distance
     //var d = sqrt ( (a.i - b.i)*2 + (a.j - b.j)*2);
     return d;
 
 }

function Spot(i,j){
    this.i = i;
    this.j = j;
    //every spot have that value f,g,h;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;  
    this.wall = false;

    if(random(1) < 0.4){
        this.wall = true;
    }
    
    this.show = function(color){
        fill(color);
        if(this.wall){
            fill(30,30,30);
            noStroke();
            //ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2 -1, h / 2 -1);
            rect(this.i * w, this.j * h, w - 1, h - 1);
        }
       
       rect(this.i * w, this.j * h, w - 1, h - 1);
    }

    this.addNeighbors = function(grid){
        var i = this.i;
        var j = this.j;
        if(i < cols-1){
            this.neighbors.push(grid[i+1][j]);
        }
        if(i > 0){
            this.neighbors.push(grid[i-1][j]);
        }
        if(j < rows-1)
        {
            this.neighbors.push(grid[i][j+1]);
        }

        //add diagonal 
        if(j > 0)
        {
            this.neighbors.push(grid[i][j-1]);
        }
        if(i > 0 && j > 0){
            this.neighbors.push(grid[i-1][j-1]); //up to top left
        }
        if(i < cols-1 && j > 0){
            this.neighbors.push(grid[i+1][j-1]); //to the right and up
        }
        if(i > 0 && j < rows-1){
            this.neighbors.push(grid[i-1][j+1]); //left and down
        }
        if(i < cols-1 && j < rows -1){
            this.neighbors.push(grid[i+1][j+1]); //rightn and down
        }
    }
}


function setup(){
    createCanvas(500,400);

    w = width / cols;
    h = height / rows;

    for(var i=0;i<cols;i++){
        grid[i] = new Array(rows);
    }

    for(var i=0;i<cols;i++){
        for(var j=0;j<rows;j++){
            grid[i][j] = new Spot(i,j);
        }
    }

    for(var i=0;i<cols;i++){
        for(var j=0;j<rows;j++){
            grid[i][j].addNeighbors(grid);
        }
    }
    if(s!==null){
        start = grid[s][e];
        end = grid[s1][e1];
        start.wall = false;
        end.wall = false;
    
        openSet.push(start);
    }
 
   
}

function draw(){

    if(openSet.length > 0){
        console.log(openSet);
        var winner = 0;
        for(var i = 0; i<openSet.length; i++){
            if(openSet[i].f < openSet[winner].f){
                winner = i;
            }
        }

        current = openSet[winner];
        if(current === end){
            noLoop();
            clearInterval(startInterval);
            console.log('find the shorttest path successfully')
            document.getElementById('info').textContent = "Find the shortest path success"
        }

        removeFromArray(openSet,current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        //console.log('vv',neighbors);
        for(var i = 0; i < neighbors.length; i++){
            var neighbor = neighbors[i];
           

            if(!closedSet.includes(neighbor) && !neighbor.wall){
                var tempG = current.g + 1;
                var newPath = false;
               if(openSet.includes(neighbor)){
                    if(tempG < neighbor.g){
                        neighbor.g = tempG;
                        newPath = true;
                    }
               }else{
                   neighbor.g = tempG;
                   newPath = true;
                   openSet.push(neighbor);
               }

               if(newPath){
                neighbor.h = heuristic(neighbor,end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
               // console.log(current);
               }
            }
        }

    }else{
        console.log('no solution')
        document.getElementById('info').textContent = "Can't find the shortest path"
        noLoop();
        return;
    }
    background(0);

      for(var i=0;i<cols;i++){
            for(var j=0;j<rows;j++){
                grid[i][j].show(color(111));
            }
        }

        for(var i =0;i<closedSet.length;i++){
            closedSet[i].show(color(200,0,0));
        }

        for(var i =0;i<openSet.length;i++){
            openSet[i].show(color(0,200,0));
        }

     //find the path
    
        path = [];
        var temp = current;
        path.push(temp);
        while(temp.previous){
            path.push(temp.previous);
            temp = temp.previous;
        }
     

        for(var i =0;i<path.length;i++){
            //path[i].show(color(0,0,255));
        }


        noFill();
        stroke(255,255,255);
        strokeWeight(w/20)
        beginShape();
        for(var i=0; i< path.length ; i++){
            vertex(path[i].i * w + w/2,path[i].j * h + h/2);
        }
        endShape();

}
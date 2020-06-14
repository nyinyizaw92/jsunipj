function removeFromArray(arr,elt){
    //console.log('the remove value start',arr.length-1)
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

var cols = 15;
var rows = 15;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w,h;
var path = [];
var nosolution = false;
//var wall = [];


function Spot(i,j){
    this.i = i;
    this.j = j;
    //every spot have that value f,g,h;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.wall = false;
    this.neighbors = [];
    this.previous = undefined; 
    
    if(random(1) < 0.4){
        this.wall = true;
    }
    
    if(j==0){
       this.wall = true;
    }

   if(j==1 && i !== 3 && i!==4 && i!==5 && i!==6){
       this.wall = true;
   }

   if(j ==2 && i!==2 && i!==3  && i!==7 && i!==8  && i!==9  && i!==10){
       this.wall= true;
   }

   if(j==3 && i!==0 && i!== 3 && i!==1 && i!==11){
       this.wall =true; //&& i!==10 && i!==2 
   }

   if(j==4 && i!==3 && i!== 7 && i!==11){
    this.wall =true;     //i!==2 
    } 

    if(j==5 && i!==3 && i!== 7 && i!==11){
        this.wall =true;    
    }

    if(j==6 && i!==5 && i!==6 && i!==7 && i!==8 && i!==10 && i!==11){
        this.wall =true; //&& i!==3 && i!==4 
    } 

    if(j==7 && i!==4 && i!==5 && i!==8 && i!==9 && i!==10 && i!==11 && i!==12 ){
        this.wall =true;
    } 

    if(j==8 && i!==4 && i!==5 && i!==8 && i!==11 && i!==12 ){
        this.wall =true;
    } 
    
    if(j==9  && i!==5 && i!==7 && i!==8 && i!==12 ){
        this.wall =true;
    } 

    if(j==10  && i!==5 && i!==6 && i!==7 && i!==12 ){
        this.wall =true;
    } 

    if(j==11 && i!==6 && i!==7 && i!==12 ){
        this.wall =true;
    } 

    if(j==12 && i!==6 && i!==7 && i!==12 && i!==13 ){
        this.wall =true;
    } 

    if(j==13 && i!==6 && i!==13 ){
        this.wall =true;
    } 

    if(j==14){
        this.wall = true;
    }
    this.show = function(color){
        fill(color);
        if(this.wall){
            fill(25,25,30);
        }
        noStroke();
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
    createCanvas(800,500);
    console.log('a star');

    w = width / cols;
    h = height / rows;
    //making a 2D array
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

    start = grid[0][0];
    end = grid[rows-1][cols-1];
    start.wall = false;
    end.wall = false;


    openSet.push(start);
  
    //console.log('define open set',openSet);

   // console.log('one col has 5 row with f,g and h value',grid);
}

function draw(){
    if(openSet.length > 0){
        //console.log('we can keep going');
        var winner = 0;
        for(var i = 0; i<openSet.length; i++){
            if(openSet[i].f < openSet[winner].f){
                winner = i;
            }
        }

        current = openSet[winner];
        // console.log('cureent openset is',current);
        if(current === end){
            noLoop();
            console.log('done');
        }

        // console.log('the openset value is',openSet); first i,j,f,g,h =0
        // console.log('the current value',current);first i,j,f,g,h =0
        //else if not equal end add current to closeset and remove openset and angain loop openset
        removeFromArray(openSet,current);
        closedSet.push(current);

        var neighbors = current.neighbors;
       //console.log('vv',neighbors);
        for(var i = 0; i < neighbors.length; i++){
            var neighbor = neighbors[i];
           // console.log('ss',neighbor)

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
               }
            }
        }

    }else{
        console.log('no solution');
        //nosolution = true;
        noLoop();
        return;
    }
    background(0);

    for(var i=0;i<cols;i++){
        for(var j=0;j<rows;j++){
            grid[i][j].show(color(255));
        }
    }

    for(var i =0;i<closedSet.length;i++){
        closedSet[i].show(color(255));
    }

  

    for(var i =0;i<openSet.length;i++){
        openSet[i].show(color(255));
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
    stroke(0,0,255);
    strokeWeight(w/30)
    beginShape();
    for(var i=0; i< path.length ; i++){
        vertex(path[i].i * w + w/2,path[i].j * h + h/2);
    }
    endShape();
    
}
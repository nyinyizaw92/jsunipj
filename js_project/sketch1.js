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

function opencanvas(){
    var startp = 0;
    var endp = 0;
    var startp1 = 9;
    var endp1 = 9;
    
    var value = getval();
    var value1 = getnextval();

    startp = parseInt(value[0]);
    endp = parseInt(value[1]);
    startp1 = parseInt(value1[0]);
    endp1 = parseInt(value1[1]);

    setup(startp,endp,startp1,endp1);
    draw(startp,endp,closedSet);
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
var startpoint,endpoint;
var startpoint1,endpoint1;

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


function setup(startp,endp,startp1,endp1){
    createCanvas(500,400);
    console.log('star program');
    w = width / cols;
    h = height / rows;
 

    if(startp !== undefined){

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
        startpoint = startp;
        endpoint = endp;
        startpointt1 = startp1;
        endpoint1 = endp1;

        start = grid[startpoint][endpoint];
        end = grid[startpointt1][endpoint1];

        console.log(start);
        start.wall = false;
        end.wall = false;
    
        newopenSet.push(start);
    }else{

       
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
    
        startpoint =0 ;
        endpoint = 0;
        startpointt1 = cols-1;
        endpoint1 = rows-1;    

        start = grid[startpoint][endpoint];
        end = grid[startpointt1][endpoint1];
        start.wall = false;
        end.wall = false;
    
      openSet.push(start);
    }
       
    
   

  
    //console.log('define open set',openSet);

   // console.log('one col has 5 row with f,g and h value',grid);
}





function draw(startp,endp){
    if(startp == undefined){
       // console.log(openSet);   
        if(openSet.length > 0){
            time ++;
            //console.log('we can keep going');
            var winner = 0;
            for(var i = 0; i<openSet.length; i++){
                if(openSet[i].f < openSet[winner].f){
                    winner = i;
                }
            }
    
            current = openSet[winner];
            if(current === end){
                noLoop();
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
            document.getElementById('info').textContent = "Can't find the shortest path"
            noLoop();
            return;
        }


                
        background(222);

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
    }else{
        function draw(){
            var newclosedSet = [];
            if(newopenSet.length > 0){
                time ++;
                //console.log('we can keep going');
                var winner = 0;
                for(var i = 0; i<newopenSet.length; i++){
                    if(newopenSet[i].f < newopenSet[winner].f){
                        winner = i;
                    }
                }
    
                currentone = newopenSet[winner];
                if(currentone === end){
                    noLoop();
                    document.getElementById('info').textContent = "Find the shortest path success"
                }
        
    
                removeFromArray(newopenSet,currentone);
                console.log('current',currentone);
                newclosedSet.push(currentone);
                console.log('new',newclosedSet);
                var neighbors = currentone.neighbors;
               console.log('vv',neighbors.length);
                for(var i = 0; i < neighbors.length; i++){
                    var neighbor = neighbors[i];
                   console.log('ss',neighbor)
        
                    if(!newclosedSet.includes(neighbor) && !neighbor.wall){
                       
                        var tempG = currentone.g + 1;
                        var newPath = false;
                        if(newopenSet.includes(neighbor)){
                                if(tempG < neighbor.g){
                                    neighbor.g = tempG;
                                    newPath = true;
                                }
                        }else{
                            neighbor.g = tempG;
                            newPath = true;
                            newopenSet.push(neighbor);
                        }
        
                       if(newPath){
                        neighbor.h = heuristic(neighbor,end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = currentone;
                       }
                    }
                }
        
            }else{
                document.getElementById('info').textContent = "Can't find the shortest path"
                //console.log('no solution');
                //console.log('time is',time/40);
                //nosolution = true;
                noLoop();
                return;
            }
    
                
            background(222);
    
            for(var i=0;i<cols;i++){
                for(var j=0;j<rows;j++){
                    grid[i][j].show(color(111));
                }
            }
    
            for(var i =0;i<newclosedSet.length;i++){
                newclosedSet[i].show(color(200,0,0));
            }
    
            for(var i =0;i<newopenSet.length;i++){
                newopenSet[i].show(color(0,0,255));
            }
    
         //find the path
        
                path = [];
                var temp = currentone;
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
    }
}
function restart(){
 //settings
  frameRate(10000)
  
  bestColor = color(0,0,0)
  anaX = 30;
  anaY = 0
  anaWidth = roomWidth-60
  anaHeight = 300
  startX = roomWidth/2;
  startY = roomHeight/2;
  snakeWidth = 10
  speed = 500
  
  //creates
      generation = 0;


  
  died = false;
  setDelay = 25/speed
  delay = 0
  x = startX;
  y = startY;
  
  snakeLength = 0;
  //create_snake() 
	
}

function setup() {
  //settings
    w = 80;
    h = 20;
    
  
  roomWidth = 400;
  roomHeight = 400;
  snakes = []
    anaData = []
    anaC = []
  set_ana(roomWidth-60)
  
  restart()
  set_genetic()
  regenerate()
    
  createCanvas(roomWidth+100,roomHeight+500);

}
function point_distance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function set_genetic(){

  //anaData = [];
  selecting = 0;
  bestArray = [];
  drawData = false;
  drawAna = false;
  drawAll = false;
  drawBestOnly = true
  drawBestBrain = false
  set_life = 300
  set_length = 7
  bestPercent = 0.1//bigger = more snake survive
  maxGeneration = 50
  neurons = [];
  //startNeurons = 4;
  copyBestChance = 0.05//the % that the died snake will become best snake
  crossoverBestChance = 0.1//the percent that will cross with best
  crossOverChance = 0.2
  mutationChance = 0.5
  mutationRate = 0.5
  randomizeChance = 0.1
  bestSnake = undefined;
  for(let i = 0 ; i < maxGeneration ; i++){
      
    snakes.push(new Snake(roomWidth/2,roomHeight/2,0))
    spawn_food(snakes[snakes.length-1]);
  }
}
function create_neuron(weight){
  neurons.push(new neuron(0,weight))
}
function point_direction(x1,y1,x2,y2){
	let w = x2-x1;
	let h = y2-y1;
	let fr=Math.PI/180;
	return Math.atan2(h,w)/fr
}
function select_best(amount){
    if(amount==undefined){amount = 1}
    let bestFitness=[]
    let best = []
    for(let i = 0 ; i < amount ; i++){
    	bestFitness.push(-899998989   )
        best.push(undefined)
    }
    
    
        
      for(let s of snakes){
       	let f = s.get_fitness()
        for(let i = 0 ; i < bestFitness.length ; i++){
			if(f>bestFitness[i]){
             	if(i==0){
					bestFitness[i]=f
                    best[i] = s;
                }else{
                 	bestFitness[i-1]=bestFitness[i]
                    best[i-1]=best[i];
                    bestFitness[i]=f
                    best[i] = s;
                    //console.log(best)
                }
            }
        }
      }
    if(best.length==1){
		return best[0]
    }else{
     	return best
    }
    
}

function irandom(variable){
	if (arguments.length == 1){
		return round(random(variable))
	}else{
		return round(random(variable,arguments[1]))
	}
	
}
function push_ana(v){
 	for(let i = 0 ; i < anaData.length ;i++){
     	if(i!=anaData.length-1){
        	anaData[i] = anaData[i+1]  
        }else{
         	anaData[i] = v   
        }
    }
}
function push_anaC(v){
 	for(let i = 0 ; i < anaC.length ;i++){
     	if(i!=anaC.length-1){
        	anaC[i] = anaC[i+1]  
        }else{
         	anaC[i] = v   
        }
    }
}
function regenerate(){
  //push_ana(select_best().get_fitnesss())
   //console.log(anaData)
  generation++
    bestSnake = select_best()
    push_ana(bestSnake.get_fitness())
    push_anaC(bestSnake.color)
    bestArray = select_best(bestPercent*maxGeneration)
    let bl = bestArray.length//best length == bl
    bestSnake.isBest = true;
    //let died = 0;
    //let crossed  = 0;
    for(let i = 0 ; i < snakes.length ; i++){
        
        let r = irandom(bl-1)
        let allow = true//allow to crossover
        let aN = 0
        //console.log("s",bestArray.length)
        if(bestArray.length>1){
            for(let s of bestArray){
		//console.log(.brain)
                if(s.get_neurons()==snakes[i].get_neurons()){
                    allow = false  
                	

                    //console.log("s")
                }
            }
        
        //console.log("aN: "+aN)
        //console.log(allow)
        if(bestArray[r]!=undefined && allow){
            //console.log("s")
            if(snakes[i]!=bestSnake){
                if(random(1)<copyBestChance){
                    //console.log("copying best")
                    snakes[i].brain.neurons = bestSnake.clone_neurons()
                }else{
                    snakes[i].brain.neurons = bestArray[r].clone_neurons()

                }
            }
                //console.log("died sad")
            //died++
            
        }else{
            
        }
        
    
        if(bestSnake.get_neurons()==snakes[i].get_neurons()){
         	snakes[i].isBest = true;   
            bestColor = snakes[i].color
            console.log(bestSnake.survived)
            
            //console.log("isbest")
        }else{
            
            snakes[i].isBest = false;
            //console.log("m")
            let nr = irandom(bl-1)
            
            if(random(1)<crossOverChance){
                
                //crossed++
            let br = random(1)
                if(br<crossoverBestChance){
                    snakes[i].brain.crossover(bestSnake)
                	
                }else{
             
             		snakes[i].brain.crossover(bestArray[nr])  
                }
            }
            if(random(1)<mutationChance){
                //console.log("mutated")
                snakes[i].brain.mutation()///snakes[i].brain.randomize()   
            	
            }
            if(random(1)<randomizeChance){
                if(snakes[i]!=bestSnake){
                    
                
             	snakes[i].brain.randomize(); 
                }else{
                 	console.log("fuck")   
                }
                //console.log("randomized")
            }
        }
    }
        snakes[i].died = false;
        snakes[i].life = set_life;
        snakes[i].speed = 0;
        snakes[i].direction = 90
        snakes[i].previous_direction = snakes[i].direction
        snakes[i].thinking = false;
        snakes[i].highlight = false
        snakes[i].survived = 0;
        snakes[i].snakeArray = []
        add_length(snakes[i],set_length)
        snakes[i].snakeArray[0][0] = startX
        snakes[i].snakeArray[0][1] = startY
        let nL = snakes[i].brain.neurons[0].length;
        //console.log(i)
        
        for(let aa = 0 ; aa < nL ; aa++){
        	//snakes[i].brain.neurons[0][aa].value = undefined
        }
        
        	spawn_food(snakes[i])
        
        snakes[i].do_output()
    }
    //console.log(crossed)
  
}
function crossover_array(ParentOne, ParentTwo){
 	var
    parents = [ParentOne.slice(), ParentTwo.slice()],
    output = []; //output.length = ParentOne.length;
	for(let i = 0 ; i < ParentOne.length ; i++){
     	output.push(undefined)   
    }
    for (var i = 0; i < output.length; i++) {
        let r = Math.round(Math.random())
        let p = parents[r][i]
        output[i] = new Neuron(1)
        output[i].clone_from(JSON.parse(JSON.stringify(p)))
		
        //console.log("asd",output[i])
    } 
    return output;
}
function set_ana(v){
	for(let i = 0 ; i < v ; i++){
     	anaData.push([]);   
        anaC.push(color(0,0,0))
    }
}

function add_length(snake,v){
  for(let i = 0 ; i < v ; i++){
    
    snake.snakeArray.push([snake.x,snake.y]) 
      //console.log("snakeX",snake.x)
    snake.snakeLength++
    
  }
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
function lengthdir_x(dir,l){
	let r = dir*Math.PI/180
	return (Math.cos(r)*l);
}
function lengthdir_y(dir,l){
	let r = dir*Math.PI/180
	return (Math.sin(r)*l);
}
function spawn_food(snake){
  snake.foodX = 200;
    snake.foodY = 300;
  snake.foodX = Math.round(random(roomWidth-2*snakeWidth)/10)*10+snakeWidth
  snake.foodY = Math.round(random(roomHeight-2*snakeWidth)/10)*10+snakeWidth
}
function draw_food(snake){
 	
  rectMode(CENTER)
  let i = snake
      fill(i.color)
  	rect(i.foodX,i.foodY,snakeWidth,snakeWidth)
  
}
function draw_snake(snake){
  strokeWeight(2)
  fill(snake.color)
    let big = false;
    rectMode(CENTER)
  
  
    let snakeArray = snake.snakeArray;
  for(let a of snake.snakeArray){
     
     if(big){
  	rect(a[0],a[1],snakeWidth+5,snakeWidth+5)
     }else{
    rect(a[0],a[1],snakeWidth,snakeWidth)
     }
  }
    
  //text(x,300,200)
}
function die(snake){
  snake.died = true; 
  //restart()
}
function touched_edge(snake){
    let x = snake.x;
    let y = snake.y;
 	return (x>=roomWidth||x<=0||y>=roomHeight||y<=0)
  
  
}
function draw_edge(){
  rectMode(CORNER)
  fill(255,0,0)
  strokeWeight(0)
 	rect(0,0,roomWidth,snakeWidth)
  rect(0,0,snakeWidth,roomHeight)
  rect(0,roomHeight,roomWidth,snakeWidth)
  rect(roomWidth,0,snakeWidth,roomHeight)
       
  rectMode(CENTER)
}
function draw_ana(){
 	let x = anaX
    let y = anaY+anaHeight;
    noFill()
    //beginShape()
    for(let i = 0 ; i < anaData.length ; i++){
		stroke(anaC[i])
        strokeWeight(1)
        if(anaData[i]!=undefined){
            if(anaData[i+1]!=undefined){
                let to = anaData[i+1]
                //curveVertex(x+i,y-anaData[i])
                let rr = 0.1
                line(x+i,y-pow(anaData[i],rr),x+i+1,y-(pow(to,rr)))
            }
        }
        stroke(1)
        
    }
    //endShape()
}
function snake_step(snake){
  let xx = snake.snakeArray[0][0];
  let yy = snake.snakeArray[0][1];
    
    //console.log(xx)
  let snakeArray = snake.snakeArray;
    
  let direction = snake.direction;
  for(let i = snake.snakeArray.length-1 ; i>0 ; i--){
   	snake.snakeArray[i][0] = snake.snakeArray[i-1][0]
    snake.snakeArray[i][1] = snake.snakeArray[i-1][1]
  }
  if(snake.moving == true){
      xx += lengthdir_x(direction,snakeWidth);
      yy += lengthdir_y(direction,snakeWidth);
  }
  //console.log(xx)
  snake.snakeArray[0][0] = xx;
  snake.snakeArray[0][1] = yy;
  let x = snakeArray[0][0]
  let y = snakeArray[0][1]
  for(let i = 1 ; i < snakeArray.length ; i++){
      
   	if(snakeArray[i][0]==x && snakeArray[i][1]==y){
     	if(snake.moving){
            die(snake) 
            i=snakeArray.length;
        }
      //console.log(x)
    }
  }
    
    snakeArray = snake.snakeArray;
  //COLLISION//COLLISION//COLLISION//COLLISION//COLLISION
  
  if(touched_edge(snake)){
   	die(snake) 
      
  }
    
  if(round(x)==snake.foodX&&round(y)==snake.foodY){
   	//touched food
    add_length(snake,1)
    spawn_food(snake)
    snake.life = set_life
     // console.log("ate")
  }else{
    if(snake.foodX==10&&y==60){
   	//console.log(foodX,foodY,x,y) 
    }
  }
  
}
function draw() {
  background(200);

  draw_edge()
  if(drawAna){
    draw_ana()
  }
  if(drawBestBrain){
      if(select_best()!=undefined){
        select_best().brain.draw_brain(180,80)
      }
      if(bestSnake!=undefined){
        bestSnake.brain.draw_brain(160,80)   
      }
  }
  for(let i = 0 ; i < snakes.length ; i++){
  	if(snakes[i]!=undefined){
      snakes[i].brain.update();
    	  //snakes[i].brain.update(150,80+i*110)
  	}
  }
  
  for(let i of snakes){
  	i.update();
      if(i==bestSnake){
          if(drawBestBrain){
    		i.brain.update(150,80);
          }
        //i.brain.draw_brain(150,80)
        
  	}
    if(drawAll){
    	draw_snake(i)
        draw_food(i)
  	}else{
    	if(drawBestOnly){
            draw_snake(bestSnake)
            draw_food(bestSnake)
        }else{
            let drawed = false
            if(bestArray.includes(i)){

                if(!i.died){
                    draw_snake(i)
                    draw_food(i)
                    drawed = true;
                }

                draw_food(i)
            }
            if(!drawed){
                if(!select_best().died){
                    draw_snake(select_best())   
                    draw_food(select_best())
                }
            }
    	}
    }
  }
  draw_snake(bestSnake)
  if(delay<setDelay){
   	delay++ 
	
  }else{
   	delay = 0;
    let totalDied = 0
    for(let i of snakes){
        
        if(!i.died){
                snake_step(i)
            
        }else{
			//died
            totalDied++;
            }
    }
      if(totalDied>=snakes.length){
       	//restart();  
          regenerate();
          //console.log("restarting")
      }
  }
  
  stroke(0)
  strokeWeight(1)
  textSize(30)
  if(drawData){
      text("length: "+bestSnake.snakeArray.length,50,70)
      text("generation: "+generation,200,70)
      textSize(15)
      text("mChance: "+mutationChance,20,100)
      text("mRate: "+mutationRate,20,120)
	  text("cChance: "+crossOverChance,150,100)
      text("cWithBest: "+crossoverBestChance,150,120)
  	  text("rChance: "+randomizeChance,280,100)
  	  text("BestPercent: "+bestPercent*100+"%",280,120)
  	  ellipse(20+(selecting*130)-(selecting>=3)*3*130-5,100+(selecting>=3)*20-3,10)
  }
  fill(bestColor)
  ellipse(200,500,10)
  for(let i of snakes){
    i.direction = toDir(i.direction)
  }
  
}
function toDir(d){
  var dir = d;
  while(dir>=360||dir<0){
    if (dir>=360){
      dir = dir-360
      
    }
    if (dir<0){
      dir = dir+360
    }
  }
  return dir
}
function keyPressed(){
    
    let getBest = key=='g'
    let show_all = key=='s'
    let ana = key=='a'
    let data = key=='d'
 	let up = keyCode===	UP_ARROW 
	let down = keyCode===DOWN_ARROW 
	let right = keyCode===RIGHT_ARROW 
	let left = keyCode===LEFT_ARROW 
    set_selecting = 5
    if((up||down)&&drawData){
        switch(selecting){
            case 0:
                var rate = 0.01
                if(up){
                 	mutationChance+=rate
                }else{
                 	mutationChance-=rate   
                }
                var m = mutationChance
                var i = 100
                mutationChance = round(m*i)/i
                
                break;
            case 1:
                var rate = 0.01
                if(up){
                 	crossOverChance+=rate
                }else{
                 	crossOverChance-=rate   
                }
                var m = crossOverChance
                var i = 100
                crossOverChance = round(m*i)/i
                
                break;
            case 2:
                var rate = 0.01
                if(up){
                 	randomizeChance+=rate
                }else{
                 	randomizeChance-=rate   
                }
                var m = randomizeChance
                var i = 100
                randomizeChance = round(m*i)/i
                
                break;
            
            case 3:
                var rate = 0.01
                if(up){
                 	mutationRate+=rate
                }else{
                 	mutationRate-=rate   
                }
                var m = mutationRate
                var i = 100
                mutationRate = round(m*i)/i
                
                break;
            case 4:
                var rate = 0.01
                if(up){
                 	crossoverBestChance+=rate
                }else{
                 	crossoverBestChance-=rate   
                }
                var m = crossoverBestChance
                var i = 100
                crossoverBestChance = round(m*i)/i
                
                break;
            case 5:
                var rate = 0.01
                if(up){
                 	bestPercent+=rate
                }else{
                 	bestPercent-=rate   
                }
                var m = bestPercent
                var i = 1000
                bestPercent = round(m*i)/i
                
                break;
        }
    }
    if(right){
     	selecting++
        if(selecting>set_selecting){
         	selecting = 0;   
        }
    }else if(left){
        selecting --
     	if(selecting<0){
         	selecting = set_selecting   
        }   
    }
    //console.log(selecting)
  if(getBest){
   	console.log(bestSnake)   
  }
    if(data){
     	drawData = drawData?false:true 
    }
    if(ana){
     	drawAna = drawAna?false:true  
    }
    if(show_all){
     	if(drawAll){
         	drawAll = false;   
        }else{
         	drawAll = true   
        }
    }
  
  
}

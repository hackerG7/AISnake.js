class Snake{
 	constructor(x,y,direction){
   	this.x = x;
    this.y = y;
    this.moving = false
    this.color = color(random(255),random(255),random(255))
    this.foodX = random(roomWidth);
    this.foodY = random(roomHeight);
    this.direction = direction;
    this.snakeArray = [];
    this.snakeLength = 0;
    this.isBest = false;
    this.life = set_life;
        this.highlight = false;
    this.died = false;
        this.thinking = false;
    this.previous_direction = direction
    add_length(this,set_length)
    this.survived = 0
    this.brain = new Brain(24,[1,16],4)
	this.brain.randomize()
			


        
        //console.log(hiddenN.type)
    
    
  }
	clone_neurons(){
		let cloneNeurons = []//this.brain.neurons.slice();
        let b = this.brain
        //console.log(this.neurons)
        for(let i = 0 ; i < b.neurons.length ; i++){
            cloneNeurons.push([])
            for(let j = 0 ; j < b.neurons[i].length ; j++){
                let selfN = b.neurons[i][j];
                let cloneN = new Neuron(i,j);
                cloneN.clone_from(JSON.parse(JSON.stringify(selfN)))
                //console.log(cloneN)
                cloneNeurons[i].push(cloneN)
            }
        }
        return cloneNeurons
	}
    get_neurons(){
        return this.brain.neurons
    }
	update(){
		this.update_input();
		this.do_output();
        if(!this.died){
            if(this.moving){
         		this.life-- 
            }else{
             	this.life -= 10   
            }
            if(this.life<=0){
             	this.died = true;   
            }else{
                if(this.moving){
             		this.survived++ 
                }
            }
        }
        if(this.direction!=this.previous_direction){
         	this.thinking = true;
            //console.log("thinking!")
        }
        this.previous_direction = this.direction

	}
	do_output(){
        let direction = this.direction
		let o = this.brain.get_output();
        let m = false
    	//console.log(o[0])
        for(let i = 0 ; i < o.length ;i++){
         	switch(i){
                case 0:
                    if(o[i]&&this.direction!=180&&!m){
                    	this.direction = 0;
                        //this.highlight = true
                        m=true
                        //console.log("turning right")
                    }
                    break;
                case 1:
                    if(o[i]&&this.direction!=270&&!m){
                    	this.direction = 1*90;
                    	m=true
                    }
                    break;
                case 2:
                    if(o[i]&&this.direction!=0&&!m){
                    	this.direction = 2*90;
                    	m=true
                    }
                    break;
                case 3:
                    if(o[i]&&this.direction!=90&&!m){
                       // console.log(this.direction)
                    	this.direction = 3*90;
                        
                    	m=true
                    }
                    break;
        	}
        }
        if(m){
        	this.moving = true
        }else{
         	if(!this.moving){
                this.moving = true
             	//this.direction = irandom(3)*90 
                //console.log(this.direction)
            }
        }
	}
  get_fitness(){
      let lifetime = this.survived;
      let len = this.snakeArray.length
      let o = floor(lifetime * pow(2, (floor(len))))/500;
   	
      return o
  }
  crossover(snake){
    
   	this.brain.crossover(snake)
    //crossover color
    
  }
  update_input2(){
      this.x = this.snakeArray[0][0]
    this.y = this.snakeArray[0][1]
    this.brain.set_input(0,this.x)
      this.brain.set_input(1,this.y)
      this.brain.set_input(2,this.foodX)
      this.brain.set_input(3,this.foodY)
  }
  update_input(){
    this.x = this.snakeArray[0][0]
    this.y = this.snakeArray[0][1]
    let p = 8
    let cur = 0
    for(let i = 0 ; i < p ; i++){
    //check food
    	
    	let d = i*360/p
        let checkDistance = 500
        let foundFood = false;
        let foundSelf = false;
        let foundWall = false;
        for(let j = 0 ; j < checkDistance ; j++){
         	let cX = round(this.x+lengthdir_x(d,j))
            let cY = round(this.y+lengthdir_y(d,j))
            if(this==bestSnake){
                if(j<100){
                stroke(1)
             	point(cX,cY)  
                stroke(1)
                }
            }
            if(!foundFood){
                if(round(cX)==this.foodX&&round(cY)==this.foodY){
                    this.brain.set_input(cur,point_distance(this.x,this.y,this.foodX,this.foodY))
                	j=checkDistance
                    foundFood = true
                    //console.log("found food "+point_distance(this.x,this.y,this.foodX,this.foodY))
                }else{
                    //this.brain.set_input(i+cur,0)   
                }
                
            }
            if(!foundWall&&j<20){
                if((round(cX)==0)||(round(cX)==roomWidth)||(round(cY)==roomHeight)||(round(cY)==0)){
                this.brain.set_input(1+cur,point_distance(this.x,this.y,round(cX),round(cY)))
                //console.log("i+cur  "+i+cur+"  "+point_distance(this.x,this.y,round(cX),round(cY)))
                foundWall = true;
                    j=checkDistance
            	//console.log("wall: "+point_distance(this.x,this.y,cX,cY))
				
                }else{
                    //this.brain.set_input(1+cur,0) 
                    
                }
                
            }
            if(!foundSelf){
                for(let k = 1 ; k < this.snakeArray.length ; k++){
                    let sX = this.snakeArray[k][0]
                    let sY = this.snakeArray[k][1]
                    if(cX==sX&&cY==sY){
                        k=this.snakeArray.length;
                        this.brain.set_input(2+cur,point_distance(this.x,this.y,sX,sY) )
                    	//console.log("ss"+point_distance(this.x,this.y,sX,sY))
                        foundSelf = true;
                        //j=checkDistance
                    }else{
                        //this.brain.set_input(i+cur,0)   

                    }

                }
                
            }
                                                           
                            
        }
        if(!foundFood){
         	this.brain.set_input(cur+0,0)   
        }
        if(!foundWall){
         	this.brain.set_input(cur+1,0)   
        }
        if(!foundSelf){
         	this.brain.set_input(cur+2,0)   
        }
        
        cur+=3
    }
  }
}

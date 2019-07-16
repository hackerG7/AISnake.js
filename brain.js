class Brain{
 	constructor(inputCounts,hiddenCounts,outputCounts){
    this.neurons = [];
    let maxN = 2+hiddenCounts[0];
    for(let i = 0 ; i < maxN ; i++){
     	this.neurons.push([]) 
    }
    this.maxInput = inputCounts;
    //this.input = [];
    for(let i = 0 ; i < this.maxInput ; i++){
        let n = new Neuron(0,i);
        this.neurons[0].push(n)
     	//this.input.push(new Neuron(0,i)) 

    }
   	this.maxHidden = hiddenCounts;
    //this.hidden = [];
    for(let i = 1 ; i < hiddenCounts[0]+1 ; i++){
    	for(let l = 0 ; l < hiddenCounts[1] ; l++){
         	this.neurons[i].push(new Neuron(i,l))
            
        }
    }
		this.maxOutput = outputCounts;

    
   
    for(let i = 0 ; i < this.maxOutput ; i++){
        let t = hiddenCounts[0]+1;
		let n = new Neuron(t,i)
        
		n.useRelu = true;
     	this.neurons[t].push(n)
    }
    this.get_allNeuron()
    this.initialize()
    //console.log(this.input[0].sigmoid())
  }
  set_input(arrayID,val){
    if(this.neurons[0][arrayID]!=undefined){
    	this.neurons[0][arrayID].set_value(val)
    }
    return this.neurons[0][arrayID].value
  }
  input_connect(Neuron,targetNeuron,weight){
   	 Neuron.connect(targetNeuron,weight)
      //console.log("sdsad")
  }
  get_neuron(raw,col){
   	return this.neurons[raw][col];   
  }
  get_hiddenN(raw,col){
   	return this.neurons[raw+1][col];   
  }
  get_inputN(i){
   	return this.neurons[0][i];   
  }
  get_outputN(i){
   	return this.output[this.neurons.length-1][i];   
  }
  get_output(){
		let a = [];
		for(let i =0 ; i < this.maxOutput ; i++){
			let n = this.neurons[this.neurons.length-1][i];
            //console.log(this.neurons.length-1)
			a.push(n.output())
		}
		return a;
  }
  update(x,y){

   for(let j = 0 ; j < this.neurons.length ; j++){
       for(let k = 0 ; k < this.neurons[j].length ; k++){
		let oN = this.neurons[j][k]//originalNeuron
        if (oN!=undefined){
        	oN.remove_sum();
        }
    }
	
	}
      for(let j = 0 ; j < this.neurons.length ; j++){
       for(let k = 0 ; k < this.neurons[j].length ; k++){
			let oN = this.neurons[j][k]//originalNeuron
            if(oN!=undefined){
                oN.send_value(this.neurons)
                if(x!=undefined&&y!=undefined){
                	oN.update(x,y)
                }
            }//else{console.log("sadsad")}
    	}
	 }
      //this.draw_brain(x,y);
  }
  crossover(snake){
  	let b = snake.brain;
    let otherNeurons = snake.brain.neurons
    let selfNeurons = this.neurons
    if(otherNeurons.length==selfNeurons.length){
        var newNeuron = [];
        var n = 0
        //console.log(newNeuron)
        
        
        for(let i = 0 ; i < selfNeurons.length ; i++){
            newNeuron[i] = [];
         	//for(let j = 0 ; j < selfNeurons[i].length ; j++){
        //console.log(i)
            newNeuron[i].length = selfNeurons[i].length   
            //}
        }
        for(let i = 0 ; i < selfNeurons.length ; i++){
        newNeuron[i] = crossover_array(otherNeurons[i],selfNeurons[i])
        this.neurons[i] = newNeuron[i];
        }
        //if(random(1)<0.1){console.log(newNeurons)}
        //this.brain = snake.brain;
        //console.log(newNeurons.length,this.neurons.length)
        
        //this.neurons = newNeurons;
        //this.initialize();
    }
    
  }
  mutation(){
    	this.get_allNeuron();
		for(let i = 0 ; i < this.allNeuron.length ; i++){
			if(this.allNeuron[i]!=undefined){
            	this.allNeuron[i].mutation()
            }else{
                console.log("cannot mutation, neuron is undefined")
            }
            //console.log(this.allNeuron[i].x)
		}
      
	}
 initialize(){
    let scannedN = []
  	for(let i = 0 ; i < this.neurons.length ; i++){
     	for(let j = 0 ; j < this.neurons[i].length ; j++){
         	if(i!=this.neurons.length){
                //for(let k = 0 ; k < this.neurons[i].length ; k++){
                    let cN = this.get_neuron(i,j)
                    	for(let n of scannedN){
                         	if(n.type<cN.type){
                             	n.connect(cN)   
                                if(random(1)<0.1){
                                 	//console.log(n.type,cN.type)   
                                }//
                            }else{}//console.log("s")}
                        }
                scannedN.push(cN)
                    //console.log(cN)
                    //console.log(this.neurons[i][j])
             		
                    //this.neurons[i][j].connect(cN)   
                    
                
            }
        }
    }
 }
 randomize(){
     this.brain = this;
     
     for(let i = 0 ; i < this.neurons.length ;i++){
         for(let j = 0 ; j < this.neurons[i].length ; j++){
      		let c = this.neurons[i][j].connection;
             
            for(let l = 0 ; l < c.length ; l++){
                //if(random(1)<0.06){
             		this.neurons[i][j].connection[l][1] = (random(2)-1)  
                //}
            }
         }
     }
     


 }
  get_allNeuron(){ 
      this.allNeuron = []
      let current = 0
      for(let i = 0 ; i < this.neurons.length ; i++){
       	for(let j = 0 ; j < this.neurons[i].length ; j++){
         	this.allNeuron.push(this.neurons[i][j])   
        }
      }
      //console.log("get allN",this.allNeuron)

   	return this.allNeuron;   
  }
  draw_brain(x,y){
   	   
      this.get_allNeuron()
          for(let j = 0 ; j < this.allNeuron.length ; j++){
              let oN = this.allNeuron[j]//originalNeuron
              if(oN!=undefined){
              let cArray = this.allNeuron[j].connection;
              stroke(0)
			if(oN.type==2){
             	//console.log(cArray)   = []
            }
               for(let i = 0 ; i < cArray.length ; i++){
                   let n = cArray[i][0] //neuron

                   //text("s"+n.id,200,200)
                   if(cArray[i][1]!=0&&cArray[i][1]!=undefined){
                       textSize(10)
                       if(i==0){
                       	text(round(cArray[i][1]*10)/10,x+(oN.type)*w+20+i*8,y+(oN.id)*h)
                       }
                       line(x+(oN.type)*w,y+(oN.id)*h,x+(n.type)*w,y+n.id*h)
                   }
               }
          }
      }
  }
}

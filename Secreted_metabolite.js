/*-----------------------Start user-defined code ---------------------*/

const fs = require('fs') 

if (typeof window == "undefined") 
    {  
        Simulation = require('C:/cacatoo.js') // Loads the Simulation class for nodejs-mode.     
    }
    //if (typeof window == "undefined") Simulation = require('cacatoo') // ... if you have cacatoo installed via npm install cacatoo. 

    let maxsteps = 250000 // 1 
    let write_out_number = 1000 
    let write_out_interval = Math.round(maxsteps / write_out_number) 
    var list = [0,1]
    let permCounts = undefined
    let masterPerm = undefined 
    let run_num = 1 
    let filn_suffix 
    let diffuse = 1 
    let env_cgs = [] 
    let maxInitCGNum = 6 
    let CG_NUMS_ARR = [] 
    let num_CG = 6 // Set the number of common goods to three. 
    let global_mut = 0.000005 // Sets the probability of cells mutating into "cheaters". 
    let global_death = 0.1 // Set the cell mortality rate. 
    let base_repro_chance = 0.6 // Set replication rates for all cell bases. 
    let starting_omni_proportion = 1 // Used to produce the initial alive cells in the model. 
    let cost_per_CG = 0.01 // Set the cost of producing each public good. 
    let CG_radius = 10 // Set the diffusion range of public goods. 
    let temp_var // Set the global variable temp_var. These are genomes that cells use to produce public goods. 
    let count_alive // Set the global variable count_alive. 
    let births = 0 
    let logbook = "" 
    let CGnumbersarray= [] 
    let product_interval = 1 
    let diffuse_interval = 1 
    let consume_chance = 1 
    let consume_number = 1 
    let consume = 1 
    let decay_chance = 0.001 
    let decay_interval = 1 
    let decay = 1 
    let mutation_number = 1 
    let num_col = 150 
    let num_row = 150 

    var dir = './data_out_'+run_num // The fs.existsSync command is used to check whether files exist in the "dir" path. If "console log" is used, a Boolean value is returned. 
if (!fs.existsSync(dir)){ // The condition here is that there are no files in the "dir" path checked by the fs.existsSync synchronization. 
    fs.mkdirSync(dir); // The "fs.mkdirSync" allows to create a new directory in the specified path (dir). 
} 

let filn = dir+"/Run_Info.txt"
if(fs.existsSync(filn)){ // If files exist in the "filn" path. 
	fs.unlinkSync(filn) // The fs.unlinkSync command is used to delete files synchronously from the file system. It takes the file path (filn) as a parameter. An error occurs if the file does not exist. If I need to delete files asynchronously, "fs.unlink" can be used. 
} 


fs.appendFileSync(filn, "run_num\t"+run_num+"\n"+"num_CG\t"+num_CG+"\n"+"global_mut\t"+global_mut+"\n"+"global_death\t"+global_death+"\n")
fs.appendFileSync(filn, "base_repro_chance\t"+base_repro_chance+"\n"+"starting_omni_proportion\t"+starting_omni_proportion+"\n")
fs.appendFileSync(filn, "cost_per_CG\t"+cost_per_CG+"\n"+"CG_radius\t"+CG_radius+"\n"+"maxsteps\t"+maxsteps+"\n")
fs.appendFileSync(filn, "num_col\t"+num_col+"\n"+"num_row\t"+num_row+"\n"+"diffusion\t"+diffuse_interval+"\n"+"Margolus diffusion\t"+diffuse+"\n") 
fs.appendFileSync(filn, "write_out_interval\t"+write_out_interval+"\n") // The fs.appendFileSync () method is used to append a data synchronously to a file. If no file exist, a new file is created and the data is appended to the end of the file. 
fs.appendFileSync(filn, "mutation_number\t"+mutation_number+"\n") 
fs.appendFileSync(filn, "maxInitCGNum\t"+maxInitCGNum+"\n") 
fs.appendFileSync(filn, "product_interval\t"+product_interval+"\n") 
fs.appendFileSync(filn, "decay_chance\t"+decay_chance+"\n"+"decay_interval\t"+decay_interval+"\n"+"decay\t"+decay+"\n") 
fs.appendFileSync(filn, "consume_chance\t"+consume_chance+"\n"+"consume_number\t"+consume_number+"\n"+"consume\t"+consume+"\n") 
filn_suffix = CG_radius+"_"+global_mut+"_"+cost_per_CG+"_"+global_death+"_"+num_CG+"_"+base_repro_chance



grid_dir = dir+"/GridStates_"+filn_suffix+"/"	
if (!fs.existsSync(grid_dir)){
    fs.mkdirSync(grid_dir);
} 

filn = dir+"/CheaterCounts_"+filn_suffix+".txt"	
if(fs.existsSync(filn)){
	fs.unlinkSync(filn)
} 

filn = dir+"/production_"+filn_suffix+".txt"	
if(fs.existsSync(filn)){
	fs.unlinkSync(filn)
} 

filn = dir+"/CheaterCounts_"+"doppleganger_"+filn_suffix+".txt"	
if(fs.existsSync(filn)){
	fs.unlinkSync(filn)
} 

grid_dir = dir+"/GridStates_"+"doppleganger_"+filn_suffix+"/"	
if (!fs.existsSync(grid_dir)){
    fs.mkdirSync(grid_dir);
} 

filn = dir+"/CG_"+"doppleganger_"+filn_suffix+".txt"	
if(fs.existsSync(filn)){
	fs.unlinkSync(filn)
} 

filn = dir+"/CGrate_"+"doppleganger_"+filn_suffix+".txt"	
if(fs.existsSync(filn)){
	fs.unlinkSync(filn)
} 


    
    let sim; // Declare a variable named "sim" globally, so that we can access our cacatoo-simulation from wherever we need. 
    
    function cacatoo() {
       let config = // This is an object. 
       {
           title: "CG radius 10",  // The title/name of this cacatoo simulation.                     
           description: "", // A description of the project, in the lower of the title.          
           maxtime: maxsteps,   // The time steps of the model will run.                                
           ncol: num_col,     // Adjust the transverse length of the grid.                                                            
           nrow: num_row,	// Adjust the Longitudinal height of the grid.      
           wrap: [true, true], // This is a boundary.                          
           scale: 2, // The pixel of the grid. 		                   
           statecolours: {
               'production': { 1: 'yellow', 2: 'orange', 3: 'red', 4: 'green'}, // Changed. 
               "alive": { 1: 'blue' } // Set the color for the alive state and production, and the dead cells in the undefined state are the default black. 
           },         
       }
    
       sim = new Simulation(config) // Initialize the simulation.                          
       sim.makeGridmodel("cells") // To create a new Gridmodel, it is important to change the default "model" to the name of the Gridmodel created in the second step of creating the function and the third step of creating the main loop.                           
       sim.makeGridmodel("dopple") 
       //document.open("test.txt") // Use document_open() to open a document to be written to. I can then add document.write () syntax to replace the original content with some html fragments. In addition, if I use the window.open method, I can open a new window, which has the advantage of preserving the original document content. 
    
    
       sim.cells.initialise = function () {
        // console.log('sim.cells.initialise') 
           sim.initialGrid(sim.cells, 'alive', 0, 1.0) // Changed. Sets the initial number of cells to survive in the model "Cells". "" to ''. Set no cells to 'alive 1'.   
 //          sim.initialGrid(sim.cells, 'production', 1, 0.33, 2, 0.33, 3, 0.34) // Set production 1,2,3, to 33% occupancy. 
           //这里的0.33 初始化的细胞 0.33+0.33+0.33  还有空的 我觉得是这个问题 它不是100% 
           for (let i = 0; i < sim.cells.nc; i++) for (let j = 0; j < sim.cells.nr; j++) { // This is a for loop that is executed when the initial value i < sim.cells.nc and value j < sim.cells.nr. The range of the loop is "0~ncol" and "0~nrow", so the loop traverses the entire model. 
                sim.cells.grid[i][j].gp = i + '\t' + j 
 //               sim.cells.grid[i][j].genome = new Array(num_CG).fill(0) 
                sim.cells.grid[i][j].alive = 0 
                
               if (sim.cells.rng.genrand_real1() < starting_omni_proportion) { // This is an if condition that the real numbers in the interval [0,1] are randomly generated, and the generated re/*  */al numbers are less than starting_omni_proportion. 
                    sim.cells.grid[i][j].alive = 1 
                    sim.cells.grid[i][j].genome = new Array(num_CG).fill(1) // Create a new array "genome", the contents of which are the number of public goods. Then use the "fill" method to give cells the genome to produce public goods.              
                    temp_var = sim.cells.grid[i][j].genome 
                    sim.cells.grid[i][j].production = temp_var.reduce((a, b) => a + b, 0) // This is "reduce" method. It is responsible for summing. The quantity of "production" is the sum of the quantity of "genome". 
                    // console.log('127 line %s', sim.cells.grid[i][j].genome) 
                    env_cgs.push(sim.cells.grid[i][j]) 
               }
               else {
                sim.cells.grid[i][j].alive = 0 
                sim.cells.grid[i][j].genome = undefined
                sim.cells.grid[i][j].production = undefined 
               }
 //              console.log(i,j)
   //            console.log(sim.cells.grid[i][j].alive)
     //          console.log()
           } 

           for (let i = 0; i < sim.cells.nc; i++) for (let j = 0; j < sim.cells.nr; j++) { // This is a for loop that is executed when the initial value i < sim.cells.nc and value j < sim.cells.nr. The range of the loop is "0~ncol" and "0~nrow", so the loop traverses the entire model. 
 //           console.log(i,j)
   //         console.log(sim.cells.grid[i][j].alive)
     //       console.log()               
           }
           sim.cells.reportGenomes() // 2 
       } 

       sim.dopple.initialise = function () {
        // sim.initialGrid(sim.dopple, 'alive', 0, 1.0) // Changed. Sets the initial number of cells to survive in the model "Cells". "" to ''. Set no cells to 'alive 1'.   
        // sim.initialGrid(sim.dopple, 'production', 1, 0.33, 2, 0.33, 3, 0.34) // Set production 1,2,3, to 33% occupancy. 
            for (let i = 0; i < sim.dopple.nc; i++) for (let j = 0; j < sim.dopple.nr; j++) { // This is a for loop that is executed when the initial value i < sim.cells.nc and value j < sim.cells.nr. The range of the loop is "0~ncol" and "0~nrow", so the loop traverses the entire model. 
                sim.dopple.grid[i][j].CGnumbersarray = new Array(num_CG).fill(0) 
                if(sim.cells.grid[i][j].alive == 1 ){
                    sim.dopple.grid[i][j].CGnumbersarray = new Array(num_CG).fill(Math.floor((Math.random()*maxInitCGNum)+1)) 
                } 
            } 
       } 

       sim.cells.reportGenomes = function() {
        // console.log('sim.cells.reportGenomes') 
        makePermCounts() 
        for (let col_iter = 0; col_iter < sim.cells.nc; col_iter++) {
            for (let row_iter = 0; row_iter < sim.cells.nr; row_iter++) {
                
               if (sim.cells.grid[col_iter][row_iter].alive > 0) {
                    let t_genome = sim.cells.grid[col_iter][row_iter].genome.toString() 
                    t_val = permCounts.get(t_genome)
                    permCounts.set(t_genome, t_val+1)
                } 
            } // “Get”可以将对象属性绑定到查询属性时调用的函数或数组。这里我们将字符串类型数组t_genome的属性绑定到permCounts。
          } // “Set”可用于存储唯一值，该值也可以是对象引用。“Set”的对象是一个值的集合。集合中的元素只出现一次，它们是唯一的。 
        }   

    
       function shuffle(array) { // This part is Fisher-Yates shuffle. This functional approach can modify the original array and randomly rearrange the elements in the array. The purpose of this code is to ensure that each gene in the "genome" has the same chance of appearing on the cell.
           for (let q = array.length - 1; q > 0; q--) { // Let "q" pass through every element in the group through the for loop. 
               let r = Math.floor(Math.random() * (q + 1)); // Math.random()* (q+1) can return a number greater than 1 and less than q+1. Math.floor(Math.random()* (q+1)) can round down Math.random()* (q+1) to get a random integer from 1 to q.
               [array[q], array[r]] = [array[r], array[q]]; // Swap elements in q and r. 
           }
           return array // Terminates the execution of this function and returns the shuffled array. 
       } // The purpose of this step is to give the function the "shuffle" function, which is used by the code that shuffles the neighbors. 

       getPermutations = function(list, maxLen) { // The list is an array that was set earlier. What is the function? 
        // console.log('getPermutations') 
        var perm = list.map(function(val) { // The map() method can be used to create a new array. The "map" is preceded by the original array to be processed. In parentheses are the functions used to process original array. 
            return [val]; // map()方法可以用来创建一个新的数组。“map”前面是要处理的原始数组。括号中是用来处理原始数组的函数。
        });
        var generate = function(perm, maxLen, currLen) {
            if (currLen === maxLen) { // The condition is that currLen and maxLen both have the same value and data type. 
                return perm;
            }
            for (var i = 0, len = perm.length; i < len; i++) { // The "i" traverses the entire array "perm". 
                var currPerm = perm.shift(); // The "shift" method removes the first element in the array, changing the length of the original array. ? If, all. Else, half. 
                for (var k = 0; k < list.length; k++) {
                    perm.push(currPerm.concat(list[k])); // The "push" method adds elements to the end of the array and changes the length of the array. 
                } // The "concat" method is used to join the arrays currPerm and list. The concat method returns a new array without changing the original array. 
            }
            return generate(perm, maxLen, currLen + 1); // If it doesn't matter, currPerm is an empty array. 
        };
        return generate(perm, maxLen, 1);
    }

    
    makePermCounts = function() {
        // console.log('makePermCounts') 
        permCounts = new Map(); // The "Map" is a data structure that can store key-value pairs. Key-value pair like key(age) and value(18). 
        var res = getPermutations(list, num_CG) 
        for (r = 0; r < res.length; r++) {
            t_string = res[r].toString() // Use the toString method to turn the elements of the array res into strings. 
            permCounts.set(t_string, 0) // Set and store key-value pairs (t_string, 0). 
        }
    }

    
    First_makePermCounts = function() { // The operations are the same as in the previous step. 
        permCounts = new Map();
        var res = getPermutations(list, num_CG)
        for (r = 0; r < res.length; r++) {
            t_string = res[r].toString()
            permCounts.set(t_string, 0)
        }
        masterPerm = permCounts
        sim.cells.writeFirstCheaterPermutations() // Write the permutations of the first cheater. ? 
    } 
        sim.cells.findLivingNeighbours = function (i,j) { 
            // console.log('sim.cells.findLivingNeighbours %d  %d', i,j) 
            let living_neighbours = [] // Create a new array "living_neighbours". This is a two-dimensional array. 
            for(let ii= (i - 1); ii<= (i + 1); ii++) // It's a double for loop. Initialize ii to "i-CG_radius", ii+1 when "ii <= i+CG_radius". This layer loop determines the number of rows of neighbors. 
            {
                for(let jj= (j - 1); jj<= (j + 1); jj++) // This inner loop determines the number of neighbors per row. The purpose of the two loops ranging from The purpose of the two loops ranging from i - CG_radius to i + CG_radius is to have the loop traverse the maximum range of action of the public good. It is now possible to get all neighbors within the scope of public goods. 
                {
                    if(ii > 0 && jj > 0 && ii < sim.cells.nc && jj < sim.cells.nr){
                        if(sim.cells.getGridpoint(ii,jj) == undefined) {} // This function is designed to get live neighbors within the scope of the public good, so no action is required when undefined is retrieved.
                        else if(sim.cells.getGridpoint(ii,jj).alive == 1) { // The other condition, this condition is to retrieve living cells. 
                        //We need the i and j. not the gp
                        // gp = ii+'\t'+jj 
                        // console.log('sim.cells.findLivingNeighbours %s', sim.cells.grid[ii][jj].gp) 
                        living_neighbours.push(sim.cells.grid[ii][jj].gp) 
                        }
                    }
                }
            } 
            return living_neighbours // Terminates the function with the array "living_neighbours". 
        } 
    
        sim.cells.sumPublicGoods = function (gp) {
            // console.log('sim.cells.sumPublicGoods %s', gp) 
            let i_j = gp.split("\t")
            let i = i_j[0]
            let j = i_j[1]
            let public_goods_produced = 0 
            let CG = new Array(num_CG).fill(0) 

            // for (let i = 0; i < sim.cells.nc; i++) {
            //     for (let j = 0; j < sim.cells.nr; j++) { 
                if(i > 0 && j > 0 && i < sim.cells.nc && j < sim.cells.nr){
                                for(let n = 0 ; n < num_CG ; n++) { 
                                    let realCGNum = sim.dopple.grid[i][j].CGnumbersarray[n] 
                                    // console.log('242 line %d', realCGNum) 
                                    if(realCGNum > 0) {
                                        if(CG[n] == 0) {
                                            CG[n] = 1 
                                        }
                                    } 
                                }
                                // console.log('249 line %s', CG) 
                                for(let z = 0; z < CG.length; z++) {
                                    if(CG[z] == 1) {
                                        public_goods_produced = public_goods_produced + 1
                                    } 
                                } 
                            }
            //     } 
            // } 
            return public_goods_produced  
        } 

        sim.mutation_function = function(i,j){ 
            // console.log('sim.mutation_function %d %d', i,j) 
            if(mutation_number == 1){
            if (sim.cells.grid[i][j].alive == 1 && sim.cells.grid[i][j].genome != undefined) { // This if conditional is simulating the creation of a cheater. 
                for (let t = 0; t < num_CG; t++) { // Let t traverse every public good so that the genomes of every public good have a chance of being lost. 
                    let rng = Math.random() // Generates a random real number on the [0,1] interval. 
                    //  console.log(this.grid[i][j].genome, t, this.grid[i][j].genome[t], rng)
                    if ((rng < global_mut) && (sim.cells.grid[i][j].genome[t] == 1)) { // If the random real number generated is less than the mutation rate and this cell has this gene. 
                        sim.cells.grid[i][j].genome[t] = 0 // The cell will mutate and lose the genome. This cell is a cheater. 
                    }
                } 
                // if(sim.cells.grid[i][j].genome != undefined){
                 temp_var = sim.cells.grid[i][j].genome 
                 genotype = temp_var 
                 sim.cells.grid[i][j].production = temp_var.reduce((a, b) => a + b, 0) // Sum the production of this cheater. 
                // } 
                }
            } 
        }

        sim.cells.consume = function (gp){ 
            // console.log('sim.cells.consume %s', gp) 
            if(consume == 1){
            let i_j = gp.split("\t")
            let i = i_j[0]
            let j = i_j[1]
                for(let z = 0; z < num_CG; z++) {
                    if(sim.dopple.grid[i][j].CGnumbersarray[z] > 0 && this.rng.genrand_real1() < consume_chance){ 
                        sim.dopple.grid[i][j].CGnumbersarray[z] = Math.floor((sim.dopple.grid[i][j].CGnumbersarray[z] - consume_number)) 
                        }
                    }
                }
            } 

        sim.decay = function(){ 
            if(decay == 1){
                for (let i = 0; i < sim.dopple.nc; i++) {
                    for (let j = 0; j < sim.dopple.nr; j++) { 
                        for(let n = 0; n < num_CG; n++){
                            if (sim.dopple.grid[i][j].CGnumbersarray[n] > 0) {  
                                let new_cnt = 0     
                                for(let pp = 0; pp < sim.dopple.grid[i][j].CGnumbersarray[n]; pp++){
                                    if (Math.random() > decay_chance) { 
                                        new_cnt = new_cnt + 1 
                                    }
                                }
                                sim.dopple.grid[i][j].CGnumbersarray[n] = new_cnt 
                            }
                        } 
                    }
                }            
            }  
        }




            // sim.dopple.decay = function(i,j){ 
            //     if(decay == 1){
            //     for(let n = 0; n < num_CG; n++){
            //     if (sim.dopple.grid[i][j].CGnumbersarray[n] > 0) { 
            //             let CG_particles = sim.dopple.grid[i][j].CGnumbersarray[n] 
            //             console.log("345 line", CG_particles) 
            //                 for(let e = 0; e < CG_particles.length; e++){
            //                     if(this.rng.genrand_real1() < decay_chance){
            //                         console.log("402 line", sim.dopple.grid[i][j].CGnumbersarray[n])
            //                         CG_particles[e] = 0 
            //                         sim.dopple.grid[i][j].CGnumbersarray[n] = CG_particles 
            //                         console.log("405 line", sim.dopple.grid[i][j].CGnumbersarray[n])
            //                     }
            //                     }
            //                     // console.log("408 line", sim.dopple.grid[i][j].CGnumbersarray[n])
            //                 } 
            //             } 
            //         }
            //     }

        sim.cells.checkGrowth = function(i,j) { 
            // console.log('sim.cells.checkGrowth %d  %d', i,j) 
            if (sim.cells.grid[i][j].alive == 0) { // This part of the function simulates cell replication, and it is impossible to add another cell to an existing cell, so there are no living cells at the point. 
                // console.log(sum_resources) 
                    let neighbours = sim.cells.findLivingNeighbours(i,j) // Get all the neighbors in Moore neighbourhood. 
                    let random_neighbours = neighbours 
                    let cease = 0 
                    shuffle(random_neighbours) // Shuffle the neighbors in Moore neighbourhood. Make the neighbor's location random. 
                    for (let bb = 0; bb < random_neighbours.length; bb++) { // This loop simulates the replication of these neighbors, and the scope of the loop is all the neighbors in Moore neighbourhood. 
                        if (cease == 0) {
                        // console.log('312 line %s', random_neighbours[bb]) 
                        let sum_resources = sim.cells.sumPublicGoods(random_neighbours[bb]) 
                        // console.log('314 line %s', sum_resources) 
                        if(sum_resources == num_CG){ 
                            let i_j = random_neighbours[bb].split("\t") 
                            let ii = i_j[0]
                            let jj = i_j[1] 
                            // console.log('317 line %s', sim.cells.grid[ii][jj]) 
                            let growth_penalty = cost_per_CG * base_repro_chance
                            let repro_chance = base_repro_chance - (sim.cells.grid[ii][jj].production * growth_penalty) // The replication rate per neighbor is equal to the base replication rate minus the number of productions produced by that neighbor multiplied by the cost per public good. 
                            if (Math.random() < repro_chance && sim.cells.grid[ii][jj].alive == 1) { // Generates a random real number on the [0,1] interval. If the real number is smaller than repro_chance, the neighbor can copy itself. 
                               cease = 1 
                            //    console.log('325 line 开始复制了') 
                               sim.cells.consume(random_neighbours[bb]) 
                                count_alive += 1 // count_alive = count_alive + 1. Indicates that the replication is successful. 
        
                                births += 1 
                                
                                sim.cells.grid[i][j].gp = i + '\t' + j 
                                sim.cells.grid[i][j].alive = 1 // After successful replication, this grid changes from alive == 0 to alive = 1. 
                                sim.cells.grid[i][j].genome = new Array(num_CG).fill(0) // This step and the next loop are in the simulation of cell heredity. 
                                // this.grid[i][j].totalConsumeCount = totalConsumeCount 
                                for(let p = 0; p< num_CG; p++) { 
                                    // console.log('353 line %d %d', ii,jj) 
                                    // console.log('352 line', sim.cells.grid[ii][jj]) 
                                    // console.log('354 line', sim.cells.grid[ii][jj].genome[p]) 
                                    sim.cells.grid[i][j].genome[p] = sim.cells.grid[ii][jj].genome[p] // BRAM *** Because integers are primitives, this will COPY the genome values into the new array. 
                                    // console.log(sim.cells.grid[i][j].genome[p])
                                }
                                temp_var = sim.cells.grid[i][j].genome // Why the loop don't have "[]" ? 
      //                          console.log(temp_var) 
                                let prod_count = 0
                                for(let u = 0; u < temp_var.length; u++) { // Let u go through each gene in the "genome" with the goal of producing production. 
                                    if(temp_var[u] == 1) { // Element 1 of the array "temp_var" indicates that there are genes that produce the product. 
                                        prod_count += 1 // prod_count = prod_count + 1, the new production is produced. 
                                    }
                                }
                                sim.cells.grid[i][j].production = prod_count 

                                // sim.dopple.grid[i][j].CGnumbersarray = new Array(num_CG).fill(0) 
        
                                // for(let CGnumber = 0; CGnumber < num_CG; CGnumber++) {
                                    
                                //     if(sim.cells.grid[i][j].genome[CGnumber] == 1) {
                                    
                                //         sim.dopple.grid[i][j].CGnumbersarray[CGnumber] = Math.floor((Math.random()*maxInitCGNum)+1) 
                                //     }
                                //     else {
                                //         sim.dopple.grid[i][j].CGnumbersarray[CGnumber] = 0 
                                //     }
                                // } 
                            // console.log('111') 
                            // console.log('line 438 %d %d', i,j) 
                            // console.log('line 439', sim.cells.grid[i][j]) 
                            env_cgs.push(sim.cells.grid[i][j]) 
                        }
                    }
                    } 
                } 
            }
        } 
    

       sim.cells.getProdAmounts = function(property, values) { 
        // console.log('372 line') 
        let sum = Array(values.length).fill(0);
          for (let i = 0; i < this.nc; i++) {
            for (let j = 0; j < this.nr; j++) {
                for (let val in values)
                if (this.grid[i][j].alive == 1 ){
                    if (this.grid[i][j][property] == values[val]) sum[val]++;
                }
               }
        }
        return sum;
    } 

        // sim.dopple.getProdAmounts = function(property, values) {
        // 	let sum = Array(values.length).fill(0);
	  	// 	for (let i = 0; i < this.nc; i++) {
    	// 	    for (let j = 0; j < this.nr; j++) {
        //     		for (let val in values)
        //         	if (this.grid[i][j].alive == 1 ){
        //         		if (this.grid[i][j][property] == values[val]) sum[val]++;
        //         	}
	    //        	}
        // 	}
	    //     return sum;
    	// } 

       sim.cells.writeFirstCheaterPermutations = function() {
        let filn = dir+"/CheaterCounts_"+filn_suffix+".txt"	
        fs.appendFileSync(filn, `TimeSteps\t`)	
        for (let [key, value] of masterPerm) {
            fs.appendFileSync(filn, `${key}\t`)  
        } 
        fs.appendFileSync(filn, `\n`) 
    } 

    sim.cells.writeCheaterPermutations = function() {
        let filn = dir+"/CheaterCounts_"+filn_suffix+".txt"	
        fs.appendFileSync(filn, `${this.time}\t`)	
        for (let [key, value] of permCounts) {
            fs.appendFileSync(filn, `${value}\t`)
        }
        fs.appendFileSync(filn, `\n`)	
    } 

    sim.cells.writeFirstProd = function() {
        let filn = dir+"/production_"+filn_suffix+".txt"		
        let prod_arr = []
        for(let arr = 0; arr <= num_CG; arr++) {
            prod_arr[arr] = arr
        }
        fs.appendFileSync(filn, 'TimeSteps\t')
        for(let p = 0; p <= num_CG; p++) {
            fs.appendFileSync(filn, "Total_CGs_"+p+'\t')
        }
        fs.appendFileSync(filn, '\n')
    } 

    sim.cells.writeProd = function() {
        let filn = dir+"/production_"+filn_suffix+".txt"		
        let prod_arr = []
        for(let arr = 0; arr <= num_CG; arr++) {
            prod_arr[arr] = arr
        }
        let production_counts = sim.cells.getProdAmounts('production', prod_arr)
        fs.appendFileSync(filn, this.time+'\t')
        for(let p = 0; p <= num_CG; p++) {
            fs.appendFileSync(filn, production_counts[p]+'\t')
        }
        fs.appendFileSync(filn, '\n')
    } 

    sim.cells.writeGrid = function() {
        filn = dir+"/GridStates_"+filn_suffix+"/"+this.time+".txt"	
        if(fs.existsSync(filn)){
            fs.unlinkSync(filn)
        }
        fs.appendFileSync(filn, "x\ty\talive\tproduction_count\tgenome_state\n")
        for (let i = 0; i < this.nc; i++) {
            for (let j = 0; j < this.nr; j++) {
                
                let point_state = i+'\t'+j+'\t'+this.grid[i][j].alive+'\t'+this.grid[i][j].production+'\t'+this.grid[i][j].genome+'\n'
                 fs.appendFileSync(filn,point_state)	
             }
         }	
    } 

    // sim.dopple.writeFirstCheaterPermutations = function() {
    //     let filn = dir+"/CheaterCounts_"+"doppleganger_"+filn_suffix+".txt"	
    //     fs.appendFileSync(filn, `TimeSteps\t`)	
    //     for (let [key, value] of masterPerm) {
    //         fs.appendFileSync(filn, `${key}\t`)  
    //     }
    //     fs.appendFileSync(filn, `CG1\t`)
    //     fs.appendFileSync(filn, `CG2\t`)
    //     fs.appendFileSync(filn, `CG3\t`)
    //     fs.appendFileSync(filn, `\n`) 
    // } 

    // sim.dopple.writeCheaterPermutations = function() {
    //     let filn = dir+"/CheaterCounts_"+"doppleganger_"+filn_suffix+".txt"	
    //     fs.appendFileSync(filn, `${this.time}\t`)	
    //     for (let [key, value] of permCounts) {
    //         fs.appendFileSync(filn, `${value}\t`)
    //     }
    //      CG_one_sum = 0
    //      for (let [key, value] of permCounts) {
    //          if(key[0] == '1'){
    //              CG_one_sum += value
    //          }
    //      }
    //      fs.appendFileSync(filn, `${CG_one_sum}\t`)

    //      CG_two_sum = 0
    //      for (let [key, value] of permCounts) {
    //          if(key[2] == '1'){
    //              CG_two_sum += value
    //          }
    //      }
    //      fs.appendFileSync(filn, `${CG_two_sum}\t`)

    //      CG_three_sum = 0
    //      for (let [key, value] of permCounts) {
    //          if(key[4] == '1'){
    //              CG_three_sum += value
    //          }
    //      }
    //      fs.appendFileSync(filn, `${CG_three_sum}\t`) 
    //      fs.appendFileSync(filn, `\n`)	
    // } 

    sim.dopple.writeFirstCG = function() {
        let filn = dir+"/CG_"+"doppleganger_"+filn_suffix+".txt"	
        fs.appendFileSync(filn, `TimeSteps\t`)	
        for(let i = 0; i < num_CG;i++) {
            let num = i + 1 
            fs.appendFileSync(filn, 'CG'+ num +'\t')
        } 
        fs.appendFileSync(filn, `\n`) 
    } 

    sim.dopple.writeCG = function() {
        let filn = dir+"/CG_"+"doppleganger_"+filn_suffix+".txt" 
        fs.appendFileSync(filn, `${this.time}\t`)	
        CG_one_sum = 0
        CG_two_sum = 0
        CG_three_sum = 0 
        CG_sum =[] 
        CG_NUMS_ARR = new Array(num_CG).fill(0)

        for (let i = 0; i < sim.dopple.nc; i++) {
            for (let j = 0; j < sim.dopple.nr; j++) {
                temp_cg = sim.dopple.grid[i][j] 
                //这个地方要看一下 怎么拿出来产品总数 
                //run 
                for(let num = 0; num < num_CG; num++) {
                    //有空的要判断
                    if(temp_cg.CGnumbersarray){
                        CG_NUMS_ARR[num] = CG_NUMS_ARR[num] + temp_cg.CGnumbersarray[num]
                    }
                    
                }
            }
        }
        for(let n = 0; n < num_CG; n++) {
            fs.appendFileSync(filn, `${CG_NUMS_ARR[n]}\t`)
        }
        fs.appendFileSync(filn, `\n`)	
    } 

    sim.dopple.writeCGrate = function() {
        let filn = dir+"/CGrate_"+"doppleganger_"+filn_suffix+".txt" 
        fs.appendFileSync(filn, `${this.time}\t`)	
        let CGnot = 0 
        for (let i = 0; i < sim.dopple.nc; i++) {
            for (let j = 0; j < sim.dopple.nr; j++) {
                for(let n = 0; n < num_CG; n++) { 
                    if(sim.dopple.grid[i][j].CGnumbersarray[n] > 0){
                        // console.log(sim.dopple.grid[i][j].CGnumbersarray[n]) 
                    }
                        else if((sim.dopple.grid[i][j].CGnumbersarray[n] == 0)){
                            CGnot = CGnot + 1 
                            // console.log(CGnot) 
                            // console.log(sim.dopple.grid[i][j].CGnumbersarray[n]) 
                            break 
                        }
                }
            } 
        } 
        
        fs.appendFileSync(filn, `${CGnot}\t`)
        fs.appendFileSync(filn, `\n`)	
    } 

    // sim.dopple.writeFirstCheaterPermutations = function() {
    //     let filn = dir+"/CheaterCounts_"+"doppleganger_"+filn_suffix+".txt"	
    //     fs.appendFileSync(filn, `TimeSteps\t`)	
    //     for (let [key, value] of CGnumbersarray) {
    //         fs.appendFileSync(filn, `${key}\t`)  
    //     }
    //     fs.appendFileSync(filn, `\n`) 
    // } 

    // sim.dopple.writeCheaterPermutations = function() {
    //     let filn = dir+"/CheaterCounts_"+"doppleganger_"+filn_suffix+".txt"	
    //     fs.appendFileSync(filn, `${this.time}\t`)	
    //     for (let [key, value] of CGnumbersarray) {
    //         fs.appendFileSync(filn, `${value}\t`)
    //     }
    //      fs.appendFileSync(filn, `\n`)	
    // } 

    sim.dopple.writeGrid = function() {
        filn = dir+"/GridStates_"+"doppleganger_"+filn_suffix+"/"+this.time+".txt"	
        if(fs.existsSync(filn)){
            fs.unlinkSync(filn)
        }
        fs.appendFileSync(filn, "x\ty\tCGnumbersarray\n") 
        for (let i = 0; i < this.nc; i++) {
            for (let j = 0; j < this.nr; j++) {
                
                let point_state = i+'\t'+j+'\t'+this.grid[i][j].CGnumbersarray+'\n'
                 fs.appendFileSync(filn,point_state)	
             }
         }	
    }
    
       sim.cells.initialise() 
       sim.dopple.initialise() 
       sim.cells.writeGrid() 
       sim.createDisplay("cells", "alive", "")
       sim.createDisplay("cells", "production", "") // This two step creat displays on "alive" and "production" in the model "cells". 

       First_makePermCounts()		
         sim.cells.writeFirstProd() 
		//  sim.cells.writeFirstCheaterPermutations() 
         sim.dopple.writeFirstCG() 

       // sim.spaceTimePlot("cells", "CG radius 10", "Space-time plot", 10, 200) 
    
       sim.cells.nextState = function (i, j) { 
        // console.log('sim.cells.nextState %d  %d',i,j) 
               if (Math.random() < global_death) { // This if conditional is simulating cell death. 
                   count_alive -= 1 // count_alive = count_alive - 1. This cell dies. 
                   this.grid[i][j].alive = 0
                   this.grid[i][j].genome = undefined
                   this.grid[i][j].production = 0 
               }
               else {
                   count_alive += 1 // count_alive = count_alive + 1. This cell lives. 
               }   // If the random real number generated is less than the death rate the cell dies. If the random real number generated is greater than the death rate the cell survives. 
            // } 
           sim.mutation_function(i,j) 
           sim.cells.checkGrowth(i,j) 
        } 
         sim.dopple.nextState = function (i, j) {  
        } 

    
       sim.cells.update = function () { // This is the third part of cacatoo, the main simulation loop. 
           this.synchronous() // Update grid points synchronously, using this.asynchronous() if you do not want to update grid points synchronously. 
           if (diffuse > 0){
                if(this.time % diffuse == 0){
                this.MargolusDiffusion() 
                } 
            // console.log("MargolusDiffusion") 
            } 
           this.plotPopsizes('production', [0, 1, 2, 3, 4])  // The plotPopsizes only can show a property? 
                   //   this.plotPopsizes('alive', [0, 1])
           
    
    
                   //    this.plotArray(["Production Intensity"], [production], ["blue"], "Production")
                   
           this.plotArray(["Cells"], [count_alive], ["blue"], "Population") 
           count_alive = 0  // Without this sentence, the image cannot be generated. 

           // this.plotPoints([genotype], "genome") 
           // genotype = 0 

           if (this.time % 100 == 0)       
            {
				sim.cells.writeProd() 
				//Update CheaterPermutations, and then write
				sim.cells.reportGenomes()
				sim.cells.writeCheaterPermutations()
 
            } 
             if (this.time % 200 == 0)
                {
                    sim.cells.writeGrid()
                } 
               
               
                count_alive = 0 
            
            
           
          


           if(this.time%100==0) this.perfectMix() // Changed. 

        //    if(this.time == 50000) sim.stop() // A manual stop. 
    
            if (this.time % 100 == 0)       // Otherwise, just print some numbers (e.g. popsizes)
           
            {
               sim.log(`Cheater at time point ${this.time}, has popsizes\t\t${sim.cells.getPopsizes('alive', [0,1])}`, "output") 
            //    sim.log(`Cheater at time point ${this.time}, has popsizes\t\t${sim.cells.getPopsizes('production', [0, 1, 2, 3, 4])}`, "output") 
              // if(!sim.inbrowser) sim.write_grid(sim.cheater,'species',`species_at_T${this.time}.dat`,warn=false)    // Example of how to write a grid-property to a file. Currently only works in NODEJS mode (i.e not in browser). 
            } 
            
            // if (this.time % 50 == 0)       // Otherwise, just print some numbers (e.g. popsizes)
            //     {
            //                     let log = `Cheater at time point ${this.time}, has popsizes\t\t${sim.cells.getPopsizes('production', [0, 1, 2, 3, 4])}`
            //         sim.log(log, "output")
            //                     logbook += log + '\n'
            //     }
            
            // if(this.time==10000) 
            // {
            //    sim.write(logbook,"Cells_data.txt") 
            // }
       } 

       sim.dopple.update = function () {
        this.synchronous()         
        //           this.plotPopsizes('alive', [1])
        this.plotPopsizes('production', [1, 2, 3, 4])


        //            this.plotArray(["Production Intensity"], )
        this.plotArray(["Pop"], [count_alive], ["black"], "Population")
        

        if (this.time % 100 == 0) {
            // sim.dopple.writeGrid() 
            sim.dopple.writeCG() 
        } 

        if (this.time % 200 == 0) {
            sim.dopple.writeGrid() 
            sim.dopple.writeCGrate() 
        } 

        if(this.time % diffuse_interval == 0) 
        {
            sim.concentation_function() 
            // console.log(1) 
        } 

        if(this.time % product_interval == 0){
            sim.productCG_function() 
            // console.log(2) 
        }

        if(this.time % decay_interval == 0){
            sim.decay() 
            // console.log(3) 
        }

       
       
        count_alive = 0
    }      
    
       /*
           OPTIONAL: Now that we have everything setup, we can also add some interactive elements (buttons or sliders). See cheater.html for more examples of this. 
       */
       sim.addButton("Play/pause sim", function () { sim.toggle_play() }) 
       sim.addButton("Enable/disable mix",function() {sim.toggle_mix()}) 
       sim.addButton("Kill alive cells",function() {sim.my_custom_killcell_function()}) // Killing off living cells accelerates the production changing process. 

    sim.my_custom_killcell_function = function()
    { 
        for (let i = 0; i < sim.cells.nc; i++) for (let j = 0; j < sim.cells.nr; j++) 
        {
            if(sim.cells.grid[i][j].alive == 1 && this.rng.genrand_real1() < 0.9) // This example have a bug. 
                sim.cells.grid[i][j].alive = 0
        }
    } 

    sim.concentation_function = function(){ 
        for (let i = 0; i < sim.dopple.nc; i++) {
            for (let j = 0; j < sim.dopple.nr; j++) { 
                for (let z = 0; z < num_CG; z++){
                    if(sim.dopple.grid[i][j].CGnumbersarray[z] > 0) { 
                        let temp_8array = new Array() 
                        for(let row = i - 1; row <= i + 1; row++){
                            for(let col = j - 1; col <= j + 1; col++) { 
                                // console.log('726 line  %d_%d', row,col) 
                                if(row < 0){
                                    // row = row + sim.dopple.nc 
                                    continue 
                                } 
                                if(row >= sim.dopple.nc){
                                    // row = row - sim.dopple.nc 
                                    continue 
                                } 
                                if(col < 0){
                                    // col = col + sim.dopple.nr 
                                    continue 
                                } 
                                if(col >= sim.dopple.nr){
                                    // col = col - sim.dopple.nr 
                                    continue 
                                } 
                                if(row == i && col == j){
                                    continue
                                } 
                                // console.log('738 line  %d_%d', row,col) 
                                 temp_8array.push(sim.dopple.grid[row][col]) 
                            }
                        } 
                        // console.log('741 line %s', temp_8array) 
                        shuffle(temp_8array) 
                        for(let tmp8 = 0; tmp8 <temp_8array.length; tmp8++) {
                            let temp8_grid = temp_8array[tmp8]
                            if(temp8_grid.CGnumbersarray[z] < sim.dopple.grid[i][j].CGnumbersarray[z]){
                                // && temp8_grid.CGnumbersarray[z] < 100 
                                temp8_grid.CGnumbersarray[z] += 1 
                                sim.dopple.grid[i][j].CGnumbersarray[z] -=1 
                            }
                        }
                    }
                }
            }
        } 
    }

    sim.productCG_function = function(){ 
        // console.log('759 line sim.productCG_function') 
        for (let i = 0; i < sim.dopple.nc; i++) {
            for (let j = 0; j < sim.dopple.nr; j++) {
                if(sim.cells.grid[i][j].alive == 1 && sim.cells.grid[i][j].genome != undefined) {
                    for(let CG = 0; CG < num_CG; CG++){
                            if (sim.cells.grid[i][j].genome[CG] == 1){
                            if(sim.dopple.grid[i][j].CGnumbersarray != undefined) {
                                // && sim.dopple.grid[i][j].CGnumbersarray[CG] < 100 
                                sim.dopple.grid[i][j].CGnumbersarray[CG] += 1
                            } 
                            else {
                                sim.dopple.grid[i][j].CGnumbersarray[CG] = sim.dopple.grid[i][j].CGnumbersarray[CG] 
                            }
                        }
                    }
                }
            }
        } 
    } 

       sim.start()
    
    
    
    }
            // document.close("test.txt")
            
            if (typeof window == "undefined") cacatoo()
    
    /*-------------------------End user-defined code ---------------------*/
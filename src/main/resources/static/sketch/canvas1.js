let pTitle; //title of image
let genes = []; //holds color and vertices info
let genome = []; //genome holds the chromosomes
let population = [];
let shape;
let sliderPop;
let sliderVertex;
let sliderChromosomes;
let sliderSelection;
let sliderMutation;
let startStop;
let evolving = false;
let initial = true;
let displayPop = false;
let canvas1e;
let canvas3e;
let fitness = [];
let loopCounter = 0;
let generationCounter = 0;
let genBestFit = 0;
let absBestFit = 0;
let matingPool = []; //will hold top 10% of members?
let mutate;
let mutateDirection;

var t = function (p) {

    p.setup = function () {
        var pCanvas = p.createCanvas(400, 400);
        pCanvas.parent('canvas1');
        pTitle = p.createElement('h3', "Generation 0");
        pTitle.parent('evolvingImg');
        canvas1e = document.getElementById("defaultCanvas0");

        //vertex selector
        sliderVertex = p.createSlider(3, 9, 6);
        sliderVertex.style('width', '240px');
        sliderVertex.parent('vertexSize');
        sliderVertex.id("vertex-slider");
        sliderVertex.class("ui-slider");
        sliderVertex.attribute('name', 'vertices');
        //chromosome selector
        sliderChromosomes = p.createSlider(1, 50, 25);
        sliderChromosomes.style('width', '240px');
        sliderChromosomes.parent('polygonSize');
        sliderChromosomes.id("polygon-slider");
        sliderChromosomes.class("ui-slider");
        sliderChromosomes.attribute('name', 'chromosomes');
        //population size selector
        sliderPop = p.createSlider(1, 50, 25);
        sliderPop.style('width', '240px');
        sliderPop.parent('popSize');
        sliderPop.id("population-slider");
        sliderPop.class("ui-slider");
        sliderPop.attribute('name', 'populationSize');
        //selection cutoff percentage selector
        sliderSelection = p.createSlider(1, 100, 10);
        sliderSelection.style('width', '240px');
        sliderSelection.parent('selection-cutoff');
        sliderSelection.id("selection-slider");
        sliderSelection.class("ui-slider");
        sliderSelection.attribute('name', 'selection');
        //mutation selector
        sliderMutation = p.createSlider(1, 10, 2);
        sliderMutation.style('width', '240px');
        sliderMutation.parent('mutation-rate');
        sliderMutation.id("mutation-slider");
        sliderMutation.class("ui-slider");
        sliderMutation.attribute('name', 'mutationRate');

        //startEvolution();

        $('#start').hide();
        $('#defaultCanvas0').hide();
        startStop = p.select('#start');
        console.log(startStop);
        startStop.mousePressed(() => {
            p.evolve();
        });

        //slider changes
        var polSlider = document.getElementById("polygon-slider");
        var polOutput = document.getElementById("polygons");
        polOutput.innerHTML = polSlider.value;

        polSlider.oninput = function () {
            polOutput.innerHTML = this.value;
        };
        //slider changes
        var verSlider = document.getElementById("vertex-slider");
        var verOutput = document.getElementById("vertices");
        verOutput.innerHTML = verSlider.value;

        verSlider.oninput = function () {
            verOutput.innerHTML = this.value;
        };
        //slider changes
        var popSlider = document.getElementById("population-slider");
        var popOutput = document.getElementById("population-size");
        popOutput.innerHTML = popSlider.value;

        popSlider.oninput = function () {
            popOutput.innerHTML = this.value;
        };
        //selection cutoff changes
        var selSlider = document.getElementById("selection-slider");
        var selOutput = document.getElementById("mating-pool-size");
        selOutput.innerHTML = selSlider.value;

        selSlider.oninput = function () {
            selOutput.innerHTML = this.value;
        };
        //selection cutoff changes
        var mutSlider = document.getElementById("mutation-slider");
        var mutOutput = document.getElementById("mutation-percent");
        mutOutput.innerHTML = mutSlider.value;

        mutSlider.oninput = function () {
            mutOutput.innerHTML = this.value;
        };

        p.noLoop();
    };

    p.draw = function () {
        console.log("Draw is running");
        loopCounter++;

        if (loopCounter > 1) {
            p.background(255);

            //set initial population. Weird that it's in draw, but this ensures that canvas3 is drawn
            if (initial === true) {
                population = [];
                generationCounter++;
                $('#evolvingImg').html("Generation " + generationCounter);
                for (var j = 0; j < sliderPop.value(); j++) {
                    genome = [];
                    for (var i = 0; i < sliderChromosomes.value(); i++) {
                        genome.push(new DNA());
                    }
                    population.push(genome);
                }
                initial = false;
            }
            loopCounter--; //maybe delete this
            
            $('#evolvingImg').html("Generation " + generationCounter);
            //draw through the population and find the fitness of each individual
            fitness = [];
            for (var i = 0; i < population.length; i++) { //go through each member of population
                p.background(255);
                for (var s = 0; s < population[i].length; s++) { //go through each chromosome in individual
                    shape = population[i][s]; //gets chromosome from genome
                    p.noStroke();
                    p.fill(shape[0], shape[1], shape[2], shape[3]);
                    p.beginShape();
                    for (var v = 4; v < shape.length; v += 2) {
                        vertex(shape[v], shape[v + 1]);
                    }
                    p.endShape(CLOSE);
                }
                //insert fitness function here. Compare canvas 1 to 3
                let tempFit = calculateFitness();
                //draw best member onto canvas 2
                if (tempFit > genBestFit) {
                    genBestFit = tempFit;
                }
                fitness.push(tempFit);                
                
                if (genBestFit > absBestFit) {
                    absBestFit = genBestFit;
                    $('#bestImg').html("Generation " + generationCounter + ", Fitness - " + (absBestFit * 100).toFixed(2) + "%");
                    let canvas2 = document.getElementById("defaultCanvas1");
                    let canvas1 = document.getElementById("defaultCanvas0");
                    let ctx2 = canvas2.getContext("2d");
                    ctx2.drawImage(canvas1, 0, 0);                    
                }
                //console.log(fitness);
            }

            //mating pool goes here after calculating fitness [] that holds fitness for each member
            var selectionPool = createMatingPool(fitness);
            fitness = []; //I think I need this here? 
            genBestFit = 0;
            console.log(matingPool.length);
            newGeneration(selectionPool);
        }
    };

    p.evolve = function () {
        //stop evolving
        if (evolving === true) {
            p.noLoop();
            $("#start").html('Evolve!');
            document.getElementById("picInventory").disabled = false;
            evolving = false;
            initial = true;
            loopCounter = 0;
            fitness = [];
            population = [];
            generationCounter = 0;
            genBestFit = 0;
            absBestFit = 0;
            matingPool = [];
            $('#evolvingImg').html("Generation 0");
            $('#bestImg').html("Generation 0, Fitness - 0.00%");
        } else { //start evolving
            p.loop();
            $("#start").html('Stop!');
            document.getElementById("picInventory").disabled = true;
            evolving = true;
        }
    };
};

class DNA {
    constructor() {
        this.vertices = sliderVertex.value();

        genes = [];
        for (var j = 0; j < 4; j++) {
            genes.push(int(random(255)));
        }
        for (var i = 0; i < 2 * this.vertices; i++) {
            if (i % 2 === 0) {
                genes.push(int(random(canvas1e.width / 2)));  //should this be divided by 2?
            } else {
                genes.push(int(random(canvas1e.height / 2)));
            }
        }
        return genes;
    }
}

function calculateFitness() {
    var picFitness = 0;
    var picFitnessPer = 0;
    canvas3e = document.getElementById("defaultCanvas2");

    let ctx1 = canvas1e.getContext("2d");
    let ctx3 = canvas3e.getContext("2d");

    let pixels1 = ctx1.getImageData(0, 0, canvas1e.width, canvas1e.height);
    let pixels3 = ctx3.getImageData(0, 0, canvas3e.width, canvas3e.height);

    var maxDiff = pixels1.data.length * 255 * 4; //absolute max differnce if no rgba values match

    var squareDiff = 0; // have to set it to 0 before each picture
    for (var i = 0; i < pixels1.data.length; i++) {
        var diff = 0; // have to set it to 0 before each pixel
        diff = abs(pixels1.data[i] - pixels3.data[i]);
        squareDiff = squareDiff + diff;
    }
    picFitness = squareDiff / maxDiff;
    picFitnessPer = 1 - picFitness;

    //simple fitness function
//    for (var i = 0; i < pixels1.data.length; i++) {
//        if (pixels1.data[i] === pixels3.data[i]) {
//            picFitness++;
//            picFitnessPer = picFitness / pixels1.data.length;
//        }
//    }
    return picFitnessPer;
}

function createMatingPool(fitnessArray) {
    matingPool = [];
    let normArray = fitnessArray;
    var fitnessCutoff;
    this.cutoff = 100 - sliderSelection.value(); //if user selects 10% i want to take the top 10%
    
    //normalize the fitness array to values between 0 and 1
    for (var j = 0; j < fitnessArray.length; j++) {
        normArray[j] = normArray[j] / genBestFit;
    }
    fitnessCutoff = this.cutoff / 100;
    ///BELOW METHOD IS WRONG THIS IS PASSING TOP 10% FITNESS, NOT TOP 10% MEMBERS
    //go through each individual in fitnessArray if fitness > fitness cutoff
    //add to the matingPool []
    for (var i = 0; i < fitnessArray.length; i++) {
        if (normArray[i] >= fitnessCutoff) {
            matingPool.push(population[i]);
        }
    }
    return matingPool;
}

//new generation not working properly
function newGeneration(matingPool) {
    var clones = 0;
    var offspring = [];
    var plusMinus = 0.5; // need to determine in which direction to mutate (50/50 up or down)
    var mutationAmount = 0.1; //need to determine how much to mutate gene. Keep it low like 10%
    population = [];
    var matingPoolSize = matingPool.length;
    this.mutation = sliderMutation.value();
    
    for (var c = 0; c < clones; c++) {
        population.push(matingPool[c]);
    }

    for (var k = clones; k < sliderPop.value(); k++) {
    //select two random parents from matingPool
    var parent1 = matingPool[int(random(matingPoolSize))];
    var parent2 = matingPool[int(random(matingPoolSize))];
    //create new child
    for (var i = 0; i < parent1.length; i++) {
        if (i % 2 === 0) {
            offspring.push(parent1[i]);
        } else {
            offspring.push(parent2[i]);
        }
    }
    //mutate child which now contains an array of chromosomes with canvas1e
    for(var s = 0; s < offspring.length; s++) {
            //mutate each chromosome
            //var mutate = int(random(100));
        for (var g = 0; g < offspring[s].length; g++) {
            //mutate each gene
            //mutate gene to within 10 percent of current gene
                mutate = int(random(100));
                mutateDirection = random();

            //small mutation
            if (g < 4 && mutate < this.mutation) {
                if (mutateDirection <= plusMinus) {
                    offspring[s][g] = offspring[s][g] - int((offspring[s][g] * mutationAmount));
                    if (offspring[s][g] < 0) {
                        offspring[s][g] = 0;
                    }
                } else {
                    offspring[s][g] = offspring[s][g] + int((offspring[s][g] * mutationAmount));
                    if (offspring[s][g] > 255) {
                        offspring[s][g] = 255;
                    }
                }
                //complete mutation
                //offspring[s][g] = int(random(256));
            } else if (g % 2 === 0 && mutate < this.mutation) {
                //small mutation
                    if (mutateDirection <= plusMinus) {
                    offspring[s][g] = offspring[s][g] - int((offspring[s][g] * mutationAmount));
                    if (offspring[s][g] < 0) {
                        offspring[s][g] = 0;
                    }
                } else {
                    offspring[s][g] = offspring[s][g] + int((offspring[s][g] * mutationAmount));
                    if (offspring[s][g] > canvas1e.width / 2) {
                        offspring[s][g] = canvas1e.width / 2;
                    }
                }
                //complete mutation
//                offspring[s][g] = int(random(canvas1e.width / 2));
            } else if (mutate < this.mutation) {
                //small mutation
                    if (mutateDirection <= plusMinus) {
                    offspring[s][g] = offspring[s][g] - int((offspring[s][g] * mutationAmount));
                    if (offspring[s][g] < 0) {
                        offspring[s][g] = 0;
                    }
                } else {
                    offspring[s][g] = offspring[s][g] + int((offspring[s][g] * mutationAmount));
                    if (offspring[s][g] > canvas1e.height / 2) {
                        offspring[s][g] = canvas1e.height / 2;
                    }
                }
                //complete mutation
                //offspring[s][g] = int(random(canvas1e.height / 2));
            }
        }
    }
    //add mutated child to population
    population.push(offspring);
    offspring = [];
}
    generationCounter++;
    console.log("Generation " + generationCounter);
}

var myp5 = new p5(t, 'canvas1');
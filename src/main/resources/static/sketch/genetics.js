let sliderPop;
let sliderSelection;
let sliderMutation;
let sliderChromosomes;
let sliderVertex;
let evolving = false;
let genCounter;
let numberOfImprovements;
let clock;


/* The working area, used by the fitness function to determine an individuals
 * fitness. This is canvas1 WORKING
 */
var canvas1e;
var canvas1eCtx;
var canvas1eData = [];

/* The output area, where we display the fittest population.
 * This is canvas2 OUTPUT
 */
var canvas2e;
var canvas2eCtx;

/* The reference area, where we display the target image that we are
 * selecting towards. REFERENCE
 * This is canvas 3
 */
var canvas3e;
var canvas3eCtx;
var canvas3eData = [];

/* Genetics options.
 */
var populationSize;
var selectionCutoff;
var mutationChance;
var mutateAmount;


/* Graphics options.
 */
var polygons;
var vertices;

/* Simulation session variables.
 */
var dnaLength;
var highestFitness;
var lowestFitness;
var population;

var t = function (p) {

    p.setup = function () {
        var pCanvas = p.createCanvas(400, 400);
        pCanvas.parent('canvas1');
        pTitle = p.createElement('h3', "Generation 0");
        pTitle.parent('evolvingImg');
        canvas1e = document.getElementById("defaultCanvas0");

        //vertex selector
//        sliderVertex = p.createSlider(3, 9, 6);
//        sliderVertex.style('width', '240px');
//        sliderVertex.parent('vertexSize');
//        sliderVertex.id("vertex-slider");
//        sliderVertex.class("ui-slider");
//        sliderVertex.attribute('name', 'vertices');
        sliderVertex = document.getElementById("vertex-slider");
        //chromosome selector
        sliderChromosomes = document.getElementById("polygon-slider");
        //population size selector
        sliderPop = document.getElementById("population-slider");
        //selection cutoff percentage selector
        sliderSelection = document.getElementById("selection-slider");
        //mutation selector
        sliderMutation = document.getElementById("mutation-slider");

        //start evolution button
        $('#start').hide();
        $('#defaultCanvas0').hide();
        startStop = p.select('#start');
        console.log(startStop);
        startStop.mousePressed(() => {
            startSimulation();
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
        selOutput.innerHTML = selSlider.value + "%";

        selSlider.oninput = function () {
            selOutput.innerHTML = this.value + "%";
        };
        //selection cutoff changes
        var mutSlider = document.getElementById("mutation-slider");
        var mutOutput = document.getElementById("mutation-percent");
        mutOutput.innerHTML = mutSlider.value + "%";

        mutSlider.oninput = function () {
            mutOutput.innerHTML = this.value + "%";
        };
    };
};
var myp5 = new p5(t, 'canvas1');

function getConfiguration() {
    populationSize = sliderPop.value;
    selectionCutoff = sliderSelection.value / 100;
    mutationChance = sliderMutation.value / 100;
    mutateAmount = .1; //10 percent
    polygons = sliderChromosomes.value;
    vertices = sliderVertex.value;
    genCounter = 0;
    numberOfImprovements = 0;
    highestFitness = 0;
    lowestFitness = 100;

    /* Derive certain state variables */
    geneSize = (4 + vertices * 2);
    dnaLength = polygons * (4 + vertices * 2);

    //let's program know that evolution is happening
    evolving = true;

    //set up the canvases here;
    canvas1e = document.getElementById("defaultCanvas0");
    canvas1eCtx = canvas1e.getContext("2d");
    canvas1eData = canvas1eCtx.getImageData(0, 0, canvas1e.width, canvas1e.height);

    canvas2e = document.getElementById("defaultCanvas1");
    canvas2eCtx = canvas2e.getContext("2d"); //Don't think I need this

    canvas3e = document.getElementById("defaultCanvas2");
    canvas3eCtx = canvas3e.getContext("2d");
    canvas3eData = canvas1eCtx.getImageData(0, 0, canvas3e.width, canvas3e.height);
}

/*
 * Start the simulation.
 */
function startSimulation() {
    if (!isStopped()) {
        getConfiguration();
        //disable picture selection
        document.getElementById("picInventory").disabled = true;
        //disable sliders
        document.getElementById("polygon-slider").disabled = true;
        document.getElementById("vertex-slider").disabled = true;
        document.getElementById("population-slider").disabled = true;
        document.getElementById("selection-slider").disabled = true;
        document.getElementById("mutation-slider").disabled = true;
        //disable save/delete
        $("#save-picture").attr('disabled', true);
        $("#delete-picture").attr('disabled', true);
        $('#start').text('Stop!');
        runSimulation();
    } else {
        stopSimulation();
    }
}

//determines if an evolution is happening
function isStopped() {
    return evolving;
}

/*
 * Run the simulation.
 */
function runSimulation() {
    if (isStopped() && genCounter < 1) {
        population = new Population(populationSize);
        genCounter++;
        $('#evolvingImg').html("Generation " + genCounter);
        $('#bestImg').html("Generation " + genCounter + ", Fitness - " + (highestFitness).toFixed(2) + "%");
    }

    /* Each tick produces a new population and new fittest */
    function tick() {

        /* Breed a new generation */
        population.iterate();
        genCounter++;
        $('#evolvingImg').html("Generation " + genCounter);        

        var fittest = population.getFittest();
        var currentFitness = (fittest.fitness * 100);

        if (currentFitness > highestFitness) {
            highestFitness = currentFitness;
            /* Improvement was made */
            numberOfImprovements++;
            //Update titles of canvases
            $('#bestImg').html("Generation " + genCounter + ", Fitness - " + (highestFitness).toFixed(2) + "%");            
        } else if (currentFitness < lowestFitness) {
            lowestFitness = currentFitness;
        }
        /* Draw the best fit to output */
        fittest.draw(canvas2eCtx, canvas2e.width, canvas2e.height);
    }
    
    
    /* Begin the master clock */
    clock = setInterval(tick, 0);
}

  /*
   * End the simulation.
   */
  function stopSimulation() {
    population = null;
    clearInterval(clock);
    clock = null;
    highestFitness = 0;
    lowestFitness = 100;
    evolving = false;
    //enable select menu
    document.getElementById("picInventory").disabled = false;
    //enable sliders
    document.getElementById("polygon-slider").disabled = false;
    document.getElementById("vertex-slider").disabled = false;
    document.getElementById("population-slider").disabled = false;
    document.getElementById("selection-slider").disabled = false;
    document.getElementById("mutation-slider").disabled = false;
    //enable save/delete
    $("#save-picture").attr('disabled', true);
    $("#delete-picture").attr('disabled', true);
    /* Clear the drawing */
    //canvas2eCtx.clearRect(0, 0, canvas2e.width, canvas2e.height);
    //canvas1eCtx.clearRect(0, 0, canvas1e.width, canvas1e.height);

    $('#start').text('Evolve!');
  }
  
    /*
   * Creates a new individual. Each individual comprises of their string of DNA,
   * and their fitness. In addition, a draw() method is provided for visualising
   * the individual. If mother and father are omitted, a random individual is
   * generated.
   */
  function Individual(mother, father) {

    /* The individual's genetic composition */
    this.dna = [];

    if (mother && father) {

      /*
       * Breed from mother and father:
       */

      for (var i = 0; i < dnaLength; i += geneSize) {

        /* The parent's gene which will be inherited */
        var inheritedGene;

        /* Inherit genes evenly from both parents */
        inheritedGene = (Math.random() < 0.5) ? mother : father;

        /*
         * Create the genes:
         */
        for (var j = 0; j < geneSize; j++) {

          /* The DNA strand */
          var dna = inheritedGene[i + j];

          /* Mutate the gene */
          if (Math.random() < mutationChance) {

            /* Apply the random mutation */
            dna += Math.random() * mutateAmount * 2 - mutateAmount;

            /* Keep the value in range */
            if (dna < 0) {
              dna = 0;
            }

            if (dna > 1) {
              dna = 1;
            }
          }

          this.dna.push(dna);
        }
      }

    } else {

      /*
       * Generate a random individual:
       */

      for (var g = 0; g < dnaLength; g += geneSize) {

        /* Generate RGBA color values */
        this.dna.push(Math.random(), // R
                      Math.random(), // G
                      Math.random(), // B
                      Math.max(Math.random() * Math.random(), 0.2)); // A

        /* Generate XY positional values */
        var x = Math.random();
        var y = Math.random();

        for (var j = 0; j < vertices; j++) {
          this.dna.push(x + Math.random() - 0.5, // X
                        y + Math.random() - 0.5); // Y
        }
      }
    }

    /*
     * Determine the individual's fitness:
     */

    this.draw(canvas1eCtx, canvas1e.width, canvas1e.height);

    var imageData = canvas1eCtx.getImageData(0, 0, canvas1e.width, canvas1e.height).data;
    var targetImageData = canvas3eCtx.getImageData(0, 0, canvas3e.width, canvas3e.height).data;
    var diff = 0;

    /*
     * Sum up the difference between the pixel values of the reference
     * image and the current individual. Subtract the ratio of this
     * difference and the largest possible difference from 1 in order
     * to get the fitness.
     */
    // Sum differences.
    for (var p = 0; p < canvas1e.width * canvas1e.height * 4; p++)
        diff += Math.abs(imageData[p] - targetImageData[p]);

    this.fitness = 1 - diff / (canvas1e.width * canvas1e.height * 4 * 256);
    }

  /*
   * Draw a representation of a DNA string to a canvas.
   */
  Individual.prototype.draw = function(ctx, width, height) {

    /* Set the background */
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    /*
     * Draw each gene sequentially:
     */
    for (var g = 0; g < dnaLength; g += geneSize) {

      /* Draw the starting vertex */
      ctx.beginPath();
      ctx.moveTo(this.dna[g + 4] * width, this.dna[g + 5] * height);

      /* Create each vertices sequentially */
      for (var i = 0; i < vertices - 1; i++) {
        ctx.lineTo(this.dna[g + i * 2 + 6] * width,
                   this.dna[g + i * 2 + 7] * height);
      }

      ctx.closePath();

      var styleString = 'rgba(' +
          ((this.dna[g] * 255) >> 0) + ',' + // R - int [0,255]
          ((this.dna[g + 1] * 255) >> 0) + ',' + // G - int [0,255]
          ((this.dna[g + 2] * 255) >> 0) + ',' + // B - int [0,255]
          this.dna[g + 3] + ')'; // A - float [0,1]

        /*
         * Create a polygon:
         */
        ctx.fillStyle = styleString;
        ctx.fill();
    }
  };

  /*
   * This object represents a entire population, composed of a number of
   * individuals. It provides a iterate() function to breed a new generation.
   */
  function Population(size) {
    this.individuals = [];

    /* Generate our random starter culture */
    for (var i = 0; i < size; i++)
      this.individuals.push(new Individual());

  }

  /*
   * Breed a new generation.
   */
  Population.prototype.iterate = function() {

    if (this.individuals.length > 1) {

      /*
       * Breed a new generation:
       */

      var size = this.individuals.length;
      var offspring = [];

      /* The number of individuals from the current generation to select for
       * breeding
       */
      //changed from floor to ceil
      var selectCount = Math.floor(this.individuals.length * selectionCutoff);
      
      if (selectCount < 2) {
          selectCount = 2;
      }

      /* The number of individuals to randomly generate */
      var randCount = Math.ceil(1 / selectionCutoff);

      this.individuals = this.individuals.sort(function(a, b) {
        return b.fitness - a.fitness;
      });

      for (var i = 0; i < selectCount; i++) {

        for (var j = 0; j < randCount; j++) {
          var randIndividual = i;

          while (randIndividual === i)
            randIndividual = (Math.random() * selectCount) >> 0;

          offspring.push(new Individual(this.individuals[i].dna,
                                        this.individuals[randIndividual].dna));
        }
      }

      this.individuals = offspring;

      this.individuals.length = size;

    } else {

      /*
       * Asexual reproduction:
       */

      var parent = this.individuals[0];
      var child = new Individual(parent.dna, parent.dna);

      if (child.fitness > parent.fitness)
        this.individuals = [child];

    }
  };


  /*
   * Return the fittest individual from the population.
   */
  Population.prototype.getFittest = function() {

    return this.individuals.sort(function(a, b) {
      return b.fitness - a.fitness;
    })[0];

  };
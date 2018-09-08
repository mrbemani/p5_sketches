// sketch for ga_shortest_path


var cities = [];
let totalCities = 10; 

var recordDistance = Infinity;
var bestEver;

var population = [];
let popSize = 50000;

var currentGenerationBest;
var currentGenerationShortestDist = Infinity;

var generationidx = 1;

function swap(a, i, j) {
	var temp = a[i];
	a[i] = a[j];
	a[j] = temp;
}

function DNA(gene) {
	this.gene = gene;
	this.fitness = 0;
	
	this.mutate = function () {
		for (let i = 0; i < this.gene.length; i++) {
			let p = random(1.0);
			if (p < 0.01) {
				let n = floor(random(this.gene.length));
				let idx1 = this.gene[n];
				let idx2 = this.gene[(n + 1) % this.gene.length];
				let t = this.gene[idx1];
				this.gene[idx1] = this.gene[idx2];
				this.gene[idx2] = t;
			}
		}
	}

	this.mutate();
}

function pickOne(elems) {
	var index = 0;
	var r = random(1);
	
	while (r > 0) {
		r = r - elems[index].fitness;
		index++;
	}
	index--;
	return elems[index];
}

function normalizeFitness() {
	var maxf = max(population.map(i => i.fitness));
	for (let i = 0; i < population.length; i++) {
		population[i].fitness = population[i].fitness / maxf;
	}
}

function calcFitness() {
	for (let i = 0; i < population.length; i++) {
		var d = calcDistance(cities, population[i].gene);
		if (d < currentGenerationShortestDist) {
			currentGenerationShortestDist = d;
			currentGenerationBest = population[i].gene.slice();
		}
		if (d < recordDistance) {
			recordDistance = d;
			bestEver = population[i].gene.slice();
		}
		population[i].fitness = 1 / (d + 1);
	}
}

function crossOver(a, b) {
	var gene1 = a.gene;
	var gene2 = b.gene;
	if (a.fitness > b.fitness) {
		
	}
}

function nextGeneration() {
	var newPopulation = [];
	currentGenerationBest = null;
	currentGenerationShortestDist = Infinity;
	for (let i = 0; i < population.length; i++) {
		var theOne = pickOne(population);
		newPopulation[i] = new DNA(theOne.gene);
	}
	population = newPopulation;
	generationidx += 1;
}

function calcDistance(points, order) {
	var sum = 0;
	for (let i = 0; i < order.length - 1; i++) {
		var cityAIndex = order[i];
		var cityA = points[cityAIndex];
		var cityBIndex = order[i + 1];
		var cityB = points[cityBIndex];
		var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
		sum += d;
	}
	return sum;
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	var order = [];
	for (let i = 0; i < totalCities; i++) {
		var v = createVector(random(width), random(height / 3));
		cities[i] = v;
		order[i] = i;
	}

	for (let i = 0; i < popSize; i++) {
		population[i] = new DNA(shuffle(order.slice()));
	}

	calcFitness();
	normalizeFitness();

	print ("start");
}

function draw() {
	background(255);

	nextGeneration();
	calcFitness();
	normalizeFitness();

	
	textSize(22);
	stroke(0);

	fill(33);
	text("Generation: " + generationidx, 10, 30);
	text("Best Order: " + bestEver, 10, 60);
	text("Shortest: " + recordDistance, 10, 90);
	
	translate(0, 140);

	noFill();
	beginShape();
	for (let i = 0; i < bestEver.length; i++) {
		var n = bestEver[i];
		var c = cities[n];
		vertex(c.x, c.y);
		ellipse(c.x, c.y, 10, 10);
		text(i, c.x, c.y);
	}
	endShape();

	translate(0, height/3 + 20);

	beginShape();
	for (let i = 0; i < currentGenerationBest.length; i++) {
		var n = currentGenerationBest[i];
		var c = cities[n];
		vertex(c.x, c.y);
		ellipse(c.x, c.y, 10, 10);
		text(i, c.x, c.y);
	}
	endShape();


}
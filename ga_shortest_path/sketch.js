// sketch for ga_shortest_path


var cities = [];
let totalCities = 30; 

var handcrafted_path = [];

var recordDistance = Infinity;
var bestEver;
var bestGeneration = 0;

var population = [];
let popSize = 3000;

let visual_sample_size = 55;
let visual_sample_step = Math.floor(popSize / visual_sample_size);

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
		if (random(1.0) < 0.001) {
			this.gene = shuffle(this.gene);
			return;
		}
		if (random(1.0) < 0.001) {
			if (random(1.0) < 0.5) {
				this.gene.reverse();
			}
			var c = this.gene.splice(0, 1);
			this.gene.push(c);
			return;
		}

		if (random(1.0) < 0.01) {
			var gapDist = -2;
			var longest = -1;
			while(gapDist < longest)
			{
				// exchange longest with gap if gap smaller than longest 
				lastCity = this.gene[(this.gene.length - 1)];
				firstCity = this.gene[0];
				gapDist = lookUpDist(lastCity, firstCity);
				longest = -1;
				lidx = -1;
				for (let i = 0; i < this.gene.length - 1; i++) {
					var d = lookUpDist(this.gene[i], this.gene[i+1]);
					if (d > longest) {
						longest = d;
						lidx = i;
					}
				}
				if (gapDist < longest) {
					for (let s = 0; s <= lidx; s++) {
						this.gene.push(this.gene.shift());
					}
				}
			}
			if (random(1.0) < 0.618)
			{
				for (let i = 2; i < this.gene.length - 1; ++i)
				{
					lastCity = this.gene[(this.gene.length - 1)];
					firstCity = this.gene[0];
					var c0 = this.gene[i-1];
					var c1 = this.gene[i];
					var c2 = this.gene[i+1];
					var d_0 = lookUpDist(c1, c0);
					var d_2 = lookUpDist(c1, c2);
					var d_s = lookUpDist(c1, firstCity);
					var d_e = lookUpDist(c1, lastCity);
					if (d_0 > d_s) {
						var r = this.gene.slice(0, i);
						r.reverse();
						var newGene = r.concat(this.gene.slice(i));
						if (calcDistance(cities, newGene) < calcDistance(cities, this.gene))
						{
							this.gene = newGene.slice();
							i = 2;
							continue;
						}
					}
					if (d_2 > d_e) {
						var r = this.gene.slice(i);
						r.reverse();
						var newGene = this.gene.slice(0, i).concat(r).slice();
						if (calcDistance(cities, newGene) < calcDistance(cities, this.gene))
						{
							this.gene = newGene.slice();
							i = 2;
							continue;
						}
					}
				}
			}
		}
		for (let i = 0; i < this.gene.length; i++) {
			let p = random(1.0);
			if (p < 0.2) {
				let n = floor(random(this.gene.length));
				let idx1 = this.gene[n];
				let idx2 = this.gene[(n + floor(random(this.gene.length))) % this.gene.length];
				swap(this.gene, idx1, idx2);
			}
		}
	}
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
	var maxf = max(population.map(i => i.fitness)) * 1.1;
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
			bestGeneration = generationidx;
		}
		population[i].fitness = 1 / (d + 1);
	}
}

function crossOver(a, b) {
	var gene_len = a.gene.length;
	var gene1 = a.gene.slice();
	var gene2 = b.gene.slice();
	var gene = gene1.concat(gene2);
	var childGene = [];
	for (var i = 0; i < gene_len; ++i) 
	{
		var gene_idx = floor(random(gene_len));
		var cityIdx = -1;
		while (cityIdx < 0) {
			cityIdx = gene.splice(max(gene.length-1, gene_idx), 1)[0];
			if (childGene.indexOf(cityIdx) >= 0) {
				cityIdx = -1;
			} else {
				childGene.push(cityIdx);
			}
		}
		cityIdx = -1;
	}
	return childGene.slice();
}

function nextGeneration() {
	var newPopulation = [];
	currentGenerationBest = null;
	currentGenerationShortestDist = Infinity;
	for (let i = 0; i < popSize; i++) {
		var theOne = pickOne(population);
		var theTwo = pickOne(population);
		var theChildGene = crossOver(theOne, theTwo); //theOne.gene;//crossOver(theOne, theTwo);
		//print (theChildGene, theOne.gene, theTwo.gene)
		newPopulation[i] = new DNA(theChildGene);
		newPopulation[i].mutate();
	}
	population = newPopulation;
	/*
	if (random(1.0) < 0.1) {
		population[population.length] = new DNA(bestEver.slice());
		population[population.length-1].mutate();
	}
	*/
	generationidx += 1;
}

function calcDistance(points, order) {
	var sum = 0;
	if (points.length < 1) return 0;
	for (let i = 0; i < order.length - 1; i++) {
		var cityAIndex = order[i];
		var cityBIndex = order[i + 1];
		var d = lookUpDist(cityAIndex, cityBIndex);
		sum += d;
	}
	return sum;
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	var order = [];
	for (let i = 0; i < totalCities; i++) {
		var v = createVector(random(width) / 2, random(height / 3));
		cities[i] = v;
		order[i] = i;
	}

	console.log("totalCities: " + totalCities);

	calcAllDistances(cities);

	for (let i = 0; i < popSize; i++) {
		population[i] = new DNA(shuffle(order.slice()));
	}

	calcFitness();
	normalizeFitness();

	print ("start");
}

function draw() {
	background(222);

	nextGeneration();
	calcFitness();
	normalizeFitness();
	population.sort((a, b) => b.fitness - a.fitness);
	
	textSize(22);
	strokeWeight(3);
	stroke(0);
	fill(200, 200, 0);
	text("基因遗传算法演示", 10, 40);
	stroke(0);
	strokeWeight(1);
	fill(33);
	textSize(14);
	text("当前繁殖到第 " + generationidx + " 代", 10, 60);
	//text("Best Order: " + bestEver, 10, 60);
	text("目前最优秀代: " + bestGeneration, 10, 80);
	text("当前" + totalCities + "个点最短路径长度为 " + int(recordDistance) + " 像素", 10, 100);
	
	translate(width / 4.0, 140);

	noFill();
	textSize(8);
	stroke(255, 0, 0);
	beginShape();
	for (let i = 0; i < bestEver.length; i++) {
		var n = bestEver[i];
		var c = cities[n];
		vertex(c.x, c.y);
		push();
		stroke(0, 0, 255);
		ellipse(c.x, c.y, 5, 5);
		pop();
		/*
		push();
		stroke(255,0,0);
		text(n, c.x - 6, c.y + 5);
		pop();
		*/
	}
	endShape();

	translate(-width / 4.0, height / 3.0 + 20);

	
	stroke(77);
	var nn = 1;
	var pidx = 0;
	var prev = -1;
	while (nn < min(visual_sample_size, population.length))
	{
		var p = population[pidx];
		prev = pidx - 1;
		if (prev >= 0 && JSON.stringify(population[prev].gene) == JSON.stringify(p.gene)) 
		{
			pidx += 1;
			if (pidx >= population.length) nn = pidx;
			continue;
		}
		beginShape();
		for (let i = 0; i < p.gene.length; i++) {
			var n = p.gene[i];
			var c = cities[n];
			vertex(c.x * 0.2, c.y * 0.2);
			ellipse(c.x * 0.2, c.y * 0.2, 3, 3);
			//text(i, c.x * 0.1, c.y * 0.1);
		}
		endShape();
		translate(width / 9.0, 0);
		if ((nn % 9.0) == 0) {
			translate(-width, height / 20.0 + 8);

		}
		pidx += visual_sample_step;
		nn += 1;
		if (pidx >= population.length) {
			nn = pidx;
		}
	}
}
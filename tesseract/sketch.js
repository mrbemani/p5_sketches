
var tesseract = [
	[-1.0, -1.0, -1.0, -1.0],
	[ 1.0, -1.0, -1.0, -1.0],
	[ 1.0,  1.0, -1.0, -1.0],
	[-1.0,  1.0, -1.0, -1.0],
	[-1.0, -1.0,  1.0, -1.0],
	[ 1.0, -1.0,  1.0, -1.0],
	[ 1.0,  1.0,  1.0, -1.0],
	[-1.0,  1.0,  1.0, -1.0],
	[-1.0, -1.0, -1.0,  1.0],
	[ 1.0, -1.0, -1.0,  1.0],
	[ 1.0,  1.0, -1.0,  1.0],
	[-1.0,  1.0, -1.0,  1.0],
	[-1.0, -1.0,  1.0,  1.0],
	[ 1.0, -1.0,  1.0,  1.0],
	[ 1.0,  1.0,  1.0,  1.0],
	[-1.0,  1.0,  1.0,  1.0],
  ];
  
  var shape_connections = [
	[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 5], [2, 6], [3, 7],
	[4, 5], [5, 6], [6, 7], [7, 4], [4, 12], [5, 13], [6, 14], [7, 15],
	[12, 13], [13, 14], [14, 15], [15, 12],  [0, 8], [1, 9], [2, 10], [3, 11],
	[8, 9], [9, 10], [10, 11], [11, 8], [8, 12], [9, 13], [10, 14], [11, 15],
  ];
  
  
  var seven_simplex = [
	[-1, -1, -1, -1, -1, -1, -1],
	[ 1, -1, -1, -1, -1, -1, -1],
	[ 1,  1, -1, -1, -1, -1, -1],
	[ 1,  1,  1, -1, -1, -1, -1],
	[ 1,  1,  1,  1, -1, -1, -1],
	[ 1,  1,  1,  1,  1, -1, -1],
	[ 1,  1,  1,  1,  1,  1, -1],
	[ 1,  1,  1,  1,  1,  1,  1]
  ];
  
  var five_simplex = [
	[-1, -1, -1, -1,  1],
	[ 1,  1, -1, -1, -1],
	[-1,  1,  1, -1, -1],
	[-1, -1,  1,  1, -1],
	[-1, -1, -1,  1,  1],
	[ 1, -1, -1, -1,  1],
  ];
  
  var five_cell = [
	[ 1, -1, -1, -1],
	[-1,  1, -1, -1],
	[-1, -1,  1, -1],
	[-1, -1, -1,  1],
	[ 1,  1,  1,  1],
  ];
  
  var angle = 0.0;
  
  function matmulvec(mat, vec) {
	if (mat[0].length != vec.length) return null;
	var out_vec = new Array(mat.length);
	for (var i = 0 ; i < mat.length; ++i)
	{
	  out_vec[i] = 0;
	  for (var j = 0; j < mat[i].length; ++j)
	  {
		out_vec[i] += mat[i][j]*vec[j];
	  }
	}
	return out_vec;
  }
  
  function connectAllPoints(obj) {
	for (var i = 0; i < obj.length - 1; ++i) {
	  for (var j = i + 1; j < obj.length; ++j) {
		line(obj[i][0], obj[i][1], obj[i][2], obj[j][0], obj[j][1], obj[j][2]);
	  }
	}
  }
  
  function createProjectMat(n, m, d, pt) {
	var mat = new Array(m);
	for (var i = 0; i < m; ++i) {
	  mat[i] = new Array(n);
	  for (var j = 0; j < n; ++j) {
		if (j == i) {
		  mat[i][j] = 1.0 / (float(d) - pt[pt.length - 1]);
		} else {
		  mat[i][j] = 0.0;
		}
	  }
	}
	return mat;
  }
  
  function rotateZW(angle, pt4d) {
	var rad = PI / 180.0 * angle;
	var rotmat = [
	  [1, 0, 0, 0],
	  [0, 1, 0, 0],
	  [0, 0, cos(rad), -sin(rad)],
	  [0, 0, sin(rad),  cos(rad)],
	];
	
	return matmulvec(rotmat, pt4d);
  }
  
  function rotate45(angle, pt5d) {
	var rad = PI / 180.0 * angle;
	var rotmat45 = [
	  [1, 0, 0, 0, 0],
	  [0, 1, 0, 0, 0],
	  [0, 0, 1, 0, 0],
	  [0, 0, 0, cos(rad), -sin(rad)],
	  [0, 0, 0, sin(rad),  cos(rad)],
	];
	
	return matmulvec(rotmat45, pt5d);
  }
  
  
  function rotate4567(angle, pt7d) {
	var rad = PI / 180.0 * angle;
	var rotmat67 = [
	  [1, 0, 0, 0, 0, 0, 0],
	  [0, 1, 0, 0, 0, 0, 0],
	  [0, 0, 1, 0, 0, 0, 0],
	  [0, 0, 0, 1, 0, 0, 0],
	  [0, 0, 0, 0, 1, 0, 0],
	  [0, 0, 0, 0, 0, cos(rad), -sin(rad)],
	  [0, 0, 0, 0, 0, sin(rad),  cos(rad)],
	];
	
	var rotmat45 = [
	  [1, 0, 0, 0, 0, 0, 0],
	  [0, 1, 0, 0, 0, 0, 0],
	  [0, 0, 1, 0, 0, 0, 0],
	  [0, 0, 0, cos(rad), -sin(rad), 0, 0],
	  [0, 0, 0, sin(rad),  cos(rad), 0, 0],
	  [0, 0, 0, 0, 0, 1, 0],
	  [0, 0, 0, 0, 0, 0, 1],
	];
	
	return matmulvec(rotmat67, matmulvec(rotmat45, pt7d));
  }
  
  
  function stereographic_project(d, pt) {
	var last_elem = pt[pt.length-1];
	var target_len = pt.length - 1;
	var projmat = createProjectMat(pt.length, target_len, d, pt);
	var projected_pt = matmulvec(projmat, pt);
	return projected_pt;
  }
  
  function connect(pt1, pt2) {
	line(pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2]);
  }
  
  
  function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
  }
  
  function draw() {
	background(0);
	translate(0, 0, -500);
	push();
	
	orbitControl();
	push();
	
	rotateX(PI/2.0);
	
	push();
	
	rotateZ(angle*PI/180.0);
	angle+=0.8;
	
	fill(255);
	stroke(255);
	strokeWeight(10);
	
	var projected_obj = new Array();
	var scaler = 190.0 * (windowWidth / 1024);
	
	
	for (var i = 0; i < tesseract.length; ++i)
	{
		push();
		var rotated_pt = rotateZW(angle, tesseract[i]);
		var pt = stereographic_project(2, rotated_pt);
		projected_obj.push([pt[0] * scaler, pt[1] * scaler, pt[2] * scaler]);
		translate(projected_obj[i][0], projected_obj[i][1], projected_obj[i][2]);
		sphere(5);
		pop();
	}
	
	
	/*
	for (var i = 0; i < five_cell.length; ++i)
	{
	  push();
	  var rotated_pt = rotateZW(angle, five_cell[i]);
	  var pt = stereographic_project(2, rotated_pt);
	  projected_obj.push([pt[0] * scaler, pt[1] * scaler, pt[2] * scaler]);
	  translate(projected_obj[i][0], projected_obj[i][1], projected_obj[i][2]);
	  sphere(5);
	  pop();
	}
	*/
	
	stroke(255, 255, 0);
	strokeWeight(3);
	//connectAllPoints(projected_obj);
	
	for (var i = 0; i < shape_connections.length; ++i)
	{
	  connect(projected_obj[shape_connections[i][0]], projected_obj[shape_connections[i][1]]);
	}
	
	pop();
	pop();
	pop();
	
  }

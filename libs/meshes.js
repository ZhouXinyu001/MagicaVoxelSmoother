function createMesh_cube(gl, size)
{
	size = (size ? size : 1) * 0.5;
	const result = { vertices: gl.createBuffer(), normals: gl.createBuffer(), faces: gl.createBuffer(), elementCount: 36 };

	gl.bindBuffer(gl.ARRAY_BUFFER, result.vertices);
	const vertices = [
		// Front face
		-size, -size, +size,
		+size, -size, +size,
		+size, +size, +size,
		-size, +size, +size,

		// Back face
		-size, -size, -size,
		-size, +size, -size,
		+size, +size, -size,
		+size, -size, -size,

		// Top face
		-size, +size, -size,
		-size, +size, +size,
		+size, +size, +size,
		+size, +size, -size,

		// Bottom face
		-size, -size, -size,
		+size, -size, -size,
		+size, -size, +size,
		-size, -size, +size,

		// Right face
		+size, -size, -size,
		+size, +size, -size,
		+size, +size, +size,
		+size, -size, +size,

		// Left face
		-size, -size, -size,
		-size, -size, +size,
		-size, +size, +size,
		-size, +size, -size,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, result.normals);
	const normals = [
		// Front
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,

		// Back
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,
		 0.0,  0.0, -1.0,

		// Top
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,

		// Bottom
		 0.0, -1.0,  0.0,
		 0.0, -1.0,  0.0,
		 0.0, -1.0,  0.0,
		 0.0, -1.0,  0.0,

		// Right
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,

		// Left
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result.faces);
	const faces = [
		0,  1,  2,    0,  2,  3,	// front
		4,  5,  6,    4,  6,  7,	// back
		8,  9,  10,   8,  10, 11,	// top
		12, 13, 14,   12, 14, 15,	// bottom
		16, 17, 18,   16, 18, 19,	// right
		20, 21, 22,   20, 22, 23,	// left
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

	return result;
}



function createMesh_corner(gl, size)
{
	size = (size ? size : 1) * 0.5;
	const result = { vertices: gl.createBuffer(), normals: gl.createBuffer(), faces: gl.createBuffer(), elementCount: 12 };

	gl.bindBuffer(gl.ARRAY_BUFFER, result.vertices);
	const vertices = [
		// Front
		-size, -size, +size,
		+size, -size, +size,
		+size, +size, -size,
		-size, +size, -size,

		// Side 1
		-size, -size, +size,
		-size, +size, -size,
		-size, -size, -size,

		// Side 2
		+size, -size, +size,
		+size, -size, -size,
		+size, +size, -size,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, result.normals);
	const normals = [
		// Front
		 0.0,  0.707107,  0.707107,
		 0.0,  0.707107,  0.707107,
		 0.0,  0.707107,  0.707107,
		 0.0,  0.707107,  0.707107,

		// Side 1
		 -1.0,  0.0,  0.0,
		 -1.0,  0.0,  0.0,
		 -1.0,  0.0,  0.0,

		// Side 2
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result.faces);
	const faces = [
		0,  1,  2,    0,  2,  3,	// front
		4,  5,  6,    7,  8,  9,	// sides
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

	return result;
}

function createMesh_embed(gl, size)
{
	size = (size ? size : 1) * 0.5;
	const result = { vertices: gl.createBuffer(), normals: gl.createBuffer(), faces: gl.createBuffer(), elementCount: 12 };

	gl.bindBuffer(gl.ARRAY_BUFFER, result.vertices);
	const vertices = [
		// Front
		-size, +size, +size,
		+size, -size, +size,
		+size, +size, -size,

		// Side 1
		+size, -size, +size,
		+size, -size, -size,
		+size, +size, -size,

		// Side 2
		-size, +size, +size,
		+size, +size, -size,
		-size, +size, -size,

		// Side 3
		-size, +size, +size,
		-size, -size, +size,
		+size, -size, +size,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, result.normals);
	const normals = [
		// Front
		 0.577350,  0.577350,  0.577350,
		 0.577350,  0.577350,  0.577350,
		 0.577350,  0.577350,  0.577350,

		// Side 1
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,
		 1.0,  0.0,  0.0,

		// Side 2
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,

		// Side 3
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result.faces);
	const faces = [
		0,  1,  2,	// front
		3,  4,  5,	// side 1
		6,  7,  8,	// side 2
		9, 10, 11,	// side 3
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

	return result;
}

function createMesh_outbed(gl, size)
{
	size = (size ? size : 1) * 0.5;
	const result = { vertices: gl.createBuffer(), normals: gl.createBuffer(), faces: gl.createBuffer(), elementCount: 3 };

	gl.bindBuffer(gl.ARRAY_BUFFER, result.vertices);
	const vertices = [
		// Front
		-size, -size, +size,
		+size, -size, -size,
		-size, +size, -size,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, result.normals);
	const normals = [
		// Front
		 0.577350,  0.577350,  0.577350,
		 0.577350,  0.577350,  0.577350,
		 0.577350,  0.577350,  0.577350,

	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result.faces);
	const faces = [
		0,  1,  2,	// front
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

	return result;
}

function createMesh_sideCorner(gl, size)
{
	size = (size ? size : 1) * 0.5;
	const result = { vertices: gl.createBuffer(), normals: gl.createBuffer(), faces: gl.createBuffer(), elementCount: 9 };

	gl.bindBuffer(gl.ARRAY_BUFFER, result.vertices);
	const vertices = [
		// Front
		-size, -size, +size,
		-size, -size, -size,
		+size, +size, +size,

		// Back
		+size, +size, +size,
		-size, +size, -size,
		-size, +size, +size,

		// Bottom
		+size, +size, +size,
		-size, -size, -size,
		-size, +size, -size,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, result.normals);
	const normals = [
		// Front
		 0.707107,  -0.707107,  0.0,
		 0.707107,  -0.707107,  0.0,
		 0.707107,  -0.707107,  0.0,

		// Back
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,
		 0.0,  1.0,  0.0,

		// Bottom
		 0.707107,  0.0,  -0.707107,
		 0.707107,  0.0,  -0.707107,
		 0.707107,  0.0,  -0.707107,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result.faces);
	const faces = [
		0,  1,  2,	// front
		3,  4,  5,	// back
		6,  7,  8,	// bottom
	];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);

	return result;
}

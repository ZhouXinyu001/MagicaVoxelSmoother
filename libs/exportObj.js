
function exportObj(name, data)
{
	// Fill OBJ data structure
	let v = [];
	let vt_colorToIndex = {};
	let vt_indexToColor = [];
	let f = [];
	for (let i = 0; i < voxData.models.length; i++)
	{
		const model = voxData.models[i];

		let mesh = meshes[SmoothType.ORIGINAL].mesh;
		for (let i = 0; i < model.voxels.length; i++)
		{
			let voxel = model.voxels[i];
			if (!voxel.enabled || voxel.culled)
			{
				continue;
			}

			// color
			let colorIndex = 1;
			if (vt_colorToIndex.hasOwnProperty(voxel.color))
			{
				colorIndex = vt_colorToIndex[voxel.color];
			}
			else
			{
				vt_indexToColor.push(voxel.color);
				colorIndex = vt_colorToIndex[voxel.color] = vt_indexToColor.length;
			}

			// vertices
			let vStart = v.length+1;
			for (let i = 0; i < mesh.vertices.length; i += 3)
			{
				v.push({ x: mesh.vertices[i+0]+voxel.x-model.centerOffset.x, y: mesh.vertices[i+1]+voxel.y-model.centerOffset.y, z: mesh.vertices[i+2]+voxel.z });
				
			}

			// faces
			for (let i = 0; i < mesh.faces.length; i += 3)
			{
				f.push({ v1: mesh.faces[i]+vStart, v2: mesh.faces[i+1]+vStart, v3: mesh.faces[i+2]+vStart, c: colorIndex });
			}
		}

		for (let i = 0; i < model.smoothVoxels.length; i++)
		{
			let voxel = model.smoothVoxels[i];
			if (!voxel.enabled)
			{
				continue;
			}
			mesh = meshes[voxel.pattern].mesh;
			let orientation = getOrientationMatrix(voxel.orientation);

			// color
			let colorIndex = 1;
			if (vt_colorToIndex.hasOwnProperty(voxel.color))
			{
				colorIndex = vt_colorToIndex[voxel.color];
			}
			else
			{
				vt_indexToColor.push(voxel.color);
				colorIndex = vt_colorToIndex[voxel.color] = vt_indexToColor.length;
			}

			// vertices
			let vStart = v.length+1;
			for (let i = 0; i < mesh.vertices.length; i += 3)
			{
				let vertex = vec3.fromValues(mesh.vertices[i], mesh.vertices[i+1], mesh.vertices[i+2]);
				vec3.transformMat4(vertex, vertex, orientation);
				v.push({ x: vertex[0]+voxel.x-model.centerOffset.x, y: vertex[1]+voxel.y-model.centerOffset.y, z: vertex[2]+voxel.z });
			}

			// faces
			for (let i = 0; i < mesh.faces.length; i += 3)
			{
				f.push({ v1: mesh.faces[i]+vStart, v2: mesh.faces[i+1]+vStart, v3: mesh.faces[i+2]+vStart, c: colorIndex });
			}
		}
	}

	// Create OBJ string
	let result = {};
	result.obj = "mtllib " + name + ".mtl\nusemtl palette\n";
	for (let i = 0; i < v.length; i++)
	{
		result.obj += "v " + (v[i].x*-1) + " " + v[i].z + " " + v[i].y + "\n";
	}
	for (let i = 0; i < vt_indexToColor.length; i++)
	{
		result.obj += "vt " + ((vt_indexToColor[i]-0.5) / 256) + " 0.5\n";
	}
	for (let i = 0; i < f.length; i++)
	{
		result.obj += "f " + f[i].v1 + "/" + f[i].c + " " + f[i].v2 + "/" + f[i].c + " " + f[i].v3 + "/" + f[i].c + "\n";
	}

	// Create MTL string
	result.mtl = "newmtl palette\nmap_Kd " + name + ".png";

	// Create PNG img
	let canvas = document.createElement('canvas');
	canvas.height = 1;
	canvas.width = 256;
	let context = canvas.getContext("2d");
	let imageData = context.createImageData(256, 1);
	for (var i = 0; i < 256; i++)
	{
		imageData.data[i*4+0] = voxData.palette[i].r * 256;
		imageData.data[i*4+1] = voxData.palette[i].g * 256;
		imageData.data[i*4+2] = voxData.palette[i].b * 256;
		imageData.data[i*4+3] = voxData.palette[i].a * 256;
	}
	context.putImageData(imageData, 0, 0);
	result.png = canvas.toDataURL("image/png");

	// Return created file content
	return result;
}
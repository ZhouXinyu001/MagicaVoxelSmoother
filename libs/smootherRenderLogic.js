
	let gl;
	let showSmoothUi;
	let shaderMain, shaderHighlight;
	const meshes = {};
	let configMod = 0;

	// Each browser resize requires viewport recalculation
	function onResize()
	{
		// HACK: The view is absolutely positioned to cover the 'viewspace' div.
		//   This is because flex is incompatible with setting canvas width & height elements to flex-defined sizes.
		//   (they don't work well together), so 'viewSpace' div gets flex-defined sizes and view is positioned to match
		let viewSpace = document.getElementById("viewSpace");
		gl.canvas.style.left = viewSpace.offsetLeft;
		gl.canvas.style.top = viewSpace.offsetTop;
		gl.canvas.width = viewSpace.clientWidth;
		gl.canvas.height = viewSpace.clientHeight;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		mat4.perspective(gl.projectionMatrix, 45 * Math.PI/180, gl.canvas.width / gl.canvas.height, 0.1, 1000.0);
	}

	function getOrientationMatrix(index)
	{
		const result = mat4.create();
		switch (index)
		{
			case  1: mat4.rotate(result, result, 180*Math.PI/180, [0, 0, 1]); break;
			case  2: mat4.rotate(result, result, 90*Math.PI/180, [0, 0, 1]); break;
			case  3: mat4.rotate(result, result, -90*Math.PI/180, [0, 0, 1]); break;
			case  4: mat4.rotate(result, result, 90*Math.PI/180, [0, 1, 0]); break;
			case  5: mat4.rotate(result, result, -90*Math.PI/180, [0, 1, 0]); break;
			case  6: mat4.rotate(result, result, 180*Math.PI/180, [0, 1, 0]); break;
			case  7: mat4.rotate(result, result, 180*Math.PI/180, [0, 1, 0]); mat4.rotate(result, result, 90*Math.PI/180, [0, 0, 1]); break;
			case  8: mat4.rotate(result, result, 180*Math.PI/180, [0, 1, 0]); mat4.rotate(result, result, -90*Math.PI/180, [0, 0, 1]); break;
			case  9: mat4.rotate(result, result, 180*Math.PI/180, [0, 1, 0]); mat4.rotate(result, result, 180*Math.PI/180, [0, 0, 1]); break;
			case 10: mat4.rotate(result, result, 90*Math.PI/180, [0, 1, 0]); mat4.rotate(result, result, 180*Math.PI/180, [0, 0, 1]); break;
			case 11: mat4.rotate(result, result, -90*Math.PI/180, [0, 1, 0]); mat4.rotate(result, result, 180*Math.PI/180, [0, 0, 1]); break;
			case 12: mat4.scale(result, result, [-1, 1, 1]); break;
		}
		return result;
	}

	// Init webgl
	function initRendering()
	{
		// WebGL
		gl = initWebgl(document.getElementById("view"), { r: 0.15, g: 0.15, b: 0.15 });
		if (typeof(gl) === "string")
		{
			return onFatalError(gl);
		}

		// Shaders
		const shaderSrc_v = `
			attribute vec4 vertex;
			attribute vec3 normal;
			uniform mat4 matProjection;
			uniform mat4 matModelView;
			uniform mat4 matNormal;
			uniform vec4 color;
			varying lowp vec4 varyingColor;
			void main()
			{
				gl_Position = matProjection * matModelView * vertex;

				vec4 transformedNormal = matNormal * vec4(normal, 1.0);
				float lighting = max(dot(transformedNormal.xyz, vec3(0.0, 0.0, 1.0)), 0.0);
				varyingColor = vec4(color.r * lighting, color.g * lighting, color.b * lighting, 1.0);
			}
		`;
		const shaderSrc_f = `
			varying lowp vec4 varyingColor;
			void main()
			{
				gl_FragColor = varyingColor;
			}
		`;
		const shaderSrcHighlight_v = `
			attribute vec4 vertex;
			uniform mat4 matProjection;
			uniform mat4 matModelView;
			uniform vec4 color;
			varying lowp vec4 varyingColor;
			void main()
			{
				gl_Position = matProjection * matModelView * vertex;
				varyingColor = vec4(color.r, color.g, color.b, 1.0);
			}
		`;
		shaderMain = createShader(gl, shaderSrc_v, shaderSrc_f, ["vertex", "normal"], ["matModelView", "matProjection", "matNormal", "color"]);
		shaderHighlight = createShader(gl, shaderSrcHighlight_v, shaderSrc_f, ["vertex"], ["matModelView", "matProjection", "color"]);
		if (typeof(shader) === "string")
		{
			return onFatalError(shader);
		}

		// Meshes
		meshes[SmoothType.ORIGINAL] = meshToGl(gl, createMesh_cube());
		meshes[SmoothType.OUTLINE] = meshToGl(gl, createMesh_cubeOutline());
		meshes[SmoothType.CORNER] = meshToGl(gl, createMesh_corner());
		meshes[SmoothType.EMBED] = meshToGl(gl, createMesh_embed());
		meshes[SmoothType.OUTBED] = meshToGl(gl, createMesh_outbed());
		meshes[SmoothType.SIDECORNER] = meshToGl(gl, createMesh_sideCorner());

		// Setup camera system
		initCamOrbit();

		// Setup sizing management
		window.addEventListener("resize", onResize, false);
		onResize();

		// ui lookup convenience
		showSmoothUi = document.getElementById("showSmooth");

		// Configuration modification setup
		document.getElementById("configSelect").addEventListener("change", function(evt)
		{
			configMod = evt.target.value;
		});

		return true;
	}

	// Frame logic loop
	let prevFrameTime = 0;
	function frameLogic(frameTime)
	{
		// Delta time
		frameTime *= 0.001;
		const deltaTime = frameTime - prevFrameTime;
		prevFrameTime = frameTime;

		// clear scene
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// If source model is loaded, render it
		if (voxData)
		{
			const viewMatrix = getCamOrbitMatrix();
			const s = voxData.models[0].centerOffset;

			// Render original voxels
			for (let i = 0; i < voxData.models[0].voxels.length; i++)
			{
				let v = voxData.models[0].voxels[i];
				if (v.culled || (!v.enabled && showSmoothUi.checked)) { continue; }
				let c = voxData.palette[v.color-1];
				const modelViewMatrix = mat4.create();
				mat4.translate(modelViewMatrix, modelViewMatrix, [v.x-s.x, v.y-s.y, v.z-s.z]);
				mat4.multiply(modelViewMatrix, viewMatrix, modelViewMatrix);
				renderMesh(gl, meshes[SmoothType.ORIGINAL], shaderMain, [c.r,c.g,c.b,c.a], modelViewMatrix);
			}

			// Render smoothing voxels
			if (showSmoothUi.checked)
			{
				for (let i = 0; i < voxData.models[0].smoothVoxels.length; i++)
				{
					let v = voxData.models[0].smoothVoxels[i];
					if (v.culled || !v.enabled) { continue; }
					if (!meshes.hasOwnProperty(v.pattern)) { continue; }
					let c = voxData.palette[v.color-1];
					const modelViewMatrix = mat4.create();
					mat4.translate(modelViewMatrix, modelViewMatrix, [v.x-s.x, v.y-s.y, v.z-s.z]);
					mat4.multiply(modelViewMatrix, modelViewMatrix, getOrientationMatrix(v.orientation));
					if (v.orientation > 11)
					{
						gl.frontFace(gl.CW);
					}
					mat4.multiply(modelViewMatrix, viewMatrix, modelViewMatrix);
					renderMesh(gl, meshes[v.pattern], shaderMain, [c.r,c.g,c.b,c.a], modelViewMatrix);
					if (v.orientation > 11)
					{
						gl.frontFace
						(gl.CCW);
					}
				}
			}

			// Render config modifications
			gl.clear(gl.DEPTH_BUFFER_BIT); // draw hightlights over geometry
			if (configMod != 0)
			{
				for (let key in smootherConfig.cellConfigs)
				{
					if (smootherConfig.cellConfigs[key] == configMod)
					{
						let c = JSON.parse(key);
						const modelViewMatrix = mat4.create();
						mat4.translate(modelViewMatrix, modelViewMatrix, [c[0]-s.x, c[1]-s.y, c[2]-s.z]);
						mat4.multiply(modelViewMatrix, viewMatrix, modelViewMatrix);
						renderMesh(gl, meshes[SmoothType.OUTLINE], shaderHighlight, [1,1,1,1], modelViewMatrix, true);
					}
				}
			}
		}

		// Frame looping
		requestAnimationFrame(frameLogic);
	}

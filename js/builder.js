Builder = (function() {
	var htmlTemplate = ''
		+ '<div id="builder-main-menu">\n'
		+ '	<a class="bt-overview">Overview</a>\n'
		+ '	<a class="bt-download" href="" download="pos.js">Get positions</a>\n'
		+ '</div>\n'
		+ '\n'
		+ '<div id="builder-control-menu">\n'
		+ '	<a class="bt-movexy" title="Move xy"></a>\n'
		+ '	<a class="bt-movez" title="Move z"></a>\n'
		+ '	<a class="bt-rotate" title="Rotate"></a>\n'
		+ '	<a class="bt-scale" title="Scale"></a>\n'
		+ '	<a class="bt-hide" title="Hide item"></a>\n'
		+ '</div>\n';

	var state = {
			editing: false,
			$node: false,
			data: {
				x: 0,
				y: 0,
				z: 0,
				rotate: 0,
				scale: 0
			}
		},
		config = {
			rotateStep: 1,
			scaleStep: 0.1,
			zStep: 2,
			visualScaling: 10,
			rotation: 0,
			redrawFunction: false,
			setTransformationCallback: false
		},
		defaults = {
			x: 0,
			y: 0,
			z: 0,
			rotate: 0,
			scale: 1
		},
		mouse = {
			prevX: false,
			prevY: false,
			activeFunction: false
		},
		handlers = {},
		redrawTimeout,
		//nodes
		$controls, $impress, $overview;

	handlers.movexy = function(x, y) {
		var v = fixVector(x, y);
		state.data.x = (state.data.x) ? (state.data.x) + v.x : v.x;
		state.data.y = (state.data.y) ? (state.data.y) + v.y : v.y;
	};
	handlers.movez = function(x, y) {
		state.data.z = (state.data.z) ? (state.data.z) + x * config.zStep : x * config.zStep;
	};
	handlers.scale = function(x) {
		state.data.scale -= -x * config.scaleStep * config.visualScaling / 10;
	};
	handlers.rotate = function(x) {
		state.data.rotate -= -x * config.rotateStep;
	};
	var hideElement = function(x) {
		if (state.$node && state.$node.length) {
			state.$node[0].style.display = 'None';
		}
	};

	function init(conf) {
		config = $.extend(config, conf);

		if (config.setTransformationCallback) {
			config.setTransformationCallback(function(x) {
				// guess what, it indicates slide change too :)
				$controls.hide();

				//setting pu movement scale
				config.visualScaling = x.scale;
				//console.log(x.scale);
				//TODO: implement rotation handling for move
				config.rotation = ~~(x.rotate.z);
				//console.log('rotate', x.rotate.z);
				//I don't see why I should need translation right now, but who knows...
			})
		}

		$impress = $('#impress');
		$overview = $('#overview');

		// register mouse events to control elements
		var $menu = $(htmlTemplate);
		$menu.appendTo('body');
		$('#builder-main-menu .bt-overview').on('click', function() {
			config['goto']('overview');
		});
		$('#builder-main-menu .bt-download').on('click', downloadPositions);
		$('#builder-control-menu .bt-movexy').data('func', 'movexy');
		$('#builder-control-menu .bt-movez').data('func', 'movez');
		$('#builder-control-menu .bt-rotate').data('func', 'rotate');
		$('#builder-control-menu .bt-scale').data('func', 'scale');
		$('#builder-control-menu .bt-hide').on('click', hideElement);

		var showTimer;

		$controls = $('#builder-control-menu');
		$('#builder-control-menu a').on('mousedown', function(e) {
			e.preventDefault();
			mouse.activeFunction = handlers[$(this).data('func')];
			loadData();
			mouse.prevX = e.pageX;
			mouse.prevY = e.pageY;
			$(document).on('mousemove.handler1', handleMouseMove);
			return false;
		}).on('mouseenter', function() {
			clearTimeout(showTimer);
		});
		$(document).on('mouseup', function() {
			mouse.activeFunction = false;
			$(document).off('mousemove.handler1');
		});

		$('.step, .sprite').on('mouseenter', function() {
			var $t = $(this);
			showTimer = setTimeout(function() {
				if (!mouse.activeFunction) {
					//show controls
					state.$node = $t;
					showControls(state.$node);
				}
			}, 500);
			$t.data('showTimer', showTimer);
		}).on('mouseleave', function() {
			//not showing when not staying
			clearTimeout($(this).data('showTimer'));
		});

		$(window).on('beforeunload', function() {
			return 'All changes will be lost';
		});

		config['goto']('start');

	}

	function downloadPositions(event) {
		var _positionMapping = {
			x: 'x',
			y: 'y',
			z: 'z',
			scale: 's',
			rotate: 'r',
			rotateX: 'rx',
			rotateY: 'ry',
			rotateZ: 'rz'
		};

		var _getPosition = function(el) {
			var pos = null;
			for (var j in _positionMapping) {
				if (j in el.dataset) {
					pos = pos || {};
					pos[_positionMapping[j]] = el.dataset[j];
				}
			}
			return pos;
		};

		// collect position information of all positioned elements
		var elements = $('body *');
		var positions = [];
		for (var i = 0; i < elements.length; ++i) {
			var ipos = _getPosition(elements[i]);
			if (ipos) {
				ipos.id = elements[i].id;
				positions.push(ipos);
			}
		}

		// create data URI to trigger file download
		event.target.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('var positions = ' + JSON.stringify(positions, null, 2) + ';');
	}

	function showControls($where) {
		var top, left, pos = $where.offset(), data = $where.data();
		var scale = data && data.scale ? data.scale : 1;
		//not going out the edges (at least one way)
		top = (pos.top > 0) ? pos.top : 0;
		left = (pos.left > 0) ? pos.left : 0;

		$controls.show().offset({
			top: top,
			left: left
		});
	}

	function loadData() {
		//console.log('load', state.$node[0].dataset.x);
		//state.data=state.$node[0].dataset;
		//add defaults

		state.data.x = parseFloat(state.$node[0].dataset.x) || defaults.x;
		state.data.y = parseFloat(state.$node[0].dataset.y) || defaults.y;
		state.data.z = parseFloat(state.$node[0].dataset.z) || defaults.z;
		state.data.scale = parseFloat(state.$node[0].dataset.scale) || defaults.scale;
		state.data.rotate = parseFloat(state.$node[0].dataset.rotate) || defaults.rotate;

	}

	function redraw() {
		clearTimeout(redrawTimeout);
		redrawTimeout = setTimeout(function() {
			//state.$node[0].dataset=state.data;

			state.$node[0].dataset.scale = state.data.scale;
			state.$node[0].dataset.rotate = state.data.rotate;
			state.$node[0].dataset.x = state.data.x;
			state.$node[0].dataset.y = state.data.y;
			state.$node[0].dataset.z = state.data.z;
			/**/
			//console.log(state.data, state.$node[0].dataset, state.$node[0].dataset === state.data);

			config.redrawFunction(state.$node[0]);
			showControls(state.$node);
			//console.log(['redrawn',state.$node[0].dataset]);
		}, 20);
	}

	function fixVector(x, y) {
		var result = {
				x: 0,
				y: 0
			},
			angle = (config.rotation / 180) * Math.PI,
			cs = Math.cos(angle),
			sn = Math.sin(angle);

		result.x = (x * cs - y * sn) * config.visualScaling;
		result.y = (x * sn + y * cs) * config.visualScaling;
		return result;
	}

	function handleMouseMove(e) {
		e.preventDefault();
		e.stopPropagation();

		var x = e.pageX - mouse.prevX,
			y = e.pageY - mouse.prevY;

		mouse.prevX = e.pageX;
		mouse.prevY = e.pageY;
		if (mouse.activeFunction) {
			mouse.activeFunction(x, y);
			redraw();
		}

		return false;
	}

	return {
		init: init
	};

})();

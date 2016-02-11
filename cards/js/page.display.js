var __color = d3.scale.ordinal()
		.range(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd']);

function uniquevalues(value, index, self) { 
    return self.indexOf(value) === index;
}

function display (el, type) {
	clear(el);

	if (type == 'atom') {
		var __pagecontent = __atoms.filter(function (d) {
			return d.type == type;
		});
	} else if (type == 'resources') {
		var __pagecontent = __resources;
	} else if (type == 'storytypes') {
		var __pagecontent = __storytypes;
	}

	var __categories = __pagecontent.map(function (d) {
		return d.category;
	});

	__categories = __categories.filter(uniquevalues);

	var __filter__menu = d3.select('.navbar-right .dropdown .dropdown-menu').html(''),
		__filters = __filter__menu.selectAll('li')
			.data(__categories);

	__filters.enter()
		.append('li')
		.attr('class', 'category active')
		.on('click', function (d) {
			var cats = d3.selectAll('.category.active')[0].length;
			if (cats == __categories.length) {
				d3.selectAll('li.category').classed('active', false);
				d3.selectAll('.row.entry').style('display', 'none');
				d3.select(this).classed('active', true);
				d3.selectAll('.row.entry.' + d.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,"").toLowerCase()).style('display', null);
			} else {
				d3.select(this).classed('active', true);
				d3.selectAll('.row.entry.' + d.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,"").toLowerCase()).style('display', null);
			}
			
		})
	.append('a')
	.append('span')
		.style('background-color', function (d) { return __color(d); })
		.html(function (d) { 
			var count = __pagecontent.filter(function (c) {
				return c.category == d;
			});
			
			return '<small>' + d + ' [' + count.length + ']' + '</small>'; 
		});

	var __container = d3.select('#content'),
		__entries = __container.selectAll('.row.entry')
			.data(__pagecontent);

	__entries.enter()
		.append('div')
		.attr('class', function (d) {
			var category = d.category.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,"").toLowerCase();
			return 'row entry ' + category;
		});

	var __entry__atoms = __entries.append('div')
		.attr('class', 'col-xs-12 col-sm-12 col-md-12');

	__entry__atoms.append('div')
		.attr('class', 'row body')
		.style('border-color', function (d) {
			return __color(d.category);
		})
		.each(function (d) {
			var _body = d3.select(this);
			
			_body.append('div')
				.attr('class', 'col-xs-12 col-sm-12 col-md-10')
				.html(function (d) { 
					return	'<p class="lead"><span>' + d.name + '</span></p>';	
				})
				.each(function () {
					if (type == 'storytypes') {
						var list = d3.select(this).append('ul');

						d.steps.forEach(function (c) {
							return list.append('li')
								.html(c);
						});
					}
				})
			.on('mouseup', function (d) {
				var node = d3.select(this),
					parent = d3.select(this.parentNode.parentNode.parentNode);

				if (!node.classed('expanded')) {
					d3.selectAll('.expanded')
						.classed('expanded', false)
					.selectAll('p.description')
						.remove();

					parent.classed('expanded', true);

					if (type == 'atom') {
						if (d.img) {
							node.append('p')
								.attr('class', 'description')
								.append('img')
								.attr('src', 'img/' + d.img)
						}

						node.append('p')
							.attr('class', 'description')
							.html('<strong>How:</strong> ' + d.description);

						node.append('p')
							.attr('class', 'description')
							.html('<strong>Why:</strong> ' + d.purpose);
					}

					d.examples.forEach(function (c) { 
						return node.append('p')
							.attr('class', 'description')
							.append('a')
						.html(c);
					});
				} else {
					return parent.classed('expanded', false);
				}
			})
			.on('touchend', function (d) {
				var node = d3.select(this),
					parent = d3.select(this.parentNode.parentNode.parentNode);

				if (!node.classed('expanded')) {
					d3.selectAll('.expanded')
						.classed('expanded', false)
					.selectAll('p.description')
						.remove();

					parent.classed('expanded', true);

					if (type == 'atom') {
						if (d.img) {
							node.append('img')
								.attr('src', 'img/' + d.img)
						}

						node.append('p')
							.attr('class', 'description')
							.html('<strong>How:</strong> ' + d.description);

						node.append('p')
							.attr('class', 'description')
							.html('<strong>Why:</strong> ' + d.purpose);
					}

					d.examples.forEach(function (c) { 
						return node.append('p')
							.attr('class', 'description')
							.append('a')
						.html(c);
					});
				} else {
					return parent.classed('expanded', false);
				}
			})

			_body.classed('text-only', true);				

		});
}

function clear (el) {
	d3.selectAll('.navbar-nav li').classed('active', false);
	d3.select(el.parentNode).classed('active', true);
	return d3.selectAll('.row.entry').remove();
}
var __color = d3.scale.ordinal()
		.range(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd']);

function uniquevalues(value, index, self) {
    return self.indexOf(value) === index;
}

function display (el, type, data) {
	clear(el);

	/*if (type == 'atom') {
		var __pagecontent = __atoms.filter(function (d) {
			return d.type == type;
		});
	} else if (type == 'resources') {
		var __pagecontent = __resources;
	} else if (type == 'storytypes') {
		var __pagecontent = __storytypes;
	}*/


	__pagecontent = data.map(function(d){
		if (!d.Tags){d.Tags = "untagged"};
		return d;
	});

	// show only "done" cards
	__pagecontent = __pagecontent.filter(function(d){
		//console.log(d);
		return d["Complete?"] != null;
	});

	var __categories = __pagecontent.map(function (d) {
		//return d.Tags.replace(/\s/, '');

		var tags = d.Tags ? d.Tags.split(',') : [];
		tags.map(function (d) {
			return d.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,"").replace(/ /g, '').toLowerCase();
		});
		//tags = tags.toString().replace(/\,/, ' ');
		return tags.toString();
		//return d.category;
	});

	__categories = __categories.toString().split(',');
	//__categories.forEach(function (d) { return d.replace(/\s/, ''); });
	__categories = __categories.filter(uniquevalues);
	console.log(__categories);


	var __filter__menu = d3.select('.navbar-right').html(''),
		__filters = __filter__menu.selectAll('li')
			.data(__categories);

	__filters.enter()
		.append('li')
		.attr('class', 'category active')
		.on('click', function (d) {
			var cats = d3.selectAll('.category.active').size();
			var domNode = d3.select(this);
			if (cats == __categories.length) {
				d3.selectAll('li.category').classed('active', false);
				d3.selectAll('.entry').style('display', 'none');
				
				domNode.classed('active', true);
				d3.selectAll('.entry').filter(function (c) { return c['Tags'] === d; }).style('display', null);
			} else {
				if (!domNode.classed('active')) {
					domNode.classed('active', true);
					//d3.selectAll('.entry.' + d.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,"").toLowerCase()).style('display', null);
					d3.selectAll('.entry').filter(function (c) { return c['Tags'] === d; }).style('display', null);
				} else {
					if (cats > 1) {
						domNode.classed('active', false);
						d3.selectAll('.entry').filter(function (c) { return c['Tags'] === d; }).style('display', 'none');
					} else {
						d3.selectAll('li.category').classed('active', true);
						d3.selectAll('.entry').style('display', null);
					}
				}
			}

		})
	.append('a')
	.append('span')
		.style('border-color', function (d) { return __color(d); })
		.html(function (d) {
			var count = __pagecontent.filter(function (c) {
				var tags = c.Tags.split(',');
				return tags.indexOf(d) !== -1;
				//return c.Tags == d;
				//return c.category == d;
			});

			return '<small>' + d + ' [' + count.length + ']' + '</small>';
		});

	var __container = d3.select('#content'),
		__entries = __container.selectAll('.entry')
			.data(__pagecontent);

	/*__entries.enter()
		.append('div')
		.attr('class', function (d) {
			var category = d.category.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,"").toLowerCase();
			return 'row entry ' + category;
		});*/

	/*var __entry__atoms = __entries.append('div')*/
	__entries.enter()
		.append('div')
		.attr('class', function (d) {
			if (d.Tags) {
				var tags = d.Tags.split(',');
				tags.map(function (d) {
					return d.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,"").toLowerCase();
				});
				var tags = d.Tags.replace(/\,/, '');
				//tags = tags.toString().replace(/ /g, ' ');
				//var category = d.category.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,"").toLowerCase();
				return 'entry col-xs-12 col-sm-6 col-md-4 ' + tags;
			} else {
				return 'entry col-xs-12 col-sm-6 col-md-4';
			}
		});

	//__entry__atoms
	__entries.append('div')
		.attr('class', 'body')
		.style('border-color', function (d) {
			var tags = d.Tags.split(',');
			tags.map(function (d) {
				return d.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~() ]/g,"").toLowerCase();
			});
			return __color(tags[0]);
		})
		.each(function (d) {
			var _body = d3.select(this);

			_body.append('div')
				.attr('class', 'inner')
				.html(function (d) {
					return	'<p class="lead"><span>' + d.Name + '</span></p>';
				})
				.each(function () {
					if (type == 'storytypes') {
						var list = d3.select(this).append('ul');

						d.steps.forEach(function (c) {
							return list.append('li')
								.html(c);
						});
					}

					var node = d3.select(this);
					if (type == 'atom') {
						/*if (d.img) {
							node.append('p')
								.attr('class', 'description')
								.append('img')
								.attr('src', 'img/' + d.img)
						}*/

						node.append('div')
							.attr('class', 'example-image')
							.append("img")
							.attr("src", d["Example Image URL"]);

						node.append('p')
							.attr('class', 'description')
							.html('<h4>How</h4> ' + d.Description);

						node.append('p')
							.attr('class', 'description')
							.html('<h4>Why</h4> ' + d.Purpose);

						if (d['Example URL']) {

							var p = node.append('p')
							.attr('class', 'examples')

							p.append('h4').html("example");

							p.append('a')
								.attr("href", d['Example URL'])
							.html(d["Example source / authors"] +": "+d["Example title"]);

						}
					}


				})
			/*.on('mouseup', function (d) {
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
			})*/

			_body.classed('text-only', true);

		});
}

function clear (el) {
	d3.selectAll('.navbar-nav li').classed('active', false);
	d3.select(el.parentNode).classed('active', true);
	return d3.selectAll('.entry').remove();
}
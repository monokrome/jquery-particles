/**
 Copyright (c) 2010 Brandon "monokrome" Stoner

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
**/

(function(){

// TODO:
//       1. Modify this library to use time-based animation, and probably jQuery.animate for
//       particle animation if this is a possibility.
//
//       2. Enhance this library by allowing it to use jQuery Physics where possible.
//          <http://plugins.jquery.com/project/jphysics>
//
//       3. Resizing needs to be taken into account. When a document is resized, particles
//          should have the option to interpolate their attributes properly.
//
//       4. Allow this tool to draw particles in <canvas> elements instead of on a per-element
//          basis, but without removing the ability to use elements also.
//
//       5. Optimize the library to work faster without dropping functionality, and make an
//          "API" for jQuery.particle to return and let developers change different options
//          after the particle set has been created.
//

var me = window.me || {};
	me.monokro = me.monokro || {}
	me.monokro.particles = {
		'generic_incrementors': {
				// TODO: This only works with top/left combinations. Add support for bottom/right.
			'bound_by_parent': function(ps, wrap_x, wrap_y)
			{
				if (wrap_x == undefined) { wrap_x = true }
				if (wrap_y == undefined) { wrap_y = true }

				if (wrap_y == true)
				{
					max_y = $(this).parent().height() + $(this).height();

					if ($(this).position().top > max_y)
					{
						$(this).css('top', $(this).height() * -1);
					}

					if ($(this).position().top < ($(this).height() * -1))
					{
						$(this).css('top', $(this).parent().height());
					}
				}

				if (wrap_x == true)
				{
					max_x = $(this).parent().width() + $(this).width();

					if ($(this).position().left > max_x)
					{
						$(this).css('left', $(this).width() * -1);
					}

					if ($(this).position().left < ($(this).width() * -1))
					{
						$(this).css('left', window.width);
					}
				}
			}
		},
		'default_options': {
			'parent': 'body',
			'base_element': [],
			'particle_elements': [],
			'update_particle': {},
			'init_particle': {'top':0, 'left':0},
			'count': 10,
			'animate': true,
			'update_timings': {
				'frequency': 50,
				'last_update': 0
			},
			'incrementor': undefined
		},
		'particle_sets': [],
		'option': function(option)
		{
			var args = args || [];

			if (typeof(option) == 'function')
			{
				option = option.apply(this, args);
			}

			return option;
		},
		'create': function(options)
		{
				// Get options for this partical set
			if (typeof(options) == 'object') {
				options = $.extend(particles.default_options, options);
			} else {
				options = particles.default_options;
			}

				// Translates the 'parent' element from a selector if needed
			options['parent'] = $(options.parent).get(0);

				// Update our set of base elements that our particles will randomly derive from
				//   TODO: We might want to make this optionally non-random.
			$(this).each(function(){
				options.base_elements.push(this);
			});

				// Iterate through the particle count and create our elements
				//   TODO: This will probably be slow in larger particle
				// patterns. How can we go about optimizing this?
			$(Array(options['count'])).each(function(){
				var random_index = parseInt(Math.random()*(particles.option(options.base_elements).length-1));
				var this_particle = $(particles.option(options.base_elements)[random_index]).clone()[0];

				options.particle_elements.push(this_particle);
				$(options['parent']).append(this_particle);

				for (attr in options['init_particle'])
				{
					$(this_particle).css(attr, particles.option.apply(this_particle, [options['init_particle'][attr]]));
				}
			});

			particles.particle_sets.push(options);

			particles.update();
		},
		'update': function()
		{
			var smallest_frequency;

			for (particle_set_index in particles.particle_sets)
			{
				var particle_set = particles.particle_sets[particle_set_index];

				if (particle_set.animate == true)
				{
					var current_time = Number(new Date());
					var delta_time = current_time - particle_set.update_timings.last_update;

					if (particle_set.update_timings.frequency <= delta_time)
					{
						if (smallest_frequency == undefined || partice_set.update_timings.frequency < smallest_frequency)
						{
							smallest_frequency = particle_set.update_timings.frequency;
						}

						for (element_index in particle_set.particle_elements)
						{
							var element = particle_set.particle_elements[element_index];

							for (attr in particle_set.update_particle)
							{
								$(element).css(attr, parseInt($(element).css(attr)) + particles.option.apply(element, [particle_set.update_particle[attr]]));
							}

							if (typeof(particle_set.incrementor) == 'function')
							{
								particle_set.incrementor.apply(element, [particle_set]);
							}
						}
					}

					particle_set.update_timings.last_update = current_time;
				}
				else
				{
					particle_set.update_timings += delta_time;
				}
			}

			if (!smallest_frequency)
			{
				smallest_frequency = 1000;
			}

			setTimeout(particles.update, smallest_frequency);
		}
	};

	if (window.jQuery)
	{
		(function($)
		{
			$.particles = me.monokro.particles;
			$.fn.particles = me.monokro.particles.create;
		})(window.jQuery);
	}

	window.me = me;
	var particles = me.monokro.particles;
})();


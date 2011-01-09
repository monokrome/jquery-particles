$(document).ready(function(){
	particle_element = document.createElement('div');
	$(particle_element).addClass('snowflake').hide();

	$('body').particles({
		'parent': 'div#header',
		'base_elements': [particle_element],
		'update_particle':
		{
			'top': 4,
			'left': function(ps)
			{
				return parseInt((Math.random()*5)+1);
			}
		},
		'init_particle':
		{
			'top': function()
			{
				$(this).fadeIn(10000);

				return Math.random()*($(this).parent().height());
			},
			'left': function()
			{
				return Math.random()*($(this).parent().width());
			},
			'backgroundImage': function()
			{
				return function() { return 'url(./images/snowflake_0' + String(parseInt(Math.random()*2)+1) + '.png)'; }
			}
		},
		'count': 20,
		'incrementor': $.particles.generic_incrementors.bound_by_parent
	});
});


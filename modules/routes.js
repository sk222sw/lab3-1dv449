var mash = require('./mash');

// regex instead of repeating app.get for /, home and index
module.exports = function(app) {
	app.get('/:var(home|index)?', function(req, res) {
		res.render('home');
	});

	app.post('/', function(req, res) {
		console.log('Form (from querystring): ' + req.query.form);
		console.log('CSRF token (from hidden form field): ' + req.body._csrf);
		console.log('Name (from visible form field): ' + req.body.url);
		// res.redirect(303, '/');
		
		res.render('home', {
			mash: mash.mash(req.body.url)
		});
	});

	app.use(function(req, res) {
		res.type('text/plain');
		res.status(404);
		res.send('404 - not found');
	});
};
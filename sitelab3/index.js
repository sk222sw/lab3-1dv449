var express = require('express');
var app = express();

// handlebars
var handlebars = require('express-handlebars')
    .create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

require('./modules/routes')(app);

app.listen(app.get('port'), function() {
    console.log('express started on c9 localhost-ish:' +
                app.get('port') + '; press ctrl-c to terminate');
});


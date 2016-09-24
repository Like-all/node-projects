
/*
 * GET home page.
 */
var fs = require('fs'), http = require('http'), md = require('marked'), gamedata = '', trackinfo = '';
var env = process.env.APPS_ENVIRONMENT;
var pkgver = process.env.APPS_VERSION;
var renderer = new md.Renderer();
var hostname = '';
var debug = false;

if(env == 'development') {
	hostname = 'dev.it-the-drote.tk';
	debug = true;
} else {
	hostname = 'it-the-drote.tk';
}

var markdown_path = '/storage/' + hostname + '/markdown-content/';

renderer.heading = function (text, level) {
	var escapedText = text.toLowerCase().replace(/[^\wА-яЁёЇїІіЄє]+/g, '-');
	return '<h' + level + '>' + text + ' <a name="' +
				escapedText +
				'" class="anchor section" href="#' +
				escapedText +
				'"><span class="header-link">§</span></a>' +
				'</h' + level + '>';
}

md.setOptions({
	renderer: renderer,
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: true,
	smartypants: false
});

var pageSettings = {
	caption: '',
	md: undefined,
	mdContent: undefined,
	host: hostname,
	environment: env,
	version: pkgver,
	currentyear: new Date().getFullYear()
}

exports.index = function(req, res){
	pageSettings.caption = "In the middle of nowhere"
	res.render('index', pageSettings);
};

exports.articles = function(req, res){
	pageSettings.caption = "Статьи и заметки(вместо блога)"
	fs.readFile(markdown_path + 'static/articles.md', function(err, data){
		if(err) throw err;
		if(debug) console.log(markdown_path + 'static/articles.md');
		pageSettings.md = md;
		pageSettings.mdContent = data.toString();
		moddate = fs.statSync(markdown_path + 'static/articles.md').mtime;
		res.set('Last-Modified', moddate);
		res.render('articles', pageSettings);
	});
};

exports.dreams = function(req, res){
	pageSettings.caption = "Сновидения"
	fs.readFile(markdown_path + 'static/dreams.md', function(err, data){
		if(err) throw err;
		pageSettings.md = md;
		pageSettings.mdContent = data.toString();
		moddate = fs.statSync(markdown_path + 'static/dreams.md').mtime;
		res.set('Last-Modified', moddate);
		res.render('dreams', pageSettings);
	});
};

exports.projects = function(req, res){
	pageSettings.caption = "Проекты"
	fs.readFile(markdown_path + 'static/projects.md', function(err, data){
		if(err) throw err;
		pageSettings.md = md;
		pageSettings.mdContent = data.toString();
		moddate = fs.statSync(markdown_path + 'static/projects.md').mtime;
		res.set('Last-Modified', moddate);
		res.render('projects', pageSettings);
	});
};

exports.article = function(req, res){
	fs.readFile(markdown_path + 'articles/' + req.params.id + '.md', function(err, data){
		if(err) {
			res.status(404);
			res.render('404', pageSettings);
		} else {
			pageSettings.caption = fs.readFileSync(markdown_path + 'articles/' + req.params.id + '.md', { encoding: 'utf8' }).split('\n')[0];
			pageSettings.md = md;
			pageSettings.mdContent = data.toString();
			moddate = fs.statSync(markdown_path + 'articles/' + req.params.id + '.md').mtime;
			res.set('Last-Modified', moddate);
			res.render('articles', pageSettings);
		}
	});
};

exports.dream = function(req, res){
	fs.readFile(markdown_path + 'dreams/' + req.params.id + '.md', function(err, data){
		if(err) {
			res.status(404);
			res.render('404', pageSettings);
		} else {
			pageSettings.caption = fs.readFileSync(markdown_path + 'dreams/' + req.params.id + '.md', { encoding: 'utf8' }).split('\n')[0];
			pageSettings.md = md;
			pageSettings.mdContent = data.toString();
			moddate = fs.statSync(markdown_path + 'dreams/' + req.params.id + '.md').mtime;
			res.set('Last-Modified', moddate);
			res.render('dreams', pageSettings);
		}
	});
};

exports.project = function(req, res){
	fs.readFile(markdown_path + 'projects/' + req.params.id + '.md', function(err, data){
		if(err) {
			res.status(404);
			res.render('404', pageSettings);
		} else {
			pageSettings.caption = fs.readFileSync(markdown_path + 'projects/' + req.params.id + '.md', { encoding: 'utf8' }).split('\n')[0];
			pageSettings.md = md;
			pageSettings.mdContent = data.toString();
			moddate = fs.statSync(markdown_path + 'projects/' + req.params.id + '.md').mtime;
			res.set('Last-Modified', moddate);
			res.render('projects', pageSettings);
		}
	});
};

exports.about = function(req, res){
	pageSettings.caption = "Обо мне"
	fs.readFile(markdown_path + 'static/about.md', function(err, data){
		if(err) throw err;
		pageSettings.md = md;
		pageSettings.mdContent = data.toString();
		moddate = fs.statSync(markdown_path + 'static/about.md').mtime;
		res.set('Last-Modified', moddate);
		res.render('about', pageSettings);
	});
};

exports.cv = function(req, res){
	pageSettings.caption = "Резюме"
	fs.readFile(markdown_path + 'static/cv.md', function(err, data){
		if(err) throw err;
		pageSettings.md = md;
		pageSettings.mdContent = data.toString();
		moddate = fs.statSync(markdown_path + 'static/cv.md').mtime;
		res.set('Last-Modified', moddate);
		res.render('cv', pageSettings);
	});
};

exports.ping = function(req, res){
	res.send("OK");
}


exports.donate = function(req, res){
	res.render('donate');
};

'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

module.exports = yeoman.Base.extend({

  initializing: function () {
    this.props = {};
    this.props.appName = this.name || path.basename(process.cwd());
  },

  prompting: function () {
    this.log(yosay(
      'Yo! Welcome to the humble ' + chalk.red('koa') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'What is the name of your application?',
      default: this.props.appName
    }, {
      type: 'list',
      name: 'koa',
      message: 'What koa version do you prefer?',
      choices: ['Koa v1', 'Koa v2'],
    }, {
      type: 'list',
      name: 'objectMapping',
      message: 'What object mapping would you like to use?',
      choices: ['Mongoose', 'Sequelize', 'None'],
    }, {
      when: function(response) {
        if(response.objectMapping == 'Sequelize') {
          return response.objectMapping;
        }
      },
      name: 'username',
      type: 'input',
      message: 'What is your username for the database?',
      default: 'root'
    }, {
      when: function(response) {
        if(response.objectMapping == 'Sequelize') {
          return response.objectMapping;
        }
      },
      name: 'password',
      type: 'input',
      message: 'What is your password for the database?',
      default: 'pass'
    }, {
      when: function(response) {
        if(response.objectMapping == 'Sequelize') {
          return response.objectMapping;
        }
      },
      name: 'sqlDialect',
      type: 'list',
      message: 'What is your sql dialect?',
      choices: ['mysql', 'postgres', 'mariadb']
    }, {
      type: 'list',
      name: 'templateEngine',
      message: 'What template engine would you like to use?',
      choices: ['Jade', 'Swig']
    }, {
      type: 'list',
      name: 'cssPreprocessor',
      message: 'What css preprocessor would you like to use?',
      choices: ['Less', 'Sass', 'Stylus']
    }, {
      type: 'confirm',
      name: 'tests',
      message: 'Would you like to use backend tests (Mocha + Supertest)?',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    // Controllers
    this.fs.copyTpl(
      this.templatePath('./controllers/views.js'),
      this.destinationPath('./controllers/views.js'),
      this
    );

    if(this.props.objectMapping != 'None') {
      this.fs.copyTpl(
        this.templatePath('./controllers/users.js'),
        this.destinationPath('./controllers/users.js'),
        this
      );

      // Models
      this.fs.copyTpl(
        this.templatePath('./models/models.js'),
        this.destinationPath('./models/models.js'),
        this
      );
    }
    
    // Private
    this.fs.copy(
      this.templatePath('./private/img'),
      this.destinationPath('./private/img')
    );

    this.fs.copy(
      this.templatePath('./private/js'),
      this.destinationPath('./private/js')
    ); 

    if(this.props.cssPreprocessor == 'Less') {
      this.fs.copy(
        this.templatePath('./private/less'),
        this.destinationPath('./private/less')
      );      
    }    

    if(this.props.cssPreprocessor == 'Sass') {
      this.fs.copy(
        this.templatePath('./private/sass'),
        this.destinationPath('./private/sass')
      );      
    }

    if(this.props.cssPreprocessor == 'Stylus') {
      this.fs.copy(
        this.templatePath('./private/stylus'),
        this.destinationPath('./private/stylus')
      );      
    }

    // Tests
    if(this.props.tests == true) {
      this.fs.copyTpl(
        this.templatePath('./test'),
        this.destinationPath('./test'),
        this
      );
    }

    // Views
    if(this.props.templateEngine == 'Jade') {
      this.fs.copy(
        this.templatePath('./views/jade'),
        this.destinationPath('./views')
      );
    }    

    if(this.props.templateEngine == 'Swig') {
      this.fs.copy(
        this.templatePath('./views/swig'),
        this.destinationPath('./views')
      );      
    }

    // Root
    this.fs.copyTpl(
      this.templatePath('./package.json'),
      this.destinationPath('./package.json'),
      this
    );

    this.fs.copyTpl(
      this.templatePath('./bower.json'),
      this.destinationPath('./bower.json'),
      this
    );

    this.fs.copyTpl(
      this.templatePath('./gulpfile.js'),
      this.destinationPath('./gulpfile.js'),
      this
    );
    
    this.fs.copy(
      this.templatePath('./gitignore'),
      this.destinationPath('./.gitignore')
    );

    this.fs.copy(
      this.templatePath('./.bowerrc'),
      this.destinationPath('./.bowerrc')
    );

    this.fs.copyTpl(
      this.templatePath('./app.js'),
      this.destinationPath('./app.js'),
      this
    );

  },

  install: function () {
    var self = this;
    self.installDependencies({
      callback: function() {
        var q = self.spawnCommand('gulp');
      }
    });
  },

  end: function() {
    this.log(chalk.green('Done! Have fun!'));
  }
});

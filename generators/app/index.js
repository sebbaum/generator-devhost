'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk'); // Coloring the console
const mkdirp = require('mkdirp');
const path = require('path');
const _ = require('lodash');

const devhostFolder = 'devhost';
const chefFolders = ['data_bags', 'environments', 'nodes'];

module.exports = class extends Generator {
  prompting() {
    this.log(
      "Let's create a new Devhost with the " + chalk.blue('devhost') + ' generator!'
    );

    // Get the box's name
    // this.argument('boxname', { type: String, reuqired: true });

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: "What's the name of your product/project?"
      },
      {
        type: 'checkbox',
        name: 'servers',
        message: 'Which servers do you need?',
        choices: ['nginx', 'mysql'],
        default: ['nginx', 'mysql']
      },
      {
        when: function(answers) {
          return _.includes(answers.servers, 'mysql');
        },
        type: 'input',
        name: 'dbName',
        message: 'How do you want to name your database?'
      }
    ];

    return this.prompt(questions).then(answers => {
      // To access answers later use this.answers.someAnswer;
      this.answers = answers;
    });
  }

  default() {
    mkdirp(this.answers.name);
    this.destinationRoot(this.destinationPath(this.answers.name));
  }

  writing() {
    // Create settings.yml file
    this.fs.copyTpl(
      this.templatePath('settings.yml'),
      this.destinationPath(path.join(devhostFolder, '/settings.yml')),
      {
        boxname: this.answers.name,
        appname: this.answers.name,
        installNginx: _.includes(this.answers.servers, 'nginx'),
        installMysql: _.includes(this.answers.servers, 'mysql')
      }
    );

    // Create the Vagrantfile
    this.fs.copyTpl(
      this.templatePath('Vagrantfile'),
      this.destinationPath(path.join(devhostFolder, 'Vagrantfile'))
    );

    // Create the .gitignore
    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath(path.join(devhostFolder, '.gitignore'))
    );

    // Create chef folders
    chefFolders.forEach(folder => {
      this.fs.copyTpl(
        this.templatePath('.gitkeep'),
        this.destinationPath(path.join(devhostFolder, 'chef', folder, '.gitkeep'))
      );
    });
  }

  install() {
    // This.installDependencies();
  }

  end() {
    this.log(
      chalk.yellow(
        'Scaffolding finished. Change directory to ' +
          this.answers.name +
          '/' +
          devhostFolder +
          ' and run vagrant up to start your box!'
      )
    );
  }
};

'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const existingFiles = [
  'devhost/settings.yml',
  'devhost/Vagrantfile',
  'devhost/chef/environments/.gitkeep',
  'devhost/chef/nodes/.gitkeep',
  'devhost/chef/data_bags/.gitkeep'
];

describe('generator-devhost:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      name: 'testbox',
      servers: ['nginx', 'mysql'],
      enableSSL: true,
      dbName: 'testDB',
      awsAccessKey: 'testKey',
      awsSecretAccessKey: 'testSecKey'
    });
  });

  it('creates files', () => {
    assert.file(existingFiles);
  });

  it('should contain the boxname', () => {
    assert.fileContent('devhost/settings.yml', /box-name: testbox/);
    assert.fileContent('devhost/settings.yml', /nginx:\n {2}enabled: true/);
    assert.fileContent('devhost/settings.yml', /- shortname: testbox/);
    assert.fileContent('devhost/settings.yml', /ssl_enabled: true/);
    assert.fileContent('devhost/settings.yml', /domains:\n {8}- dev.host/);
    assert.fileContent('devhost/settings.yml', /mysql:\n {2}enabled: true/);
    assert.fileContent('devhost/settings.yml', /root_password: root!/);
    assert.fileContent('devhost/settings.yml', /admin_password: admin!/);
    assert.fileContent('devhost/settings.yml', /databases:\n {4}- testDB/);
    assert.fileContent('devhost/settings.yml', /build-tools:\n {2}enabled: true/);
    assert.fileContent('devhost/settings.yml', /aws_access_key_id: testKey/);
    assert.fileContent('devhost/settings.yml', /aws_secret_access_key: testSecKey/);
  });
});

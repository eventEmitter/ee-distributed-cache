
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert')
		, project 		= require('ee-project');



	var   Cache = require('../')
		, cache
		, config;


	if (project.config) {
		config = project.config;
	}
	else {
		config = {
			servers: {
				'127.0.0.1:11211': 1
			}
		};
	}


	describe('The Cache', function(){
		if (config.servers) {
			describe('(manual server config)', function(){
				it('should not throw when instantiated', function(){
					cache = new Cache({servers: config.servers});
				});

				it('should be able to store data', function(done){
					cache.set('test-1', {a:1}, done);
				});

				it('should be able to retreive data', function(done){
					cache.get('test-1', function(err, data){
						if (err) done(err);
						else {
							assert.equal(JSON.stringify(data), '{"a":1}');
							done();
						}
					});
				});

				it('should be able to store data for the same key', function(done){
					cache.set('test-1', {a:2}, done);
				});

				it('should be able to retreive the modified data', function(done){
					cache.get('test-1', function(err, data){
						if (err) done(err);
						else {
							assert.equal(JSON.stringify(data), '{"a":2}');
							done();
						}
					});
				});
			});
		}

		if (config.autoDiscovery) {
			describe('(manual server config)', function(){
				it('should not throw when instantiated', function(done){
					cache = new Cache({autoDiscovery: config.autoDiscovery});
					setTimeout(done, 1500);
				});

				it('should be able to store data', function(done){
					cache.set('test-2', {a:1}, done);
				});

				it('should be able to retreive data', function(done){
					cache.get('test-2', function(err, data){
						if (err) done(err);
						else {
							assert.equal(JSON.stringify(data), '{"a":1}');
							done();
						}
					});
				});

				it('should be able to store data for the same key', function(done){
					cache.set('test-2', {a:2}, done);
				});

				it('should be able to retreive the modified data', function(done){
					cache.get('test-2', function(err, data){
						if (err) done(err);
						else {
							assert.equal(JSON.stringify(data), '{"a":2}');
							done();
						}
					});
				});
			});
		}
	});
	
# ee-distributed-cache

[![Greenkeeper badge](https://badges.greenkeeper.io/eventEmitter/ee-distributed-cache.svg)](https://greenkeeper.io/)

Distributed Object caching using memcached

## installation

	npm install ee-distributed-cache

## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-distributed-cache.png?branch=master)](https://travis-ci.org/eventEmitter/ee-distributed-cache)


## usage

The cache supports AWS elastichae cluster node autodiscovery, it polls every 60 seconds for new nodes an reconnects using the the new config (if there was a change). 

You may use the cache without this fature with plain old memcached servers


### Constructor (memcached servers)

	var DistributedCache = require('ee-distributed-cache');


	var cache = new DistributedCache({
		servers: ['hostname.tld:port']
	});


### Constructor (elasticache)

the first second or so nothing will be cached since the discovery takes some seconds to succeed

	var DistributedCache = require('ee-distributed-cache');


	var cache = new DistributedCache({
		autoDiscovery: {
			  region 	 	: 'eu-west-1'
			, accessKey 	: ''
			, secret 		: ''
			, clusterId 	: 'staging-cache'
		}
	});


### get method

	cache.get('my-key', function(err, data) {

	});



### set method

	cache.set('my-key', {value: 'must be always a js object'}, function(err) {
		
	});


### delete method

	cache.delete('my-key', function(err) {
		
	});
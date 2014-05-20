!function(){

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, type 			= require('ee-types')
		, Memcached 	= require('memcached')
		, Arguments 	= require('ee-arguments')
		, AutoDiscovery = require('ee-elasticache-autodiscovery');



	module.exports = new Class({

		// see https://www.npmjs.org/package/memcached
		defaultOptions: {
			  maxKeySize 		: 250
			, maxExpiration 	: 2592000
			, maxValue 			: 1048576
			, poolSize 			: 10
			, algorithm 		: 'crc32'
			, reconnect 		: 1000
			, timeout 			: 5000
			, retries 			: 10
			, failures 			: 10
			, retry 			: 30000
			, remove 			: false
			, keyCompression 	: 'md5'
			, idle 				: 120000
		}

		, lifetime: 3600

		, init: function(options) {

			if (options) {
				if (options.lifetime) this.lifetime = options.lifetime;
			}

			if (options && options.servers) this._restartClient(options.servers, this.defaultOptions);
			else if (options && options.autoDiscovery) this._initializeAutoDiscovery(options.autoDiscovery);
			else throw new Error('You have to provide either the servers array or the autoDiscovery configuration');
		}



		, _initializeAutoDiscovery: function(options) {
			this._autoDiscovery = new AutoDiscovery(options);
			this._autoDiscovery.subscribe(options.clusterId, function(err, nodeList){
				if (err) log(err);
				else {
					this._restartClient(nodeList.map(function(node){return node.toString();}), this.defaultOptions);
				}
			}.bind(this));
		}


		, _restartClient: function(servers, options) {
			if (this._memcached) this._memcached.end();
			this._memcached = new Memcached(servers, options);
		}


		, touch: function() {
			var   args 		= new Arguments(arguments)
				, callback 	= args.getFunction(this._doNothing)
				, key  		= args.getString()
				, lifetime 	= args.getNumber(this.lifetime);

			if (this._memcached) this._memcached.touch(key, lifetime, callback);
			else callback();
		}



		, get: function(key, callback) {
			var decode = function(err, data){
				if (callback) {
					if (err) callback(err);
					else {
						if (type.object(data)) {
							Object.keys(data).forEach(function(data){
								data[key] = JSON.parse(data[key]);
							});
							callback(null, data);
						}
						else callback(null, JSON.parse(data));
					}
				}
			}

			if (!this._memcached) callback();
			else if (type.array(key)) this._memcached.getMulti(key, decode);
			else if (type.string(key)) this._memcached.get(key, decode);
			else callback(new Error('Invalid key «'+key+'»!'));
		}



		, set: function() {
			var   args 		= new Arguments(arguments)
				, callback 	= args.getFunction(this._doNothing)
				, key  		= args.getString()
				, lifetime 	= args.getNumber(this.lifetime)
				, value 	= args.getObject();

			if (!this._memcached) callback();
			else if (type.string(key)) this._memcached.set(key, JSON.stringify(value), lifetime, callback || this._doNothing);
			else callback(new Error('Invalid key «'+key+'»!'));
		}


		, delete: function(key, callback) {
			if (!this._memcached) callback();
			else if (type.string(key)) this._memcached.del(key, callback || this._doNothing);
			else callback(new Error('Invalid key «'+key+'»!'));
		}	


		, _doNothing: function() {}
	});
}();

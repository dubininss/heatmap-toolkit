var fs = require('fs');
var events = require('events');
var util = require('util');
var uuid = require('node-uuid');

var FileWriter = function(options) {

	events.EventEmitter.call(this);

	var file_path = options['output-file'];
	if (!file_path) { throw new Error("bad output file: " + file_path) };

	this.stream = fs.createWriteStream(file_path, {'flags': 'a'});

	this.stream.on('error', function(e) {
		util.log("Error writing to file %s: %s", file_path, e);
	});

	this.on('data', function(data) {
		
		var entry = {
			"uid": uuid.v4(),
			"mouse_x_y": data.mouse_x + '-' + data.mouse_y,
			"timestamp": new Date(),
			"viewport": data.viewport_width + '-' + data.viewport_height,
			"visitor": data.visitor_id,
			"visit": data.visit_id,
			"event": parseInt(data.event_type),
			"scroll": data.scroll_y + '-' + data.scroll_x,
			"id": data.element_id,
			"class": data.element_class,
			"tag": data.element_tag,
			"browser": data.browser,
			"OS": data.operating_system,
			"url": data.request_path
		};
		
		this.stream.write(JSON.stringify(entry) + "\n");
	});

	this.on('close', function(data) {
		this.stream.close();
	});
};

util.inherits(FileWriter, events.EventEmitter);

module.exports = FileWriter;


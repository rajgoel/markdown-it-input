/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/
'use strict';

function input(md, config) {
	input.config = config;
	input.prefix = '';
	if ( input.config && input.config.prefix ) input.prefix = input.config.prefix + "-";

        for (let rule of input.rules) {
		md.block.ruler.before( 'hr', rule.name, input.parseBlock(rule) );

		md.renderer.rules[rule.type] = function (tokens, id, options, env) {
			var result;
			try {
				result = input.render( rule.type, tokens[id].content, rule.options ); 
			} 
			catch ( err ) {
				console.error( "Failed rendering " + rule.type + " input: " + JSON.stringify( tokens[id].content ) );
				console.error( err );
				if ( tokens[id].content.length ) {
					result = tokens[id].content[0];
				}
			}
			return result;
		};
        }
};


input.addAttributes = function( tag, attributes ) {
	if ( attributes && tag[tag.length -1 ] == '>') {
		tag = tag.slice(0, -1);
		for (var key in attributes) {
			if (attributes[key]) {
				tag += ' ' + key +'="' + attributes[key]+ '"';
			}
		}
		tag += '>';
	}
	return tag;
};

input.sanitize = function ( name ) {
	return name.replace(/\t/g, ' ').trim().replace(/[ \t]/g, '_').toLowerCase();
}

input.render = function( type, data, regexp ) {
	if ( data.length == 0 ) {
		console.error("No data for element to render!");
	}

	// Get parameters added within comment
	var params = {};
	if ( ( ( !regexp && data.length > 1) || ( regexp && data.length > 2) ) && data[data.length-1] ){
		params = JSON.parse( data[data.length-1] );
	}
	var divParams = params.div;
	var optionsParams = params.options;
	delete params.div;
	delete params.options;

	var label = '';

	var name = type;
	if ( type == "textarea") {
//console.log(data[3]);
		if ( data[3] ) name = data[3].trim();
	}
	else {
//console.log(data[2]);
		if ( data[1] ) label = data[1].trim();
		if ( data[2] ) {
			name = data[2].trim();
		}
		else {
			name = input.sanitize(label) || name;
		}
	}
//console.warn(type,label, name, "|", JSON.stringify(data), "|");

	// Determine whether input data has options
	var options = [];
	if ( regexp && data.length > 3) {
		options = data[3].trim().split(regexp).filter((s) => s != "");
//console.log("options: " + JSON.stringify(options));
	}

	if ( !divParams ) divParams = {}; 
	if ( !divParams.id ) divParams.id = input.prefix + name; 

	if ( !params ) params = {};
	if ( !params.name ) params.name = name; 
	if ( !params.id ) params.id = input.prefix + "input-" + name; 

	if (!optionsParams) optionsParams = [];
	optionsParams.length =  options.length;
	for (let i=0; i < options.length; i++) {
		if ( !optionsParams[i] ) optionsParams[i] = {};
		var j = options[i].lastIndexOf('|');
		if ( j >= 0 ) {
			optionsParams[i].value = options[i].substr(j+1).trim();
			options[i] = options[i].substr(0,j).trim();
		}
		if ( !optionsParams[i].value ) {
			optionsParams[i].value = options[i];
		}
	}	

//console.log("PARAMS: " + JSON.stringify(params));

	// Create div around input and add parameters
	var html = input.addAttributes( '<div>', divParams );

	switch( type ) {
		case "textfield":
			if ( data.length > 3 && data[3] ) {
				params.value = data[3];
			}
			html += '<label for="' + params.id + '">' + label + ' </label>';	
			html += input.addAttributes( '<input type="text">', params);
		break;
		case "textarea":
			var language = data[1].trim();
			if ( language ) {
				params['data-language'] = language;
			}

			if ( data[2] ) {
				params.value = data[2];
			}

			html += input.addAttributes( '<textarea>', params);
			if ( params.value ) html += params.value;
			html += '</textarea>';	
		break;
		case "checkbox":
			html += '<label>' + label + ' </label>';	
		        for (let i=0; i < options.length; i++) {
				if ( !optionsParams[i] ) optionsParams[i] = {};
				if ( !optionsParams[i].id ) optionsParams[i].id = input.prefix + input.sanitize(name + '-' + options[i]); 
				html += input.addAttributes('<input type="checkbox" name="' + name + '">', optionsParams[i]);	
				html += '<label for="' + optionsParams[i].id + '">' + options[i] + '</label>';	
			}
		break;
		case "radio":
			html += '<label>' + label + ' </label>';	
		        for (let i=0; i < options.length; i++) {
				if ( !optionsParams[i] ) optionsParams[i] = {};
				if ( !optionsParams[i].id ) optionsParams[i].id = input.prefix + input.sanitize(name + '-' + options[i]); 
				html += input.addAttributes('<input type="radio" name="' + name + '">', optionsParams[i]);	
				html += '<label for="' + optionsParams[i].id + '">' + options[i] + '</label>';	
			}
		break;
		case "select":
			html += '<label for="' + params.id + '">' + label + ' </label>';	
			html += input.addAttributes( '<select>', params);
		        for (let i=0; i < options.length; i++) {
				html += input.addAttributes('<option>', optionsParams[i]);	
				html += options[i] + '</option>' ;	
			}
			html += '</select>';	
		break;
	}
	html += '</div>';
//console.log(html);
	return html;
}

input.parseBlock = function(rule) { return function(state, startLine, endLine, silent) {
	rule.regexp.lastIndex = state.bMarks[startLine] + state.tShift[startLine];
	let match = rule.regexp.exec(state.src)
        if (match) {
	    match.lastIndex = rule.regexp.lastIndex;
            if (!silent) {
                let token = state.push(rule.type, '', 0);
                token.block = true;
                token.content = match;
            }
            for (let line=startLine, endpos=match.lastIndex-1; line < endLine; line++) {
                if (endpos >= state.bMarks[line] && endpos <= state.eMarks[line]) { // line for end of block math found ...
                    state.line = line+1;
                    break;
                }
	    }
            state.pos = match.lastIndex;
        }
        return !!match;
}};

input.parseLine = function(rule) { return function (state, silent) {
  var match = rule.regexp.exec(state.src);
  if (!match) return false;

  // valid match found, now we need to advance cursor
  state.pos += match[0].length;
  // don't insert any tokens in silent mode
  if (silent) return true;

  var token = state.push(rule.name, '', 0);
  token.content = match[0];
  token.markup = match[0];
  token.meta = { match: match };


  return true;
}};

input.rules = [
    {
		// Turns 'label[name] = ___' or 'label[name] = __value_' into form input element
                type: 'textfield', 
                regexp: /([^\n\[]*)(?:\[(.+)\])?\s*=\s*__+([^\n_]+)?_+\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy
    },
    {
		// Turns '\"\"\"lang\nvalue\n\"\"\"[name]'  into text area element
                type: 'textarea', 
                regexp: /(?:"""+(.*)((?:\n[^"].*)*)(?:\n"""+)+)(?:\[(.+)\])?(?:\n|$)\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy
    },
    {
		// Turns expressions like 'label[name] = [] option 1 | value 1 [] option 2 | value 2 [] option 3 | value 1' into checkboxes
                type: 'checkbox',
                regexp: /([^\n\[]*)(?:\[(.+)\])?\s*=\s*((?:\[\s?\][^\[\r\n]+\r?\n?)+)\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy,
		options: /\s*\[\s?\]\s*/
    },
    {
		// Turns expressions like 'label[name] = () option 1 | value 1 () option 2 | value 2 () option 3 | value 3' into radio buttons
                type: 'radio', 
                regexp: /([^\n\[]*)(?:\[(.+)\])?\s*=\s*((?:\(\s?\)[^\(\r\n]+\r?\n?)+)\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy,
		options: /\s*\(\s?\)\s*/
    },
    {
		// Turns expressions like 'label[name] = {option 1 | value 1, option 2 | value 2, option 3 | value 3}' into an HTML select
                type: 'select', 
                regexp: /([^\n\[]*)(?:\[(.+)\])?\s*=\s*{\r?\n?([^;}\r\n]+(?:;\r?\n?[^;}\r\n]+)*)\r?\n?}\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy,
		options: /\s*[;\{\}]\s*/
    }
];

if (typeof module === "object" && module.exports)
   module.exports = input;

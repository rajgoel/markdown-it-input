/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/
'use strict';

function input(md) {
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
			tag += ' ' + key +'="' + attributes[key]+ '"';
		}
		tag += '>';
	}
	return tag;
};

input.sanitize = function ( name ) {
	return name.replace(/\t/g, ' ').trim().replace(/[ \t]/g, '_').toLowerCase();
}

input.render = function( type, data, regexp ) {
	var label = '';
	if ( data.length > 0 ) {
		label = data[1].trim();
	}


	// Get parameters added within comment
	var params = {};
	if ( ( ( !regexp && data.length > 1) || ( regexp && data.length > 2) ) && data[data.length-1] ){
		params = JSON.parse( data[data.length-1] );
	}

	// If no name is given create name from label
	if ( !params.name) {
		params.name = input.sanitize(label);
	}

	// Determine whether input data has options
	var options = [];
	if ( regexp && data.length > 1) {
		options = data[2].trim().split(regexp).filter((s) => s != "");
//console.log("options: " + JSON.stringify(options));
	}
	if (!params.children) params.children = [];
	params.children.length =  options.length;
	for (let i=0; i < options.length; i++) {
		if ( !params.children[i] ) params.children[i] = {};
		if ( !params.children[i].value ) params.children[i].value = options[i]
	}	

//console.log("PARAMS: " + JSON.stringify(params));

	// Create div around input and add parameters
	var html = input.addAttributes( '<div>', params.container );

	switch( type ) {
		case "textfield":
			// Creates a text input element.
			// Converts text of the form:
			//
			// "first name = ___"
			//
			// into a form input like:
			//
			// <div>
			// <label for="first_name">First Name </label>
			// <input type="text" name="first_name"/>
			// </div>
			//
			// Specifics:
			// * Requires at least 3 underscores on the right-hand side of the equals sign.

			if ( !params.element ) params.element = {};
			if ( !params.element.name ) params.element.name = params.name; 
			if ( !params.element.id ) params.element.id = params.name; 
			html += '<label for="' + params.element.id + '">' + label + ' </label>';	
			html += input.addAttributes( '<input type="text">', params.element);
			html += '</input>';
		break;
		case "textarea":
			// Creates a textarea element.
			// Converts text of the form:
			//
			// "___"
			// "___"
			//
			// into a form input like:
			//
			// <div>
			// <textarea></textarea>
			// </div>
			//
			// Specifics:
			// * Requires at least two lines starting with at least 3 underscores each

			if ( !params.element ) params.element = {};
			if ( !params.element.name ) params.element.name = params.name; 
			html += input.addAttributes( '<textarea>', params.element);
			if ( params.value ) html += params.value;
			html += '</textarea>';	
		break;
		case "checkbox":
			// Creates a group of checkboxes.
			// Converts text of the form:
			//
			// Select your option(s) = [] Option 1 [] Option 2 [] Option 3
			//
			// into:
			//
			// <div>
			// <label>Select your option(s) </label>
			// <input type="checkbox" name="select_your_option(s)" id="select_your_option(s)-option_1" value="Option 1">
			// <label for="select_your_option(s)-option_1">Option 1</label>
			// <input type="checkbox" name="select_your_option(s)" id="select_your_option(s)-option_2" value="Option 2">
			// <label for="select_your_option(s)-option_2">Option 2</label>
			// <input type="checkbox" name="select_your_option(s)" id="select_your_option(s)-option_3" value="Option 3">
			// <label for="select_your_option(s)-option_3">Option 3</label>
			// </div>

			html += '<label>' + label + ' </label>';	
		        for (let i=0; i < options.length; i++) {
				if ( !params.children[i] ) params.children[i] = {};
				if ( !params.children[i].id ) params.children[i].id = input.sanitize(params.name + '-' + options[i]); 
				html += input.addAttributes('<input type="checkbox" name="' + params.name + '">', params.children[i]);	
				html += '</input>';
				html += '<label for="' + params.children[i].id + '">' + options[i] + '</label>';	
			}
		break;
		case "radio":
			// Creates a group of radio buttons.
			// Converts text of the form:
			//
			// Select (exactly) one option = () Option 1 () Option 2 () Option 3
			//
			// into:
			//
			// <div>
			// <label>Select (exactly) one option </label>
			// <input type="radio" name="select_(exactly)_one_option" id="select_(exactly)_one_option-option_1" value="Option 1">
			// <label for="select_(exactly)_one_option-option_1">Option 1</label>
			// <input type="radio" name="select_(exactly)_one_option" id="select_(exactly)_one_option-option_2" value="Option 2">
			// <label for="select_(exactly)_one_option-option_2">Option 2</label>
			// <input type="radio" name="select_(exactly)_one_option" id="select_(exactly)_one_option-option_3" value="Option 3">
			// <label for="select_(exactly)_one_option-option_3">Option 3</label>
			// </div>

			html += '<label>' + label + ' </label>';	
		        for (let i=0; i < options.length; i++) {
				if ( !params.children[i] ) params.children[i] = {};
				if ( !params.children[i].id ) params.children[i].id = input.sanitize(params.name + '-' + options[i]); 
				html += input.addAttributes('<input type="radio" name="' + params.name + '">', params.children[i]);	
				html += '</input>';
				html += '<label for="' + params.children[i].id + '">' + options[i] + '</label>';	
			}
		break;
		case "select":
			// Creates an HTML dropdown menu.
			//
			// Converts text of the form:
			//
			// Please select = {Option 1, 2; Option 3; Option 4, 5}
			//
			// into:
			//
			// <div>
			// <label for="please_select">Please select </label>
			// <select name="please_select" id="please_select">
			// <option value="Option 1, 2">Option 1, 2</option>
			// <option value="Option 3">Option 3</option>
			// <option value="Option 4, 5">Option 4, 5</option>
			// </select>
			// </div>			

			if ( !params.element ) params.element = {};
			if ( !params.element.name ) params.element.name = params.name; 
			if ( !params.element.id ) params.element.id = params.name; 
			html += '<label for="' + params.element.id + '">' + label + ' </label>';	
			html += input.addAttributes( '<select>', params.element);
		        for (let i=0; i < options.length; i++) {
				html += input.addAttributes('<option>', params.children[i]);	
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
		// Turns "label = ___" into form input element
                type: 'textfield', 
                regexp: /(.*)\s*=\s*___\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy
    },
    {
		// Turns "___\n___"  into text area element
                type: 'textarea', 
                regexp: /(____*(?:\n____*)+)(?:\n|$)\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy
    },
    {
		// Turns expressions like "label = [] option 1 [] option 2 [] option 3" into checkboxes
                type: 'checkbox',
                regexp: /(.*)\s*=\s*((?:\[\s?\][^\[\r\n]+\r?\n?)+)\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy,
		options: /\s*\[\s?\]\s*/
    },
    {
		// Turns expressions like "label = () option 1 () option 2 () option 3" into radio buttons
                type: 'radio', 
                regexp: /(.*)\s*=\s*((?:\(\s?\)[^\(\r\n]+\r?\n?)+)\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy,
		options: /\s*\(\s?\)\s*/
    },
    {
		// Turns expressions like "label = {option 1, option 2, option 3}" into an HTML select
                type: 'select', 
                regexp: /(.*)\s*=\s*{\r?\n?([^;}\r\n]+(?:;\r?\n?[^;}\r\n]+)*)\r?\n?}\s*(?:<!--\s*input:\s*({.*})\s*-->)?/gy,
		options: /\s*[;\{\}]\s*/
    }
];

if (typeof module === "object" && module.exports)
   module.exports = input;

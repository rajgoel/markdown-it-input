# markdown-it-input

Add input fields to your Markdown documents rendered by [markdown-it](https://github.com/markdown-it/markdown-it) parser.

## Input fields

### Text 
Converts text of the form:
```
first name = ___
```

into:
```html
<div>
<label for="first_name">First Name </label>
<input type="text" name="first_name"/>
</div>
```

### Textarea
Converts text of the form:
```
___
___
```

into:
```html
<div>
<textarea></textarea>
</div>
```

### Checkboxes
Converts text of the form:
```
Select your option(s) = [] Option 1 [] Option 2 [] Option 3
```
into:
```html
<div>
<label>Select your option(s) </label>
<input type="checkbox" name="select_your_option(s)" id="select_your_option(s)-option_1" value="Option 1">
<label for="select_your_option(s)-option_1">Option 1</label>
<input type="checkbox" name="select_your_option(s)" id="select_your_option(s)-option_2" value="Option 2">
<label for="select_your_option(s)-option_2">Option 2</label>
<input type="checkbox" name="select_your_option(s)" id="select_your_option(s)-option_3" value="Option 3">
<label for="select_your_option(s)-option_3">Option 3</label>
</div>
```

### Radio buttons
Converts text of the form:
```
Select (exactly) one option = () Option 1 () Option 2 () Option 3
```
into:
```html
<div>
<label>Select (exactly) one option </label>
<input type="radio" name="select_(exactly)_one_option" id="select_(exactly)_one_option-option_1" value="Option 1">
<label for="select_(exactly)_one_option-option_1">Option 1</label>
<input type="radio" name="select_(exactly)_one_option" id="select_(exactly)_one_option-option_2" value="Option 2">
<label for="select_(exactly)_one_option-option_2">Option 2</label>
<input type="radio" name="select_(exactly)_one_option" id="select_(exactly)_one_option-option_3" value="Option 3">
<label for="select_(exactly)_one_option-option_3">Option 3</label>
</div>
```

### Dropdown list
Converts text of the form:
```
Please select = {Option 1, 2; Option 3; Option 4, 5}
```
into:
```html
<div>
<label for="please_select">Please select </label>
<select name="please_select" id="please_select">
<option value="Option 1, 2">Option 1, 2</option>
<option value="Option 3">Option 3</option>
<option value="Option 4, 5">Option 4, 5</option>
</select>
</div>
```

## Options
For each input element you can add a HTML comment
```html
<!-- input: { "name":"input", "container": {"class"="input"}, "element": {"value":"Some value"} } -->
```
to specify a name for the input field and to add attributes for the ```div``` container or the respective input element.
For checkboxes, radio boxes, and dropdown lists, you can also add an array of attributes for the different options, e.g.,
```html
<!-- input: { "name":"input", "container": {"class"="input"}, "children": [{},{"checked":"checked"},{}] } -->
```



## Use in Browser
```html
<html>
<head>
  <meta charset='utf-8'>
  <script src="markdown-it.min.js"></script>
  <script src="markdown-it-input.js"></script>
</head>

<body>
<div id="content">
Name = ___
<!-- input: { "name":"input1", "element": {"size":"30", "value":"Your name"} } -->

___
___
<!-- input: { "name":"input2", "value":"Your text\n...\n...\n...", "container":{"style":"margin-top:20px;margin-bottom:20px"},"element": {"rows":"10", "cols":"50",  "style":"background-color:lightgray"} } -->

Select your option(s) = [] Option 1 [] Option 2 [] Option 3
<!-- input: { "name":"input3", "children": [{},{"checked":"checked"},{}] } -->

Select (exactly) one option = () Option 1 () Option 2 () Option 3

Please select = {Option 1, 2; Option 3; Option 4, 5}
</div>

  <script>
	document.getElementById('content').innerHTML = markdownit().use(input).render( document.getElementById('content').innerHTML );
  </script>

</body>
</html>
```

## Dependencies

* [`markdown-it`](https://github.com/markdown-it/markdown-it): Markdown parser done right. Fast and easy to extend.


## Credits

The plugin is inspired by the [proposal for extending markdown to support input elements](https://www.ybrikman.com/writing/2011/07/26/proposal-extend-markdown-syntax-to/) by Yevgeniy Brikman.

## License

`markdown-it-input` is licensed under the [MIT License](./license.txt)

 © [Asvin Goel](https://github.com/rajgoel)

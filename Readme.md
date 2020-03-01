# markdown-it-input

Add input fields to your Markdown documents rendered by [markdown-it](https://github.com/markdown-it/markdown-it) parser.

## Input fields

### Text

A text field can be provided as

```
Name = ___
```

and will be converted into

```html
<div id="name">
<label for="input-name">Name </label>
<input type="text" name="name" id="input-name">
</div>
```

The `name` and the `id` attributes are automatically generated from the text before the `=` sign.
Alternatively, the `name` can be explictly given as shown in the example below and the `id` attributes are generated from the given name.


```
Name [yourname] = ___
```

This will be converted into

```html
<div id="yourname">
<label for="input-yourname">Name </label>
<input type="text" name="yourname" id="input-yourname">
</div>
```

It is possible to set the `value` of the text field as shown in the example below.

```
Name [yourname] = __Your name__
```

which will be converted into

```html
<div id="yourname">
<label for="input-yourname">Name </label>
<input type="text" name="yourname" id="input-yourname" value="Your name">
</div>
```

### Textarea

An empty text area can be provided as

```
"""
"""
```

and will be converted into

```html
<div id="textarea">
<textarea name="textarea" id="input-textarea">
</textarea>
</div>
```

It is possible to provide the `name`, `value`, and `data-language`  attributes as shown in the example below.

```
"""c++
#include <iostream>
using namespace std;

int main() 
{
    cout << "Hello, World!";
    return 0;
}
"""[code]
```

This will be converted into

```html
<div id="code">
<textarea name="code" id="input-code" data-language="c++" value="#include &lt;iostream&gt;\r\nusing namespace std;\r\n\r\nint main() \r\n{\r\n    cout &lt;&lt; \"Hello, World!\";\r\n    return 0;\r\n}\r\n">
#include <iostream>;
using namespace std;

int main() 
{
    cout << "Hello, World!";
    return 0;
}
</textarea>
</div>
```


### Checkboxes

A checkbox input can be provided as

```
Select your option(s)[checkbox] = [] Option 1 | Value 1 [] Option 2 | Value 2 [] Option 3 | Value 3
```

and will be converted into

```html
<div id="checkbox">
<label>Select your option(s) </label>
<input type="checkbox" name="checkbox" value="Value 1" id="checkbox-option_1">
<label for="checkbox-option_1">Option 1</label>
<input type="checkbox" name="checkbox" value="Value 2" id="checkbox-option_2">
<label for="checkbox-option_2">Option 2</label>
<input type="checkbox" name="checkbox" value="Value 3" id="checkbox-option_3">
<label for="checkbox-option_3">Option 3</label>
</div>
```

For every option the text after the `|` sign is used as `value`. 
It is possible to omitt the `|` sign and use the label as `value`.
If no `name` is provided, the `name` and `id` attributes are automatically generated.


### Radio buttons

A radio button input can be provided as

```
Select (exactly) one option[radio] = () Option 1 | Value 1 () Option 2 | Value 2 () Option 3  | Value 3
```

and will be converted into

```html
<div id="radio">
<label>Select (exactly) one option </label>
<input type="radio" name="radio" value="Value 1" id="radio-option_1">
<label for="radio-option_1">Option 1</label>
<input type="radio" name="radio" value="Value 2" id="radio-option_2">
<label for="radio-option_2">Option 2</label>
<input type="radio" name="radio" value="Value 3" id="radio-option_3">
<label for="radio-option_3">Option 3</label>
</div>
```

For every option the text after the `|` sign is used as `value`. 
It is possible to omitt the `|` sign and use the label as `value`.
If no `name` is provided, the `name` and `id` attributes are automatically generated.

### Dropdown menu

A dropdown menu  can be provided as

```
Please select[dropdown] = {Option 1 | Value 1 ; Option 2 | Value 2; Option 3 | Value 3 }
```

and will be converted into

```html
<div id="dropdown">
<label for="input-dropdown">Please select </label>
<select name="dropdown" id="input-dropdown">
<option value="Value 1">Option 1</option>
<option value="Value 2">Option 2</option>
<option value="Value 3">Option 3</option>
</select>
</div>
```
For every option the text after the `|` sign is used as `value`. 
It is possible to omitt the `|` sign and use the label as `value`.
If no `name` is provided, the `name` and `id` attributes are automatically generated.


## Custom attributes
For each input element you can add a HTML comment
```html
<!-- input: { "name":"input", "value":"Some value", "div": {"class"="input"} } -->
```
to specify a name for the input field and to add attributes for the ```div``` container or the respective input element.
For checkboxes, radio boxes, and dropdown lists, you can also add an array of attributes for the different options, e.g.,
```html
<!-- input: { "name":"input", "div": {"class"="input"}, "options": [{},{"checked":"checked"},{}] } -->
```

## Configuration

The plugin allows to specify a prefix for the `id` attributes.

```js
document.getElementById('content').innerHTML = markdownit({html: true}).use(input, { prefix: "myform"}).render( document.getElementById('content').innerHTML );
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

"""
"""
<!-- input: { "name":"mytextarea", "value":"Your text\n...\n...\n...", "div":{"id":"myTextareaID"} } -->

Select your option(s) = [] Option 1 [] Option 2 [] Option 3
<!-- input: { "name":"input3", "options": [{},{"checked":"checked"},{}] } -->

Select (exactly) one option = () Option 1 () Option 2 () Option 3

Please select = {Option 1; Option 2; Option 3}
</div>

  <script>
	document.getElementById('content').innerHTML = markdownit({html: true}).use(input, { prefix: "myform"}).render( document.getElementById('content').innerHTML );
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

# JSON Formatter for Chrome

I recently have been working on a REST API which returns the response in JSON format. When seen in Google Chrome this is rendered as plain unformatted text which makes large JSON structures hard to read. What I needed was a way of pretty-printing the JSON before displaying it in a browser.

I started by checking out the Extensions API here [http://developer.chrome.com/extensions](http://developer.chrome.com/extensions)

Google has provided a full, feature-rich API which provides the means the build complex browser extensions. For my extension I didn't need all the bells and whistles, but simply a way to intercept a browser page and change the HTML. Google has provided a way of doing this using [content scripts](https://developer.chrome.com/extensions/content_scripts).

### What is an Extension?

An extension is a small program written in Javascript, HTML and CSS which modifies and enhances the browser functionality.

### Getting started

The first thing to do is to create a directory where the extension will live. Then you need to create

*   **manifest.json** - contains extension metadata
*   **content.js** - A content script which allows the extension to read or make changes to the DOM.
*   **content.css** - A style sheet used to pretty print the JSON
*   **icon.js** - Represents the icon for the extension which is displayed on the Chrome toolbar

The manifest is simple enough for this extension. It defines the extension name, description, icon, and the content script. We do not want to apply the extension to every tab in the browser so the 'matches' property is used to restrict the extension to those URLs that we know will return valid JSON via our REST API. When a match is found, the content.js file will be automatically injected into the browser's DOM allowing it to access and change the page content.

<div style="background: #ffffff; overflow: auto; width: 500px; border: solid gray; border-width: .1em .1em .1em .8em; padding: .2em .6em;">

<pre style="margin: 0; line-height: 125%;">{
	<span style="color: #007700;">"manifest_version"</span>: <span style="color: #0000dd; font-weight: bold;">2</span>,

	<span style="color: #007700;">"name"</span>: <span style="background-color: #fff0f0;">"JSON Formatter"</span>,
	<span style="color: #007700;">"description"</span>: <span style="background-color: #fff0f0;">"Format JSON"</span>,
	<span style="color: #007700;">"version"</span>: <span style="background-color: #fff0f0;">"1.0"</span>,

	<span style="color: #007700;">"browser_action"</span>: {
		<span style="color: #007700;">"default_icon"</span>: <span style="background-color: #fff0f0;">"icon.png"</span>
	},
	<span style="color: #007700;">"content_scripts"</span>: [{
		<span style="color: #007700;">"matches"</span>: [<span style="background-color: #fff0f0;">"http://localhost:8181/api/*"</span>],
		<span style="color: #007700;">"css"</span>: [<span style="background-color: #fff0f0;">"content.css"</span>],
		<span style="color: #007700;">"js"</span>: [<span style="background-color: #fff0f0;">"content.js"</span>]
	}]
}
</pre>

</div>

### Updating the browser content

The nuts and bolts of this extension is to format the JSON. Instead of reinventing the wheel I found a handy [JSFiddle](http://jsfiddle.net/) script that was perfect. You can give it a go [here](http://jsfiddle.net/unlsj/).

### content.css

Styling is done courtesy of a simple stylesheet to highlight JSON key-value pairs and text content

<div style="background: #ffffff; overflow: auto; width: auto; border: solid gray; border-width: .1em .1em .1em .8em; padding: .2em .6em;">

<pre style="margin: 0; line-height: 125%;"><span style="color: #007700;">pre</span> {
   <span style="color: #008800; font-weight: bold;">background-color</span><span style="color: #333333;">:</span> <span style="color: #007020;">ghostwhite</span>;
   <span style="color: #008800; font-weight: bold;">border</span><span style="color: #333333;">:</span> <span style="color: #6600ee; font-weight: bold;">1px</span> <span style="color: #008800; font-weight: bold;">solid</span> <span style="color: #007020;">silver</span>;
   <span style="color: #008800; font-weight: bold;">padding</span><span style="color: #333333;">:</span> <span style="color: #6600ee; font-weight: bold;">10px</span> <span style="color: #6600ee; font-weight: bold;">20px</span>;
   <span style="color: #008800; font-weight: bold;">margin</span><span style="color: #333333;">:</span> <span style="color: #6600ee; font-weight: bold;">20px</span>; 
   }
<span style="color: #bb0066; font-weight: bold;">.json-key</span> {
   <span style="color: #008800; font-weight: bold;">color</span><span style="color: #333333;">:</span> <span style="color: #007020;">brown</span>;
   }
<span style="color: #bb0066; font-weight: bold;">.json-value</span> {
   <span style="color: #008800; font-weight: bold;">color</span><span style="color: #333333;">:</span> <span style="color: #007020;">navy</span>;
   }
<span style="color: #bb0066; font-weight: bold;">.json-string</span> {
   <span style="color: #008800; font-weight: bold;">color</span><span style="color: #333333;">:</span> <span style="color: #007020;">olive</span>;
   }
</pre>

</div>

### content.js

This script below is what gets injected into the browser tab. It is pretty self-explanatory. Lines 1-36 declare the variables and instantiate the JSON pretty-print code. Notice we have declared a variable library to hold the json pretty-printer. The meat of the extension begins at line 37\. Here we parse the whole document. We are assuming that the page will be presented as valid JSON. At line 39 we sanity check that we have a valid JSON data structure. The remaining code pretty-prints the JSON into valid HTML and creates a wrapper DOM element to hold it. This element is then appended to the document body. We also hide the existing document body which shows the unformatted JSON. I think simply removing the current body element would also work but I haven't tried this.

<div style="background: #ffffff; overflow: auto; width: auto; border: solid gray; border-width: .1em .1em .1em .8em; padding: .2em .6em;">

<table>

<tbody>

<tr>

<td>

<pre style="margin: 0; line-height: 125%; white-space: pre;"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50</pre>

</td>

<td>

<pre style="margin: 0; line-height: 125%; white-space: pre;"><span style="color: #008800; font-weight: bold;">var</span> library;
<span style="color: #008800; font-weight: bold;">var</span> jsonObject;
<span style="color: #008800; font-weight: bold;">var</span> prettyPrintedJson;
<span style="color: #008800; font-weight: bold;">var</span> pre;
<span style="color: #008800; font-weight: bold;">var</span> code;

<span style="color: #008800; font-weight: bold;">if</span> (<span style="color: #333333;">!</span>library)
{
   <span style="color: #008800; font-weight: bold;">var</span> library <span style="color: #333333;">=</span> {};
}

<span style="color: #888888;">// http://jsfiddle.net/unlsj/</span>
library.json <span style="color: #333333;">=</span> {
   replacer<span style="color: #333333;">:</span> <span style="color: #008800; font-weight: bold;">function</span>(match, pIndent, pKey, pVal, pEnd) {
	  <span style="color: #008800; font-weight: bold;">var</span> key <span style="color: #333333;">=</span> <span style="background-color: #fff0f0;">'<span class=json-key>'</span>;
	  <span style="color: #008800; font-weight: bold;">var</span> val <span style="color: #333333;">=</span> <span style="background-color: #fff0f0;">'<span class=json-value>'</span>;
	  <span style="color: #008800; font-weight: bold;">var</span> str <span style="color: #333333;">=</span> <span style="background-color: #fff0f0;">'<span class=json-string>'</span>;
	  <span style="color: #008800; font-weight: bold;">var</span> r <span style="color: #333333;">=</span> pIndent <span style="color: #333333;">||</span> <span style="background-color: #fff0f0;">''</span>;

	  <span style="color: #008800; font-weight: bold;">if</span> (pKey)
	  {
		 r <span style="color: #333333;">=</span> r <span style="color: #333333;">+</span> key <span style="color: #333333;">+</span> pKey.replace(<span style="color: #000000; background-color: #fff0ff;">/[": ]/g</span>, <span style="background-color: #fff0f0;">''</span>) <span style="color: #333333;">+</span> <span style="background-color: #fff0f0;">'</span>: '</span>;
	  }
	  <span style="color: #008800; font-weight: bold;">if</span> (pVal)
		 r <span style="color: #333333;">=</span> r <span style="color: #333333;">+</span> (pVal[<span style="color: #0000dd; font-weight: bold;">0</span>] <span style="color: #333333;">==</span> <span style="background-color: #fff0f0;">'"'</span> <span style="color: #333333;">?</span> str <span style="color: #333333;">:</span> val) <span style="color: #333333;">+</span> pVal <span style="color: #333333;">+</span> <span style="background-color: #fff0f0;">'</span>'</span>;
	  <span style="color: #008800; font-weight: bold;">return</span> r <span style="color: #333333;">+</span> (pEnd <span style="color: #333333;">||</span> <span style="background-color: #fff0f0;">''</span>);
	  },
   prettyPrint<span style="color: #333333;">:</span> <span style="color: #008800; font-weight: bold;">function</span>(obj) {
	  <span style="color: #008800; font-weight: bold;">var</span> jsonLine <span style="color: #333333;">=</span> <span style="color: #000000; background-color: #fff0ff;">/^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg</span>;
	  <span style="color: #008800; font-weight: bold;">return</span> JSON.stringify(obj, <span style="color: #008800; font-weight: bold;">null</span>, <span style="color: #0000dd; font-weight: bold;">3</span>)
		 .replace(<span style="color: #000000; background-color: #fff0ff;">/&/g</span>, <span style="background-color: #fff0f0;">'&amp;'</span>).replace(<span style="color: #000000; background-color: #fff0ff;">/\\"/g</span>, <span style="background-color: #fff0f0;">'&quot;'</span>)
		 .replace(<span style="color: #000000; background-color: #fff0ff;">/</g</span>, <span style="background-color: #fff0f0;">'&lt;'</span>).replace(<span style="color: #000000; background-color: #fff0ff;">/>/g</span>, <span style="background-color: #fff0f0;">'&gt;'</span>)
		 .replace(jsonLine, library.json.replacer);
	  }
   };

jsonObject <span style="color: #333333;">=</span> JSON.parse( <span style="color: #007020;">document</span>.body.innerText );

<span style="color: #008800; font-weight: bold;">if</span> ( jsonObject )
{
	<span style="color: #008800; font-weight: bold;">var</span> prettyPrintedJson <span style="color: #333333;">=</span> library.json.prettyPrint( jsonObject );
	<span style="color: #008800; font-weight: bold;">var</span> pre <span style="color: #333333;">=</span> <span style="color: #007020;">document</span>.createElement(<span style="background-color: #fff0f0;">"pre"</span>);
	<span style="color: #008800; font-weight: bold;">var</span> code <span style="color: #333333;">=</span> <span style="color: #007020;">document</span>.createElement(<span style="background-color: #fff0f0;">"code"</span>)

	pre.appendChild(code);
	<span style="color: #007020;">document</span>.body.firstChild.style.display <span style="color: #333333;">=</span> <span style="background-color: #fff0f0;">"none"</span>;
	code.innerHTML <span style="color: #333333;">=</span> prettyPrintedJson;

	<span style="color: #007020;">document</span>.body.appendChild(pre);
}
</pre>

</td>

</tr>

</tbody>

</table>

</div>

### Installing the extension

To install the plugin open the extensions tab by clicking the 'burger' menu in Chrome, which can be found in the top-right of the window just below the Close icon. Select More tools->Extensions. Another way is to open a new tab and type [chrome://extensions/](chrome://extensions/)

Once the extensions tab is open click the 'Load unpacked extension...' button and locate the directory where you saved you extension files. If all is well the page will refresh and you will see your extension listed.

The icon specified in the manifest will be displayed on the toolbar. Right-click the icon to remove the extension or hide it from the toolbar

### Running the extension

To run the extension simply navigate to a URL that matches the pattern defined in the manifest.json and you should see something like this.

### Debugging

Debugging is exactly the same as normal Javascript debugging in Chrome. Navigate to a tab that is running the extension and press F12\. Notice that a new tab is provided for exploring any content scripts that have been injected into the browser page.

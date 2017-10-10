var library;
var jsonObject;
var prettyPrintedJson;
var pre;
var code;

if (!library) {
    var library = {};
}

// http://jsfiddle.net/unlsj/
library.json = {
    replacer: function(match, pIndent, pKey, pVal, pEnd) {
        //var key = '<span class=json-key';
        var key = '<span class=';
        var val = '<span class=json-value>';
        var str = '<span class=json-string>';
        var r = pIndent || '';

        if (pKey) {
            var propName = pKey.replace(/[": ]/g, '');
            if (propName === "name")
                key += " json-name";
            else if (propName === "id")
                key += " json-id";
            key += ">";
            r = r + key + propName + '</span>: ';
        }
        if (pVal)
            r = r + (pVal[0] == '"'
                ? str
                : val) + pVal + '</span>';
        return r + (pEnd || '');
    },
    prettyPrint: function(obj) {
        var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
        return JSON.stringify(obj, null, 3).replace(/&/g, '&amp;').replace(/\\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(jsonLine, library.json.replacer);
    }
};

try {
    jsonObject = JSON.parse(document.body.innerText);
    if (jsonObject) {
        var prettyPrintedJson = library.json.prettyPrint(jsonObject);
        var pre = document.createElement("pre");
        var code = document.createElement("code")

        pre.appendChild(code);
        document.body.firstChild.style.display = "none";
        code.innerHTML = prettyPrintedJson;

        document.body.appendChild(pre);
    }
} catch (ex) {
    // do nothing
}

// http://paul.donnelly.org/2008/10/31/2-legged-oauth-javascript-function-for-yql/
var makeSignedRequest = function(ck, cks, encodedurl) {

    var accessor = {
        consumerSecret: cks, tokenSecret: ""
    };
    var message = {
        action: encodedurl,
        method: "GET",
        parameters: [
            ["oauth_version", "1.0"],
            ["oauth_consumer_key", ck]
        ]
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message);
    var baseStr = OAuth.decodeForm(OAuth.SignatureMethod.getBaseString(message));
    var theSig = "";

    if (parameterMap.parameters) {
        for (var item in parameterMap.parameters) {
            for (var subitem in parameterMap.parameters[item]) {
                if (parameterMap.parameters[item][subitem] == "oauth_signature") {
                    theSig = parameterMap.parameters[item][1];
                    break;
                }
            }
        }
    }

    var paramList = baseStr[2][0].split("&");
    paramList.push("oauth_signature="+ encodeURIComponent(theSig));
    paramList.sort(function(a, b) {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
    });

    var locString = "";
    for (var x in paramList) {
        locString += paramList[x] + "&";
    }

    var finalStr = baseStr[1][0] + "?" + locString.slice(0, locString.length - 1);

    return finalStr;
};

// http://www.hunlock.com/blogs/Mastering_JSON_(_JavaScript_Object_Notation_)#quickIDX11
function loadJSON(url) {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = url;
    headID.appendChild(newScript);
}

function processJSON(feed) {
    document.writeln('<article>');
    document.writeln('<h3>' + feed.title + '</h3>');
    for(i=0; i<feed.channel.items.length; i++) {
        document.write("<a href='" + feed.channel.items[i].link + "'>");
        document.writeln(feed.channel.items[i].title + "</a>");
    }
    document.writeln('</article>');
}

/*
    Samples Editor code
    Author: Jonathan Gomez Vazquez 2015

    Code is organized as follows:
    GLOBAL VARS - Editor's objects, balance stack and error line.
    MAIN FUNCTIONS - Variables and functions that are executed when loading and when the 'Load Player' button is clicked.
    LOAD EDITORS - Functions that iniciates and loads the 3 editors (Player URL, Code Editor, HTML Editor).
    CONTROL'S FUNCTIONS - All functions that are triggered by a UI control.
    BALANCE CODE - Checks wether the parenthesis and quotes are balanced. 
    FORMAT PLAYER CODE - The code is received on a one-line string. This section indents the code by brakets and quotes

*/



/* GLOBAL VARS */


var data = new Array(4); // Data from the HTLM page
var codeEditor, playerScriptEditor, HTMLEditor, finalCodeEditor; // Code Editor variable
var balanceStack = new Array(); // Strack to balance the code
var line = 1;// Counter to know in which line the error was found
var balanceQuotesFlag = false; // When a string starts brakets are not balance until closing the string
var balanceStackPreviousLine = 1; // Used to save the line of the element was taken out of the stack in order to show the correct line when an error happens

/* MAIN FUNCTIONS */

// Main function. Called when the page loads.
function loadAllContent(){
    getData();
    contentTemplate(data['description_items']);    
    loadCodeEditor(data['player_code']);
    loadPlayerURLEditor(data['player_id']);
    loadHTMLEditor(data['HTML_items']);
    loadFinalCodeditor();
    loadPlayerOptionsDropDown();
    loadPlayer();
}

// Function to load the Player. Also executed by 'Load Player' button
function loadPlayer(){
    destroyPlayer();
    $("#playerCode").html(HTMLEditor.getValue()); 
    loadPlayerURL();
}

// Gets data from DIV tag on the body, then removes the DIV.
function getData(){
    var playerCodeMsg = "/* Enter your Player Code and JavaScript code on this section */";
    var HTMLCodeMsg = "<!-- Enter your HTML code in this section -->\n";
    
    data['player_id'] = $("#pageParameters").attr('playerId');
    data['player_code'] = playerCodeMsg.concat($("#pageParameters").attr('code'));
    data['HTML_items'] = HTMLCodeMsg.concat($("#pageParameters").attr('HTMLCode'));
    data['description_items'] = $("#pageParameters").attr('description');
    $("#pageParameters").remove();

    return data;
}

// Page template
function contentTemplate(description){
    $("body").append("<body>"+
    "<div id='mktContent' class='mktEditable'>"+
        "<div id='leftContent'>"+
            "<div id='leftContentControl'>"+
                "<h2>Video</h2><br/><br/><br/>"+
                "<div id='playerCode'></div>"+
                "</div>"+
        "</div>"+
        "<div id='rightContent'>"+
            "<div id='rightContentControl'>"+
                "<h2>Description</h2><br/><br/><br/>"+
                description+
            "</div>"+
        "</div>"+
    "</div>"+
    "<div id='codeContent'>"+
        "<h2>Code Editors</h2>"+
            "<div id='controlsHolder'>"+
                "<nav>"+
                    "<ul>"+
                        "<li><a class='launch' id='launchPlayer' href='#'>Launch it!!</a></li>"+
                        "<li><a id='prettifyCode' href='#'>Make my code pretty</a></li>"+
                        "<li><a id='finalCode' href='#'>Show me the code</a></li>"+
                    "</ul>"+
                "</nav>"+
            "</div>"+
        "<br/><br/>"+
        "<div id='editorsTab' style=''>"+
            "<h4>Player URL: </h4>"+
            "<div id='playerScriptEditor'></div>"+
            "<h4>Javascript Code: </h4>"+
            "<div id='codeEditor'></div>"+
            "<div class='line'></div>"+
            "<h4>HTML Code: </h4>"+
            "<div id='htmlEditor'></div>"+
        "</div>"+
        "<div id='finalCodeTab'>"+
            "<h4>Copy this code to your web page code:</h4>"+
            "<div id='finalCodeEditor'></div>"+
        "</div>"+
    "</div>");
}

// Creates playerURLOptions dropdown used to update the player URL
function loadPlayerOptionsDropDown(){
    var playerOptionsData = {
        'none':'No Parameters',
        'platform=html5-priority': 'platform=html5-priority',
        'platform=html5-fallback': 'platform=html5-fallback',
        'platform=flash-only': 'platform=flash-only',
        'platform=flash': 'platform=flash',
        'tweaks=android-enable-hls': 'tweaks=android-enable-hls',
        'tweaks=html5-force-mp4': 'tweaks=html5-force-mp4'
    }
    
    var selectControl = $("<select id='playerURLOptions'/>");
    for(var i in playerOptionsData) {
        $("<option/>", {value: i, text: playerOptionsData[i]}).appendTo(selectControl);
    }

    selectControl.appendTo('#playerScriptEditor');
}

// Loads player script
function loadPlayerURL(){
    var playerURL = playerScriptEditor.getValue().trim();
    if (evalPlayerURL(playerURL)){
        $.getScript(playerURL, function(script, textStatus, jqXHR) {
            loadPlayerCode();
        });  
    }
}

// Validastes the Player Script URL and requests the script
function evalPlayerURL(playerURL){
    var validPlayerURL = /^(https?:\/\/)?(player\.ooyala\.com\/v3\/)([0-9a-zA-Z\_\-]{32})\??([0-9a-zA-Z\_\-]+\=[0-9a-zA-Z\_\-]+\&?)*$/;
    if (validPlayerURL.test(playerURL)){
        return 1;
    }else{
        alert('Error: Player script URL is not well formatted.');
        return 0;
    }
}

// Loads the player code by inserting a script tag on the HEAD tag
function loadPlayerCode(){
    balanceStack = new Array();
    
    var playerCode = codeEditor.getValue();
    if (balanceCode(playerCode)){
        var script = document.createElement('script');
        script.id = "ooPlayerCode"
        script.type = 'text/javascript';
        script.text = playerCode;

        document.getElementsByTagName('head')[0].appendChild(script);
    }
}

// Destroy player variables and clear player container
function destroyPlayer(){
     if (window["OO"] && window["OO"].Player) {
        // $("#ooyalaplayer").empty();
        $("#playerCode").empty();
        $("#ooPlayerCode").remove();
        delete window["OO"];
    }
}



/* LOAD EDITORS */

// Instanciate Code Editor
function loadCodeEditor(code){
    codeEditor = CodeMirror(document.getElementById("codeEditor"), {
        value: formatPlayerCode(code),
        mode: "javascript",
        lineNumbers: true,
        lineWrapping: true,
        theme: "blackboard"
    }); 

    codeEditor.setSize("100%","450px");
}

// Instanciate Player Script Editor
function loadPlayerURLEditor(playerId){
    playerScriptEditor = CodeMirror(document.getElementById("playerScriptEditor"), {
        value: "http://player.ooyala.com/v3/"+playerId,
        theme: "blackboard"
    }); 

    playerScriptEditor.setSize("850px","20px");
}

// Instanciate Code Editor
function loadHTMLEditor(code){
    HTMLEditor = CodeMirror(document.getElementById("htmlEditor"), {
        value: code,
        mode: "htmlmixed",
        lineNumbers: true,
        lineWrapping: true,
        theme: "blackboard"
    }); 

    HTMLEditor.setSize("100%","150px");

    $("#playerCode").html(data['HTML_items']); // Loads the HTML code into "playerCode" DIV
}

// Instanciate Final Code Editor
function loadFinalCodeditor(){
    finalCodeEditor = CodeMirror(document.getElementById("finalCodeEditor"), {
        value: "",
        mode: "htmlmixed",
        lineNumbers: true,
        lineWrapping: true,
        theme: "blackboard"
    }); 

    finalCodeEditor.setSize("100%","700px");
}

/* CONTROL'S FUNCTIONS */

// Called when prettifyCode is clicked
$(document).on("click","#launchPlayer",function(){
    //loadPlayer();
    balanceCode(codeEditor.getValue());
});

// Called when prettifyCode is clicked
$(document).on("click","#prettifyCode",function(){
    codeEditor.setValue(formatPlayerCode(codeEditor.getValue()));
});


// Generates the final code for the user
$(document).on("click","#finalCode",function(){
    if ($("#codeContent h2").html("Final Code")){
        $("#editorsTab").hide();
        $("#finalTab").show();
        $("#codeContent h2").html("Final Code");
        $("#finalCode").html("Back to edit");

        var finalCode = "<script src='"+playerScriptEditor.getValue()+"'></script>\n"+
            "<script>\n"+codeEditor.getValue()+"\n</script>\n\n"+HTMLEditor.getValue();
        
        finalCodeEditor.setValue(finalCode);

    }else{
        $("#finalTab").hide();
        $("#editorsTab").show();
        $("h2").html("Code Editor");
        $("#finalCode").html("Show me the code");
    }
});

// Called when playerURLOptions dropdown changes value. The URL is updated according to the new selection.
$(document).on("change","#playerURLOptions",function(){
    var playerURL = playerScriptEditor.getValue().trim();
    if (evalPlayerURL(playerURL)){
        if (/[\?\&]/.test(playerURL)){
            var URLSections = playerURL.split("?");
            var URLparams = URLSections[1].split("&");
            var newParameter = $(this).val().split("=");

            if (URLparams.length==1 && URLparams[0].indexOf(newParameter[0])==-1){
                // A parameter already exists. Adds a new one at the end of the line
                playerURL += "&" + $(this).val();
            }else{
                // Replace existing parameters for the same parameter with a new value
                playerURL = URLSections[0] + "?";
                
                for (var i=0;i<URLparams.length;i++){
                    if (URLparams[i].indexOf(newParameter[0])==0)
                        URLparams[i] = $(this).val();
                    playerURL += (i>0)? "&"+URLparams[i] : URLparams[i];
                }    
            }
        }else{
            // No parameters are at this point, the actual parameter is added with the '?' char
            playerURL += "?" + $(this).val();
        }

        // When selectin 'No Parameters', all parameters are removed from the URL
        if ($(this).val()=='none' && playerURL.indexOf("?")){
            playerURL = playerURL.substring(0,playerURL.indexOf("?"));
        }

        playerScriptEditor.setValue(playerURL);
    }
});



/* BALANCE CODE */

// Validates that the entered code balanced brakets and quotes
function balanceCode(playerCode){
    line = 1;
    balanceStack.length = 0;
    playerCode = playerCode.replace(/[^\(\)\[\]\{\}\'\"\n]/gim,"");
    for (var i=0;i<playerCode.length;i++){
        if (playerCode.charAt(i) == "\n"){
            line+=1;
        }else{
            var char = playerCode.charAt(i);
        var stackChar = peek(balanceStack);

        if (!evalQuotes(char,stackChar))
            if (!evalParentheses(char,stackChar))
                return 0;
        }
    }

    if (balanceStack.pop()!=undefined){
        alert("You have an error on your code. Wrong amount of quotes or parentheses.");
        return 0;
    }

    return 1;
}

// Evaluates quote chars
function evalQuotes(c,s){
    var quoteChars = /["']/;
    if (quoteChars.test(c)){
        if (s[0]!=c && !quoteChars.test(s)[0]){
            balanceStack.push([c,line.toString()]);
            balanceQuotesFlag = true;
        }else if(s[0]==c){
            balanceStack.pop();
            balanceQuotesFlag = false;
        }
        return 1;
    }
    
    // Returns 0 when it's not a quote
    // Returns 1 when flag is true to avoid validating brakets inside a string
    return (balanceQuotesFlag)? 1:0;
}

// Evaluates (), {}, [] chars
function evalParentheses(c,s){
    if (/[\(\{\[]/.test(c)){// Opening Brakets
        balanceStack.push([c,line.toString()]);
        return 1;
    }else if(/[\)\}\]]/.test(c)){// Closing Brakets
        switch(c){
            case ")":
                    if (s[0]=="(")
                        balanceStack.pop();
                    else{
                        alert("Error: Unexpected char '"+s[0]+"' near line " + balanceStackPreviousLine);
                        return 0;
                    }
                    break;
            case "]":
                    if (s[0]=="[")
                        balanceStack.pop();
                    else{
                        alert("Error: Unexpected char '"+s[0]+"' near line " + balanceStackPreviousLine);
                        return 0;
                    }
                    break;
            case "}":
                    if (s[0]=="{")
                        balanceStack.pop();
                    else{
                        alert("Error: Unexpected char '"+s[0]+"' near line " + balanceStackPreviousLine);
                        return 0;
                    }
                    break;
        }
        balanceStackPreviousLine = s[1];
        return 1;
    }
    return 1;
}

function error(char,line){
    alert("")
}

// Returns the value of last char on the stack
function peek(){
    var temp = balanceStack.pop();
    if (temp != undefined)
        balanceStack.push(temp);
    return temp;
}



/* FORMAT PLAYER CODE */

// Removes new line, tab and spaces from the code before indenting the code
function formatPlayerCode(code){
    var codeArray = code.split('\n');
    code = "";
    for (var i=0;i<codeArray.length;i++){
        code += codeArray[i].trim().replace(/[\n\r\t]/gm,"");
    }
    return autoindentCode(code);
}

// Indents the code by inseting new line and tab chars every '{', '}', ';' and '*/'
function autoindentCode(code){
    var tabCounter = 0;
    var quotesDetected = false;
    var quoteChar = "";
    for (var i=0;i<code.length;i++){
        var char = code.charAt(i);
        
        // Detects if a string has started to avoid indenting it's content
        if ((/[\'\"]/).test(char)){
            if (quoteChar==""){
                quoteChar = char;
                quotesDetected = true;
            }else if (quoteChar==char){
                quoteChar = "";
                quotesDetected = false;
            }
        }

        // Indents '{', '}', ';', '*/' cutting the code, creating the new section and concatenating everything back
        if ((/[\{\}\;\*]/).test(char) && !quotesDetected){
            if (char=="{"){
                tabCounter += 1;
                var newStr = char.concat("\n").concat(calculateTabs(tabCounter));
                code = code.substring(0,i).concat(newStr).concat(code.slice(i+1));
                i += newStr.length-1;
            }else if (char=="}"){
                var sliceStart = 1;
                if (code.substr(i,3)=="});"){
                    char = "});";
                    sliceStart = 3;
                }
                tabCounter -= 1;
                var newStr = (code.charAt(i-1)=="\n")? "":"\n";
                var newStrEnds = (code.charAt(i+sliceStart)!="}")?calculateTabs(tabCounter):"";
                newStr = newStr.concat(calculateTabs(tabCounter)).concat(char.concat("\n")).concat(newStrEnds);
                code = code.substring(0,i).concat(newStr).concat(code.slice(i+sliceStart));
                i += newStr.length-1;
            }else if (char==";"){
                var newStr = char.concat("\n").concat(calculateTabs(tabCounter));
                code = code.substring(0,i).concat(newStr).concat(code.slice(i+1));
                i += newStr.length;
            }else if (char+code.charAt(i+1)=="*/"){
                var newStr = ("*/").concat("\n").concat(calculateTabs(tabCounter));
                code = code.substring(0,i).concat(newStr).concat(code.slice(i+2));
                i += newStr.length;
            }
        }
        
    }
    return code.trim();
}

// Returns the amount of tabs that will be inserted to indent
function calculateTabs(t){
    var tabs = "";
    for (var i=0;i<t;i++)
        tabs = tabs.concat("\t"); 
    
    return tabs;
}
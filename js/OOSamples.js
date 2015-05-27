/*
    Samples Editor code
    Author: Jonathan Gomez Vazquez 2015
    Version: 1.0.1

    Code is organized as follows:
    
    - MAIN OBJECT (OOSamples): Objet used to load UI
    - PLAYER URL EDITOR
    - JS EDITOR
    - HTML EDITOR
    - FINAL EDITOR
    - BALANCE CODE
    - FORMAT PLAYER CODE
    - UI CONTROL'S FUNCTIONS
*/

/* MAIN OBJECT (OOSamples) */
var OOSamples = {
    // data : new Array(4), // Data from the HTLM page
    data: "",
    playerURL: "",
    playerCode : "",
    HTMLCode : "",
    finalCode : "",
    mainLayout: "",
    containerLayout:"",
    editorsLayout:"",
    contentLayout:"",

    loadData: function(){
        var id = (window.location.search!="")? window.location.search.substr(4) : "000000";
        
        $.get("samples/"+id).fail(function(x){
            alert("The requested sample was not found.");
            window.location.href = window.location.origin + window.location.pathname + "?id=000000";
        });
        
        $.getJSON("samples/"+id, function(data) {
            var playerCodeMsg = "/* Enter your Player Code and JavaScript code on this section */\n";
            var HTMLCodeMsg = "<!-- Enter your HTML code in this section -->\n";

            data[0].player_code = playerCodeMsg + data[0].player_code;
            data[0].HTML_items = HTMLCodeMsg + data[0].HTML_items;

            OOSamples.data = data[0];
            OOSamples.loadUI();
        });
    },

    // Main function. Called when the page loads.
    loadUI: function(){
        this.loadLayout(); 
        this.HTMLCode = new HTMLEditor(this.data['HTML_items'],"100%","100%","htmlEditor");
        this.playerCode = new JSEditor(this.data['player_code'],"100%","100%","codeEditor");
        this.finalCode = new FinalEditor("","100%","100%","finalCodeEditor");
        this.playerURL = new URLEditor(this.data['player_id'],"100%","20px","playerScriptEditor");
        this.loadPlayerDropDown();
        this.loadPlayer();            
    },

    // Function to load the Player. Also executed by 'Load Player' button
    loadPlayer: function(){
        $("#launchPlayer").removeClass("changes");
        this.playerURL.clearOut();
        this.playerURL.loadURL();
    },

    loadLayout: function(){
        var spacing = 4;
        this.contentTemplate();
        this.mainLayout = $('body').layout({
            spacing_open: spacing, 
            togglerLength_open: 0,
            togglerLength_closed: 0,
            north__size:70,
            north__resizable: false,
            west__size:138,
            west__resizable: false
            //stateManagement__enabled:true,
        });

        this.containerLayout = $('div.container').layout({
            name: "container",
            minSize: 200,
            spacing_open: spacing, 
            spacing_closed: spacing,
            togglerLength_open: 0,
            togglerLength_closed: 0,
            center__paneSelector: ".container-center",
            west__paneSelector: ".container-west",
            west__size: '50%',
            west__spacing_closed: 2
        });

        this.editorsLayout = $('div.editors').layout({
            name: "editors",
            minSize: 30,
            spacing_open: spacing, 
            spacing_closed: 0,
            togglerLength_open: 0,
            togglerLength_closed: 0,
            north__paneSelector: ".editors-north",
            north__size: 85,
            north__resizable: false,
            center__paneSelector: ".editors-center",
            south__paneSelector: ".editors-south",
            south__size: '29%',
        });

        this.contentLayout = $('div.content').layout({
            name: "content",
            minSize: 30,
            spacing_open: spacing, 
            spacing_closed: spacing,
            togglerLength_open: 0,
            togglerLength_closed: 0,
            center__paneSelector: ".content-player",
            south__paneSelector: ".content-description",
            south__size: '32%',
            south__spacing_closed: 2
        });
    },

    // Page template
    contentTemplate: function(){
       $("body").append("<div class='ui-layout-north'>"+
               "<div id='logo-wrapper'><a href='http://www.ooyala.com/' id='logo'><img src='imgs/logo_landingpage.png' alt='Ooyala' class='logo'/></a></div>"+
                "<h6>Unlocking the true revenue potential of digital TV.</h6>"+
            "</div>"+
            "<div class='ui-layout-center'>"+
                "<div class='container' style='height:100%;'>"+
                    "<div class='container-west'>"+
                        "<div class='editors' style='height:100%;'>"+
                            "<div class='editors-north editorHolder'>"+
                                "<h4>Player URL: </h4>"+
                                "<div id='playerScriptEditor'></div>"+
                            "</div>"+
                            "<div class='editors-center editorHolder'>"+    
                                "<div id='javascriptEditor'>"+
                                    "<h4>Javascript Code: </h4>"+
                                    "<div id='codeEditor'></div>"+
                                "</div>"+
                                "<div id='finalEditor'>"+
                                    "<h4>Copy this code to your web site. Changes can be done on this mode. To edit click on 'Edit Code'.</h4>"+
                                    "<div id='finalCodeEditor'></div>"+
                                "</div>"+
                            "</div>"+
                            "<div class='editors-south editorHolder'>"+
                                "<h4>HTML Code: </h4>"+
                                "<div id='htmlEditor'></div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                    "<div class='container-center'>"+
                        "<div class='content' style='height:100%;'>"+
                            "<div class='content-player'>"+
                                "<div id='leftContentControl'>"+
                                    "<h2 id='videoTitle'>Sample - "+this.data['title']+"</h2></br></br>"+
                                    "<div id='playerArea'></div>"+
                                "</div>"+
                            "</div>"+
                            "<div class='content-description'>"+
                                "<div id='rightContentControl'>"+
                                    "<h2>Description</h2><br/><br/>"+
                                    this.data['description_items']+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>"+
            "<div class='ui-layout-west'>"+
                "<div id='controlsHolder'>"+
                    "<nav>"+
                        "<ul>"+
                            "<li><div id='moreSamples'> <span id='burger-icon'>☰</span> Samples</div>"+
                                "<ul id='samples_menu' style='display:none;'>"+
                                    "<li><div class='samples_cat' id='sm_Configuration'>Player Configuration</div></li>"+
                                    "<li><div class='samples_cat' id='sm_Interaction'>Player Interaction</div></li>"+
                                    "<li><div class='samples_cat' id='sm_Monetization'>Monetization</div></li>"+
                                "</ul>"+
                            "</li>"+
                            "<li><div class='launch' id='launchPlayer'>Run</div></li>"+
                            "<li><div id='prettifyCode'>Prettify</div></li>"+
                            "<li><div id='finalCode'>Copy Code</div></li>"+
                            "<li><div id='sendToGist'>To Gist</div></li>"+
                            "<li><div id='hidePlayerURL' class='switch active'>Player URL</div></li>"+
                            "<li><div id='hideHTML' class='switch active'>HTML</div></li>"+
                            "<li><div id='hideDescription' class='switch active'>Description</div></li>"+
                        "</ul>"+
                    "</nav>"+
                "</div>"+
            "</div>"+
            "<div id='floatingMenu'>"+
                "<div class='triangle'></div>"+
                "<ul id=''>"+
                "</ul>"+
            "</div>");            
    },

    // Creates playerURLOptions dropdown used to update the player URL
    loadPlayerDropDown: function(){
        $("#playerScriptEditor").append("<p id='comboLabel'>Select an option for the Player URL:</p> ");
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

        selectControl.appendTo('#comboLabel');

    }
};// OOSamples end 


/* PLAYER URL EDITOR */
function URLEditor(val,width,height,UIElement){
    this.editor = CodeMirror(document.getElementById(UIElement), {
                        value: "http://player.ooyala.com/v3/"+val,
                        theme: "blackboard"
                    });
    this.editor.setSize(width,height);
    this.code = function(){return this.editor.getValue().trim(); };

    this.loadURL = function(){
        if (this.evalURL()){
            $.getScript(this.code(), function(script, textStatus, jqXHR) {
                OOSamples.playerCode.loadCode();
            });  
        }else
            alert('Error: Player script URL is not well formatted.');
    };

    this.evalURL = function(){
        var validPlayerURL = /^(https?:\/\/)?(player\.ooyala\.com\/v3\/)([0-9a-zA-Z\_\-]{32})\??([0-9a-zA-Z\_\-]+\=[0-9a-zA-Z\_\-]+\&?)*$/;
        return (validPlayerURL.test(this.code()))? 1 : 0;
    };
    // Destroy player variables and clear player container
    this.clearOut = function(){
         if (window["OO"] && window["OO"].Player) {
            $("#playerArea").empty();
            $("#OOPlayerCode").remove();
            delete window["OO"];
        }
    }
}

/* JS EDITOR */
function JSEditor(val,width,height,UIElement){
    this.editor = CodeMirror(document.getElementById(UIElement), {
                        // value: formatCode.format(val),
                        value: beautifyCode.JS(val),
                        theme: "blackboard",
                        mode: "javascript",
                        lineNumbers: true,
                        lineWrapping: true,
                        matchBrackets: true,
                    });

    this.editor.on('change', function(){ $("#launchPlayer").addClass("changes"); });
    this.editor.setSize(width,height);
    this.code = function(){return this.editor.getValue().trim(); };
    this.loadCode = function(){
        if (balanceCode.start(this.code())){
            OOSamples.HTMLCode.loadCode();

            var script = document.createElement('script');
            script.id = "OOPlayerCode"
            script.type = 'text/javascript';
            script.text = this.code();

            document.getElementsByTagName('head')[0].appendChild(script);
        }     
    };
    this.loadPrettyCode = function(){
        this.editor.setValue(beautifyCode.JS(this.code()));
    }
}

/* HTML EDITOR */
function HTMLEditor(val,width,height,UIElement){
    this.editor = CodeMirror(document.getElementById(UIElement), {
        value: beautifyCode.HTML(val),
        mode: "htmlmixed",
        lineNumbers: true,
        lineWrapping: true,
        theme: "blackboard",
        autoCloseTags: true
    }); 
    this.editor.setSize(width,height);
    this.code = function(){return this.editor.getValue().trim(); };
    this.loadCode = function(){
        $("#playerArea").html(this.code()); // Loads the HTML code into "playerArea" DIV
    }
}

/* FINAL EDITOR */
function FinalEditor(val,width,height,UIElement){
    this.editor = CodeMirror(document.getElementById(UIElement), {
        value: beautifyCode.HTML(val),
        mode: "htmlmixed",
        lineNumbers: true,
        lineWrapping: true,
        theme: "blackboard",
        readOnly: true
    }); 
    this.editor.setSize(width,height);
    this.code = function(){return this.editor.getValue().trim(); };
    this.display = function(){
        $("#finalCode").toggleClass("active");
        OOSamples.editorsLayout.toggle('north');
        OOSamples.editorsLayout.toggle('south');
        if (this.hidden){
            $("#javascriptEditor").hide();
            $("#finalEditor").show();
            $("#finalCode").html("Edit Code");
            $("#controlsHolder ul li div").css({"color":"#666"});
            $("#finalCode").css({"color":"#bbb"});

            this.editor.setValue("<script src='"+OOSamples.playerURL.code()+"'></script>\n"+
                 "<script>\n"+OOSamples.playerCode.code()+"\n</script>\n\n"+OOSamples.HTMLCode.code());
        }else{
            $("#finalEditor").hide();
            $("#javascriptEditor").show();
            $("#finalCode").html("Copy Code");
            $("#controlsHolder ul li div").css({"color":"#bbb"});
        }
        this.hidden = !this.hidden;
    };
    this.hidden = true;
}

// Called when playerURLOptions dropdown changes value. The URL is updated with the new selection.
$(document).on("change","#playerURLOptions",function(){
    if (OOSamples.playerURL.evalURL()){
        var code = OOSamples.playerURL.code();
        if (/[\?\&]/.test(code)){
            var URLSections = code.split("?");
            var URLparams = URLSections[1].split("&");
            var newParameter = $(this).val().split("=");

            if (URLparams.length==1 && URLparams[0].indexOf(newParameter[0])==-1){
                // A parameter already exists. Adds a new one at the end of the line
                code += "&" + $(this).val();
            }else{
                // Replace existing parameters for the same parameter with a new value
                code = URLSections[0] + "?";
                
                for (var i=0;i<URLparams.length;i++){
                    if (URLparams[i].indexOf(newParameter[0])==0)
                        URLparams[i] = $(this).val();
                    code += (i>0)? "&"+URLparams[i] : URLparams[i];
                }    
            }
        }else{// When there aren't parameters, the actual parameter is added with the '?' char
            code += "?" + $(this).val();
        }

        // When selectin 'No Parameters', all parameters are removed from the URL
        if ($(this).val()=='none' && code.indexOf("?")){
            code = code.substring(0,code.indexOf("?"));
        }

        OOSamples.playerURL.editor.setValue(code);
    }
});


/* BALANCE CODE */
var balanceCode = {
    stack : new Array(), // Strack to balance the code
    line : 1,// Counter to know in which line the error was found
    quotesFlag : false, // When a string starts brakets are not balance until closing the string
    previousLineOnStak : 1, // Used to save the line of the element was taken out of the stack in order to show the correct line when an error happens
    char : "",
    stackChar : "",

    // Validates that the entered code has balanced brakets and quotes
    start: function(code){
        this.restartVars();
        code = code.replace(/[^\(\)\[\]\{\}\'\"\n]/gim,"");
        for (var i=0;i<code.length;i++){
            if (code.charAt(i) == "\n"){
                this.line+=1;
            }else{
                this.char = code.charAt(i);

                // Returns the value of last char on the stack
                var temp = this.stack.pop();
                if (temp != undefined) 
                    this.stack.push(temp)
                this.stackChar = temp;

                if (!this.checkQuotes())
                    if (!this.checkBrakets())
                        return 0;
            }
        }

        if (this.stack.pop()!=undefined){
            alert("You have an error on your code. Wrong amount of quotes or parentheses.");
            return 0;
        }
        return 1;
    },

    // Evaluates quote chars
    checkQuotes: function (){
        if (/["']/.test(this.char)){
            if (this.stackChar== undefined){
                this.quotesFlag = true;
                return 1;
            }
            if (this.stackChar[0]!=this.char && !/["']/.test(this.stackChar[0])){
                this.pushToStak();
                this.quotesFlag = true;
            }else if(this.stackChar[0]==this.char){
                this.stack.pop();
                this.quotesFlag = false;
            }
            return 1;
        }
        
        // Returns 0 when it's not a quote
        // Returns 1 when flag is true to avoid validating brakets inside a string
        return (this.quotesFlag)? 1:0;
    },

    // Evaluates (), {}, [] chars
    checkBrakets: function(){
        if (/[\(\{\[]/.test(this.char)){// Opening Brakets
            this.pushToStak();
            return 1;
        }else if(/[\)\}\]]/.test(this.char)){// Closing Brakets
            this.previousLineOnStak = this.stackChar[1];
            switch(this.char){
                case ")":
                        return this.testClosingBracket("(");
                        break;
                case "]":
                        return this.testClosingBracket("[");
                        break;
                case "}":
                        return this.testClosingBracket("{");
                        break;
            }
            return 1;
        }
        return 1;
    },

    pushToStak: function(){
        this.stack.push([this.char,this.line.toString()]);
    },

    testClosingBracket: function(testChar){
        if (this.stackChar[0]==testChar){
            this.stack.pop();
            return 1;
        }else{
            alert("Error: Unexpected char '"+this.stackChar[0]+"' near line " + this.previousLineOnStak);
            return 0;
        }
    },

    restartVars: function(){
        this.stack.length = 0;
        this.line = 1;
        this.quotesFlag = false;
        this.previousLineOnStak = 1;
        this.char = "";
        this.stackChar.length = 0;
    }
};//balanceCode ends


/* BEAUTIFY PLAYER CODE */
var beautifyCode = {
    JS: function(code){
        return js_beautify(code, {
            'indent_size': 1,
            'indent_char': '\t',
            'brace_style':'end-expand'
        });
    },

    HTML: function(code){
        return style_html(code, {
            'indent_inner_html': false,
            'indent_size': 1,
            'indent_char': '\t',
            'wrap_line_length': 78,
            'brace_style': 'expand',
            'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u'],
            'preserve_newlines': true,
            'indent_handlebars': false,
            'extra_liners': ['/html']
        },true,true);
    }
}// beautify ends

/* UI CONTROL'S FUNCTIONS */

$(document).on("click","#launchPlayer",function(){
    if (OOSamples.finalCode.hidden)
        OOSamples.loadPlayer();
});

$(document).on("click","#prettifyCode",function(){
    if (OOSamples.finalCode.hidden)
        OOSamples.playerCode.loadPrettyCode();
});

$(document).on("click","#finalCode",function(){
    OOSamples.finalCode.display();
});

$(document).on("click","#hideDescription",function(){
    if (OOSamples.finalCode.hidden){
        $("#hideDescription").toggleClass("active");
        OOSamples.contentLayout.toggle('south');
    }
});

$(document).on("click","#hideHTML",function(){
    if (OOSamples.finalCode.hidden){
        $("#hideHTML").toggleClass("active");
        OOSamples.editorsLayout.toggle('south');
    }
});

$(document).on("click","#hidePlayerURL",function(){
    if (OOSamples.finalCode.hidden){
        $("#hidePlayerURL").toggleClass("active");
        OOSamples.editorsLayout.toggle('north');    
    }
});

$(document).on("click","#sendToGist",function(){
    if (OOSamples.finalCode.hidden){
        sendToGist();
    }
});

$(document).on("click","#moreSamples",function(){
    if (OOSamples.finalCode.hidden){
        if ($("#samples_menu").is(':visible') == true){
            $("#samples_menu").slideUp("slow");
            $("#floatingMenu").hide();
        }else
            $("#samples_menu").slideDown("slow");
    }

});

$(document).on("mouseover","#sm_Configuration",function(){
    $("#floatingMenu").show();
    $("#floatingMenu .triangle").offset({ top: 122, left: 137 });
    $("#floatingMenu ul").html("<li><div class='' id='000000'>Player Basic embed code</div></li>"+
                    "<li><div class='' id='000011'>Parameters 1</div></li>"+
                    "<li><div class='' id='000013'>Parameters 2</div></li>"+
                    "<li><div class='' id='000003'>Load Dynamically</div></li>"+
                    "<li><div class='' id='000015'>Set Embed Code</div></li>"+
                    "<li><div class='' id='000005'>HTML5 CC</div></li>"+
                    "<li><div class='' id='000001'>Flash CC</div></li>"+
                    "<li><div class='' id='000009'>Omniture</div></li>"+
                    "<li><div class='' id='000010'>Player Token</div></li>");
});

$(document).on("mouseover","#sm_Interaction",function(){
    $("#floatingMenu").show();
    $("#floatingMenu .triangle").offset({ top: 167, left: 137 });
    $("#floatingMenu ul").html( "<li><div class='' id='000016'>Set Volume</div></li>"+
                    "<li><div class='' id='000014'>Replay</div></li>"+
                    "<li><div class='' id='000004'>Fullscreen</div></li>"+
                    "<li><div class='' id='000007'>Intercept</div></li>"+
                    "<li><div class='' id='000002'>Destroy</div></li>");
});

$(document).on("mouseover","#sm_Monetization",function(){
    $("#floatingMenu").show();
    $("#floatingMenu .triangle").offset({ top: 210, left: 137 });
    $("#floatingMenu ul").html( "<li><div class='' id='000012'>VAST</div></li>"+
                    "<li><div class='' id='000006'>Google IMA</div></li>"+
                    "<li><div class='' id='000017'>VPAID</div></li>"+
                    "<li><div class='' id='000008'>LiveRail</div></li>");
    
});

$(document).on("click","#floatingMenu ul li div",function(){
    window.location.replace(window.location.origin+ window.location.pathname+"?id="+$(this).attr("id"));
});

$(document).on("click","div",function(evt){
// $('div').click(function(evt){    
    if(evt.target.className == "samples_cat")
        return;

    if(evt.target.id == "moreSamples")
        return;

    if($(evt.target).closest('.samples_cat, #moreSamples').length)
        return;     


    if ($("#samples_menu").is(':visible') == true){
        $("#samples_menu").slideUp("slow");
        $("#floatingMenu").hide();
    }
});

function sendToGist(){
   var data = {
        "description": "posting gist test",
        "public": true,
        "files": {
          "test.txt": {
                  "content": "<script src='"+OOSamples.playerURL.code()+"'></script>\n"+
                     "<script>\n"+OOSamples.playerCode.code()+"\n</script>\n\n"+OOSamples.HTMLCode.code()
          }
        }
      }

  $.ajax({
    url: 'https://api.github.com/gists',
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(data)
  })
  .success( function(e) {
    console.log(e);
    alert("Your code has been sent to Gist:\n\n"+e.html_url)
  })
  .error( function(e) {
    console.warn("Gist save error", e);
  });
  
   
}
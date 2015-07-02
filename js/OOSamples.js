/*
    Samples Editor code
    Author: Jonathan Gomez Vazquez 2015
    Version: 1.0.8

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
    data: "",
    playerURL: "",
    playerCode : "",
    HTMLCode : "",
    finalCode : "",
    mainLayout: "",
    containerLayout:"",
    editorsLayout:"",
    contentLayout:"",
    visualStyle:"",
    gistURL:"",
    floatingMenu_callerID:"",

    loadData: function(){
        var id = (window.location.search!="")? window.location.search.substr(4) : "000000";
        
        $.get("samples/"+id).fail(function(x){
            alert("The requested sample was not found.");
            window.location.href = window.location.origin + window.location.pathname + "?id=000000";
        });
        
        $.getJSON("samples/"+id, function(data) {
            var playerCodeMsg = "/* Enter your Player Code and JavaScript code in this section */\n";
            var HTMLCodeMsg = "<!-- Enter your HTML code in this section -->\n";

            data[0].player_code = playerCodeMsg + data[0].player_code;
            data[0].HTML_items = HTMLCodeMsg + data[0].HTML_items;
            if ((data[0].instructions_items != "") && (data[0].instructions_items!=undefined))
                data[0].instructions_items = "<h2>Instructions</h2><br/><br><ul class='instructions'>"+data[0].instructions_items+"</ul>";
            else
                data[0].instructions_items = "";

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
        this.getStyleCookie();
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
            west__size:40,
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
               "<div id='logo-wrapper'><a href='http://www.ooyala.com/' id='logo'><img src='imgs/logo_landingpage.png' alt='Ooyala' class='logo'/></a> <h1 style='position: fixed;top: -4px;left: 213px;color: #444;'>PLAYGROUND</h1></div>"+
                "<h6>Code and play like never before.</h6>"+
                "<div id='APIdocumentation' class='button APIbtn'><div><a href='http://apidocs.ooyala.com/' target='blank'>API Documentation</a></div></div>"+
            "</div>"+
            "<div class='ui-layout-center'>"+
                "<div class='container' style='height:100%;'>"+
                    "<div class=' container-west'>"+
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
                                    "<h4>The below code was generated with the code available on the code editors. Copy this code to your webpage. <br> Changes cannot be done on this mode. To exit copy mode, click on the 'Close' icon on the left menu bar.</h4>"+
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
                                    this.data['instructions_items']+
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
                            "<li><div id='moreSamples' class='menu' tooltip='Samples' icon='fa-navicon'><i class='fa fa-navicon fa-lg'></i></div></li>"+
                            "<li><div id='launchPlayer' class='menu' tooltip='Run' icon='fa-play'><i class='fa fa-play fa-lg'></i></div></li>"+
                            "<li><div id='prettifyCode' class='menu' tooltip='Prettify' icon='fa-magic'><i class='fa fa-magic fa-lg'></i></div></li>"+
                            "<li><div id='debugCode' class='switch menu' tooltip='Debug' icon='fa-cog'><i class='fa fa-bug fa-lg'></i></div></li>"+
                            "<li><div id='finalCode' class='menu' tooltip='Copy all code' icon='fa-copy'><i class='fa fa-copy fa-lg'></i></div></li>"+
                            "<li><div id='sendToGist' class='menu' tooltip='Send to Gist' icon='fa-github'><i class='fa fa-github fa-lg'></i></div></li>"+
                            "<li><div id='hidePlayerURL' class='switch active menu' tooltip='Player URL' icon='fa-check'><i class='fa fa-link fa-lg'></i></div></li>"+
                            "<li><div id='hideHTML' class='switch active menu' tooltip='HTML' icon='fa-check'><i class='fa fa-code fa-lg'></i></div></li>"+
                            "<li><div id='hideDescription' class='switch active menu' tooltip='Description' icon='fa-check'><i class='fa fa-list-ul fa-lg'></i></div></li>"+
                            "<li><div id='editorStyle' class='switch menu' tooltip='Theme' icon='fa-cog'><i class='fa fa-paint-brush fa-lg'></i></div></li>"+
                            "<li><div id='aboutBtn' class='menu' tooltip='About' icon='fa-info-circle'><i class='fa fa-info-circle fa-lg'></i></div></li>"+
                        "</ul>"+
                    "</nav>"+
                "</div>"+
            "</div>"+

            "<div class='tooltip'></div>"+
            "<div id='floatingMenu'></div>"+
            "<div class='triangle'></div>"
            );
// "<div class='triangle'></div>"+
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

    },

    getStyleCookie: function(){
        var cookies = document.cookie.split(';');
        
        for (var i=0;i<cookies.length;i++){
            if (cookies[i].indexOf('style')==0){
                this.visualStyle = cookies[i].split('=')[1];
                this.setEditorStyle();
                return;
            }
        }
        this.visualStyle = "blackboard";
        document.cookie ="style=blackboard; expires=Mon, 30 Jul 2018 11:00:00 UTC; path=/"
    },

    setEditorStyle: function(){
        logger.start('')
        var background_color = (this.visualStyle == 'base16-light')? "#f5f5f5":"#0C1021";
        var color = (this.visualStyle == 'base16-light')? "#888":"#eee";
        var font_weight = (this.visualStyle == 'base16-light')? "200":"lighter";
        
        $(".container-west, .editors .editorHolder").css({"background-color":background_color,"color":color});
        $("h4").css({"font-weight":font_weight,"color":color});

        OOSamples.playerCode.editor.setOption("theme", this.visualStyle);
        OOSamples.playerURL.editor.setOption("theme", this.visualStyle);
        OOSamples.HTMLCode.editor.setOption("theme", this.visualStyle);
        OOSamples.finalCode.editor.setOption("theme", this.visualStyle);

        document.cookie ="style="+this.visualStyle;
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
            var c = (this.code().indexOf("?")!=-1) ? "&":"?";
            var url = this.code().concat(c).concat("debug=true");
            $.getScript(url, function(script, textStatus, jqXHR) {
                OOSamples.playerCode.loadCode();
            });  
        }else
            alert('Error: Player script URL is not well formatted.');
    };

    this.evalURL = function(){
        var validPlayerURL = /^(https?:\/\/)?(player(\-staging)?\.ooyala\.com\/v3\/)([0-9a-zA-Z\_\-]{32})\??([0-9a-zA-Z\_\-]+\=[0-9a-zA-Z\_\-]+\&?)*$/;
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
    };
    this.debug = function(){
        // alert('The debug function will only work on Google Chrome.')
        showFloatingMenu("sendToGist","<div class='floatingContent'>"+
        "<img scr='' alt='Javascript Source'>"+
        "<p><div id='cancelGist' class='button'><div>Close</div></div></p>"+
        "</div>","750px","240px");


        var codeToDebug = this.editor.getValue().concat('\n\n').concat('//# sourceURL=dynamicOoyalaPlayerCode.js');
        this.editor.setValue(codeToDebug);
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
    this.loadPrettyCode = function(){
        this.editor.setValue(beautifyCode.HTML(this.code()));
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
            $("#finalCode i").removeClass("fa-copy").addClass("fa-times-circle");
            $("#controlsHolder ul li div").css({"color":"#777"});
            $("#finalCode").css({"color":"#eee"});

            this.editor.setValue("<script src='"+OOSamples.playerURL.code()+"'></script>\n"+
                 "<script>\n"+OOSamples.playerCode.code()+"\n</script>\n\n"+OOSamples.HTMLCode.code());
        }else{
            $("#finalEditor").hide();
            $("#javascriptEditor").show();
            $("#finalCode i").removeClass("fa-times-circle").addClass("fa-copy");
            $("#controlsHolder ul li div").css({"color":"#eee"});
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
        OOSamples.HTMLCode.loadPrettyCode();
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
        var gistURL ="";
        showFloatingMenu("sendToGist","<div class='exportGist floatingContent'>"+
        "<p>Export script as public Gist:</p>"+
        "<p><input type='text' id='gistTitle' placeholder='Title'></p>"+
        "<p><textarea type='text' id='gistDescription' placeholder='Description' rows='4'></textarea></p>"+
        "<p id='gistURL'></p>"+
        "<p><div id='cancelGist' class='button'><div>Close</div></div><div id='exportGist' class='button'><div>Export</div></div></p>"+
        "</div>","294px","200px");
        if (OOSamples.gistURL != ""){
            $("#gistURL").html("Your code has been sent to Gist:<br>"+OOSamples.gistURL);
        }
});

$(document).on("click","#aboutBtn",function(){
    showFloatingMenu("aboutBtn","<div class='floatingContent'>"+
            "<p>© 2015 Ooyala, Inc. • Website Privacy Policy • Terms of Service • All Rights Reserved</p>"+
            "</div>","280px","70px");
});


$(document).on("click","#moreSamples",function(){
    showFloatingMenu("moreSamples","<ul id='samples_menu'>"+
                    "<li><div class='samples_cat' id='sm_Configuration'>Player Configuration</div>"+
                        "<ul>"+
                            "<li id='000018'><div class='' id='000018'>Flash Player</div></li>"+
                            "<li id='000019'><div class='' id='000019'>HTML5 Player</div></li>"+
                            "<li id='000011'><div class='' id='000011'>Parameters 1</div></li>"+
                            "<li id='000013'><div class='' id='000013'>Parameters 2</div></li>"+
                            "<li id='000003'><div class='' id='000003'>Load Dynamically</div></li>"+
                            "<li id='000015'><div class='' id='000015'>Set Embed Code</div></li>"+
                            "<li id='000005'><div class='' id='000005'>HTML5 CC</div></li>"+
                            "<li id='000009'><div class='' id='000009'>Omniture</div></li>"+
                            "<li id='000010'><div class='' id='000010'>Player Token</div></li>"+
                            "<li id='000022'><div class='' id='000021'>Responsive Player </div></li>"+
                        "</ul>"+    
                    "</li>"+
                    "<li><div class='samples_cat' id='sm_Interaction'>Player Interaction</div>"+
                        "<ul>"+
                            "<li id='000016'><div class='' id='000016'>Set Volume</div></li>"+
                            "<li id='000014'><div class='' id='000014'>Replay</div></li>"+
                            "<li id='000001'><div class='' id='000001'>CC select language</div></li>"+
                            "<li id='000020'><div class='' id='000020'>HTML5 Facebook/Twitter buttons</div></li>"+
                            "<li id='000004'><div class='' id='000004'>Fullscreen</div></li>"+
                            "<li id='000007'><div class='' id='000007'>Intercept</div></li>"+
                            "<li id='000002'><div class='' id='000002'>Destroy</div></li>"+
                        "</ul>"+
                    "</li>"+
                    "<li><div class='samples_cat' id='sm_Monetization'>Monetization</div>"+
                        "<ul>"+
                            "<li id='000012'><div class='' id='000012'>VAST</div></li>"+
                            "<li id='000006'><div class='' id='000006'>Google IMA</div></li>"+
                            "<li id='000017'><div class='' id='000017'>VPAID</div></li>"+
                            "<li id='000008'><div class='' id='000008'>LiveRail</div></li>"+
                        "</ul>"+
                    "</li>"+
                "</ul>","80px","70px");
});

//Hide Sample's menu when clicking on any element.
$(document).on("click","div",function(evt){
    hideFloatingMenu(evt);

    if ($(".tooltip").is(':visible') == true){
        $(".tooltip").hide();
    }
});

$(document).on("click","#cancelGist",function(){
    $("#floatingMenu_2").html("").hide();
    $(".triangle").hide();
});

$(document).on("click","#exportGist",function(){
    exportToGist();
});

$(document).on("click","#editorStyle",function(){
    OOSamples.visualStyle = (OOSamples.visualStyle == 'base16-light')? 'blackboard' : 'base16-light';
    OOSamples.setEditorStyle();
});

$(document).on("click","#debugCode",function(){
    OOSamples.playerCode.debug();
});

// Displays tooltip with title on the menu buttons
$(document).on("mouseenter",".menu",function(){
    if (OOSamples.finalCode.hidden){
        var position = $(this).offset();
        $(".tooltip").css({'position':'fixed','top':position.top, 'left':35,'display':'block'});
        $(".tooltip").html($(this).attr('tooltip'));
    }
});

$(document).on("mouseleave",".menu",function(){
    $(".tooltip").hide();
});

//Redirects to the URL with the sample
$(document).on("click","#floatingMenu ul li",function(){
    if ($(this).attr("id") != undefined)
        window.location.replace(window.location.origin+ window.location.pathname+"?id="+$(this).attr("id"),'_blank');
});

function exportToGist(){
    var gistTitle = $("#gistTitle").val();
    var gistDescription = $("#gistDescription").val();

    var data = {
        "description": $("#gistDescription").val(),
        "public": true,
        "files": {}
    }

    // Adds Gist title and description
    data.files[gistTitle]=   {
        "content": "<script src='"+OOSamples.playerURL.code()+"'></script>\n"+
        "<script>\n"+OOSamples.playerCode.code()+"\n</script>\n\n"+OOSamples.HTMLCode.code()
    }

var x=0;
    $.ajax({
        url: 'https://api.github.com/gists',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data)
    })
    .success( function(e) {
        console.log(e);
        OOSamples.gistURL = e.html_url;
        $("#gistURL").html("Your code has been sent to Gist:<br>"+OOSamples.gistURL);
    })
    .error( function(e) {
        console.warn("Gist save error", e);
    });  
}

function showFloatingMenu(callerID, HTML, width, height){
    if (OOSamples.finalCode.hidden){
        OOSamples.floatingMenu_callerID = callerID
        $("#floatingMenu").html(HTML);
        var position = $("#"+callerID).offset();
        $("#floatingMenu").css({"top":position.top,"display":"block","width":width,"height":height});
        $(".triangle").css({"top":position.top+5,"display":"block"});
        $("#floatingMenu").show();
    }
}

function hideFloatingMenu(evt){
    if ((evt.target.className == "floatingContent")||(evt.target.className == "samples_cat"))
        return;

    if(evt.target.id == OOSamples.floatingMenu_callerID)
        return;

    if($(evt.target).closest('.floatingContent, .samples_cat, #'+OOSamples.floatingMenu_callerID).length)
        return;

    if ($("#floatingMenu").is(':visible') == true){
        $("#floatingMenu").hide();
        $(".triangle").hide();
    }    
}

var logger = {
    start: function(m){
        console.error('START -> ' + m);
    },
    end: function(m){
        console.error('START -> ' + m);  
    },
    log: function(m){
        console.log(m);
    },
    assert: function(condition,m){
        console.assert(condition,m);
    },
    error: function(m){
        console.error(m);
    }
}
// http://layout.jquery-dev.com/


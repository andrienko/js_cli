String.prototype.stripTags = function(doornot){
    if(doornot!=true)return this.replace(/</g,'&lt;');
    return this;
}

String.prototype.toLower = function(doornot){
    if(doornot!=true)return this.toLowerCase();
    return this;
}

if(String.prototype.trim == 'undefined')
    String.prototype.trim = function(){
        return this.replace(/^\s+|\s+$/g,'');
    };

TheCLI = {

    parent:null,

    output:null,
    input:null,

    tagsAllowed:false,
    caseSensitiveCommands:false,

    commandline:'',
    commandline_history:[],

    caret_pos:-1,
    commandline_prepend : 'С:\\>',

    actionKeyPress:function(event){
        var keyCode = event.which;
        if(navigator.appName.indexOf("Microsoft")!=-1)keyCode = event.keyCode;

        if(((keyCode >= 0x20) && (keyCode < 0x99)) || keyCode > 0xFF ){
            this.enterChar(String.fromCharCode(keyCode));
            this.renderCommandLine();
        }

        event.preventDefault();
        return false;
    },

    actionHardKeyPress:function (event){

        //console.log(event.keyCode);

        if(event.keyCode == 8)this.erase();
        else if(event.keyCode == 35)this.caret_end();
        else if(event.keyCode == 36)this.caret_home();
        else if(event.keyCode == 46)this.del();
        else if(event.keyCode == 9)this.suggest();
        else if(event.keyCode == 13)this.enter();
        else if(event.keyCode == 37)this.caret_back();
        else if(event.keyCode == 39)this.caret_next();
        else if(event.keyCode == 38)this.history_prev();
        else if(event.keyCode == 40)this.history_next();

        if(event.keyCode >=112 && event.keyCode<=123){
            return event;
        }

        this.renderCommandLine();

        if([8,9,13].indexOf(event.keyCode) != -1)return false;  // Preventing backspace from happening
    },

    history_next:function(){

    },

    history_prev:function(){
        this.commandline = this.commandline_history[this.commandline_history.length-1];

    },

    enter:function(){
        this.commandline_history.push(this.commandline);
        this.write(this.commandline_prepend+this.commandline.stripTags(this.tagsAllowed));
        this.actionCommand(this.commandline);
        this.commandline = '';
    },

    suggest:function(){
        if(this.commandline.trim()=='')return;
        var acc = [];
        for(var com in this.commands)
            if(com.indexOf(this.commandline)==0)
                acc.push(com);
        if(acc.length==1)this.commandline=acc[0];
        else if(acc.length<=0)return;
        else this.write(acc.join(' '));
    },

    write:function(text,noBreak){
        if(!noBreak)text+='\n';
        var theLine = document.createElement('span');
        theLine.innerHTML = text;
        this.output.appendChild(theLine);
        return this;
    },

    nl:function(){return this.write('');},

    clear:function(){this.output.innerHTML='';return this;},

    actionCommand:function(commandline){
        commandline=commandline.trim();
        if(commandline=='')return;

        commandline = this.parseCommand(commandline);
        if(typeof this.commands[commandline.command] != 'undefined'){
            try{
                this.commands[commandline.command](commandline,this);
            }
            catch(e){
                this.write(commandline.command.stripTags(this.tagsAllowed)+': an error uccured\n\n'+ e.message).nl();
            }
        }
        else{
            this.write(commandline.command.stripTags(this.tagsAllowed)+': command not found');
        }
    },

    motd:function(){
        this.write('<a href="https://github.com/andrienko/js_cli">The CLI [version 1.0.1000]</a>')
            .write('(с) Andrienko, 2014 (released under <a href="http://opensource.org/licenses/MIT">MIT</a>)')
            .nl()
            .write(document.location.href)
            .nl()
            .write('Hello and welcome to the command line interpreter!')
            .write('Type <b>help</b> to get list of commands available')
            .nl();
    },

    commands:{
        clear:function(data,cli){cli.clear();},
        cls:function(data,cli){cli.clear();}
    },

    parseCommand:function(text){

        var parameters = text.split(/\s+|\s*=\s*/);
        var command = parameters[0].toLower(this.caseSensitiveCommands);

        return {
            text : text,
            command : command,
            parameters : parameters,
            parametersText : text.substr(command.length).trim()
        }

    },

    caret_back : function(){
        if(this.caret_pos<0)this.caret_pos = this.commandline.length;
        if(this.caret_pos>0)this.caret_pos --;
    },
    caret_next : function(){
        if(this.caret_pos<=this.commandline.length && this.caret_pos>=0)this.caret_pos++;
        if(this.caret_pos>=this.commandline.length)this.caret_pos=-1;

    },
    caret_end : function(){
        this.caret_pos = -1;
    },
    caret_home : function(){
        this.caret_pos = 0;
    },

    enterChar:function(char){
        if(this.caret_pos!=-1){
            this.commandline = this.commandline.substr(0,this.caret_pos) + char + this.commandline.substr(this.caret_pos);
            this.caret_next();
        }
        else this.commandline+=char;
    },

    erase:function(){
        if(this.caret_pos!=-1){
            this.commandline = this.commandline.substr(0,this.caret_pos-1)+this.commandline.substr(this.caret_pos);
            this.caret_back();
        }
        else this.commandline = this.commandline.substring(0,this.commandline.length - 1);
    },

    del:function(){
        if(this.caret_pos!=-1){
            this.commandline = this.commandline.substr(0,this.caret_pos)+this.commandline.substr(this.caret_pos+1);
            if(this.caret_pos>=this.commandline.length)this.caret_pos=-1;
        }
    },

    renderCommandLine:function(){
        if(this.caret_pos == -1 || this.commandline.trim()=='')this.input.innerHTML = this.commandline_prepend+this.commandline.stripTags()+'<span class="caret"> </span>';
        else{
            var before = this.commandline.substr(0,this.caret_pos).stripTags();
            var curr = this.commandline.substr(this.caret_pos,1).stripTags();
            var after = this.commandline.substr(this.caret_pos+1).stripTags();
            this.input.innerHTML = this.commandline_prepend+before+'<span class="caret">'+curr+'</span>'+after;
        }
    },

    init : function(objectID){

        var parent = document.getElementById(objectID);

        if(typeof parent == 'undefined'){
            console.error(objectID+' not found :(');
            return false;
        }

        var output = parent.getElementsByClassName('output');
        if(output.length <1){
            output = document.createElement('div')
            output.className = "output";
            parent.appendChild(output);
        }
        else output = output[0];

        var input = parent.getElementsByClassName('input');
        if(input.length <1){
            input = document.createElement('div');
            input.className = "input";
            parent.appendChild(input);
        }
        else input=input[0];

        this.parent = parent;
        this.output = output;
        this.input = input;

        parent.onfocus=function(e){e.blur();};

        this.renderCommandLine();

        this.motd();
        return true;
    },

    calculateDim: function(){
        var tempSpan = document.createElement('span');
        tempSpan.innerHTML="x";
        this.parent.appendChild(tempSpan);
        var dimX = tempSpan.offsetWidth;
        this.parent.removeChild(tempSpan);
        return Math.floor(this.parent.offsetWidth / dimX);
    },

    extend:function(name,callback){
        this.commands[name.toLower(this.caseSensitiveCommands)] = callback;
    }
};

document.onkeypress = function(event){
    return TheCLI.actionKeyPress(event);
}
document.onkeydown = function(event){
    return TheCLI.actionHardKeyPress(event);
}
String.prototype.stripTags = function(doornot){
    if(doornot!=true)return this.replace(/</g,'&lt;');
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

    commandline:'',
    commandline_history:[],
    that: null,
    prepend : 'anonymous@test:~$ ',

    actionKeyPress:function(event){
        var keyCode = event.which;

        if(navigator.appName.indexOf("Microsoft")!=-1)keyCode = event.keyCode;

        if(event.keyCode >= 113 && event.keyCode<=123)return event;


        if(((keyCode >= 0x20) && (keyCode < 0x99)) || keyCode > 0xFF )this.commandline += this.fromChar(keyCode);

        else if(keyCode == 8){
            this.commandline = this.commandline.substring(0,this.commandline.length - 1);
        }
        else if(keyCode == 13){
            this.commandline_history.push(this.commandline);
            this.write(this.prepend+this.commandline.stripTags(this.tagsAllowed));
            this.actionCommand(this.commandline);
            this.commandline = '';
        }
        else if(event.keyCode == 9){
            var acc = [];
            for(var com in this.commands)
                if(com.indexOf(this.commandline)==0)
                    acc.push(com);

            if(acc.length==1)this.commandline=acc[0];
            else if(acc.length<=0)return;
            else this.write(acc.join(' '));
        }

        this.renderCommandLine();
        event.preventDefault();
        return false;
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

    actionHardKeyPress:function (event){
        if(event.keyCode == 8)return this.actionKeyPress(event); // IE fix
        return event;
    },

    actionCommand:function(text){
        text=text.trim();
        if(text=='')return;

        text = this.parseCommand(text);
        if(typeof this.commands[text.command] != 'undefined'){
            try{
                this.commands[text.command](text);
            }
            catch(e){
                this.write('An error uccured: '+ e.message);
            }
        }
        else{
            this.write(text.stripTags(this.tagsAllowed)+': command not found');
        }
    },

    commands:{
        clear:function(){TheCLI.clear();},
        cls:function(){TheCLI.clear();}
    },

    parseCommand:function(text){

        var parameters = text.split(/\s+|\s*=\s*/);
        var command = parameters[0];

        return {
            text : text,
            command : command,
            parameters : parameters,
            parametersText : text.substr(command.length).trim()
        }

    },

    fromChar:function(code){
        return String.fromCharCode(code);
    },

    renderCommandLine:function(){
        this.input.innerHTML = this.prepend+this.commandline.stripTags()+'<span class="caret"> </span>';
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

        return true;
    },

    extend:function(name,callback){
        this.commands[name] = callback;
    }
};

document.onkeypress = function(event){
    return TheCLI.actionKeyPress(event);
}
document.onkeydown = function(event){
    return TheCLI.actionHardKeyPress(event);
}
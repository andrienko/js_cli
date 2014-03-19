TheCLI = {
    parent:null,

    output:null,
    input:null,

    commandline:'',
    commandline_history:[],
    that: null,
    prepend : 'anonymous@test:~$ ',

    actionKeyPress:function(event){
        var keyCode = event.which || event.keyCode;

        if(((keyCode >= 0x20) && (keyCode < 0x99)) || keyCode > 0xFF )this.commandline += String.fromCharCode(keyCode);

        else if(keyCode == 8){
            this.commandline = this.commandline.substring(0,this.commandline.length - 1);
        }
        else if(keyCode == 13){
            this.commandline_history.push(this.commandline);
            this.write(this.prepend+this.commandline);
            this.actionCommand(this.commandline);
            this.commandline = '';
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
        var keyCode = event.which || event.keyCode;
        if([116, 123].indexOf(keyCode) != -1)return event;
        if(event.keyCode == 8)return this.actionKeyPress(event); // IE fix
        return event;
    },

    actionCommand:function(text){
        if(typeof this.commands[text] != 'undefined'){
            try{
                this.commands[text]();
            }
            catch(e){
                this.write('An error uccured: '+ e.message);
            }
        }
        else{
            this.write('Unrecognized command');
        }
    },

    commands:{
        clear:function(){TheCLI.clear();},
        cls:function(){TheCLI.clear();}
    },

    renderCommandLine:function(){
        this.input.innerHTML = this.prepend+this.commandline+'|';
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
    //if (!event)event = window.event;
    return TheCLI.actionHardKeyPress(event);
}
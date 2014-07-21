String.prototype.stripTags = function(doornot) {
    if(doornot != true)return this.replace(/</g, '&lt;');
    return this;
}

String.prototype.toLower = function(doornot) {
    if(doornot != true)return this.toLowerCase();
    return this;
}

if(String.prototype.trim == 'undefined')
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };

String.prototype.repeat = function(n) {
    return Array((Math.floor(n) || 1) + 1).join(this);
}

var getMostCommonSymbols = function(words){
    var commonSymbols ='';
    var numOfCommonSymbols = 0;
    var max = 0;
    for(var index in words)if(words[index].length>max)max=words[index].length;

    while(true && numOfCommonSymbols<max){
        numOfCommonSymbols++;
        for(var index in words)
            if(words[index].indexOf(words[0].substr(0,numOfCommonSymbols))!=0)
                return commonSymbols;

        commonSymbols=words[0].substr(0,numOfCommonSymbols);
    }
    return commonSymbols;
};

var indexOf = function(haystack,needle){
    if(Array.prototype.indexOf)window.indexOf = function(haystack,needle){return haystack.indexOf(needle)};
    else window.indexOf = function(haystack,needle){
        var i,index = -1;
        for(i = 0; i < haystack.length; i++)if(haystack[i] === needle) {
            index = i;
            break;
        }
        return index;
    };
    return window.indexOf(haystack,needle);
};

TheCLI = {

    parent: null,

    output: null,
    input: null,

    tagsAllowed: false,
    caseSensitiveCommands: false,

    commandline: '',
    commandline_history: [],

    caret_pos: -1,
    commandline_prepend: 'С:\\>',

    zerojs:null,

    ctrlIsDown: false,

    keyPress: function(event) {

        var keyCode = event.which;
        if(navigator.appName.indexOf("Microsoft") != -1)keyCode = event.keyCode;

        if(((keyCode >= 0x20) && (keyCode < 0x99)) || keyCode > 0xFF) {
            this.enterChar(String.fromCharCode(keyCode));
            this.renderCommandLine();
        }

        event.preventDefault();
        return false;

    },

    keyDown: function(event) {

        //console.log(event.keyCode);

        if(event.keyCode == 8)this.erase();
        else if(event.keyCode == 33)this.scrollUp();
        else if(event.keyCode == 34)this.scrollDown();
        else if(event.keyCode == 35)this.caret_end();
        else if(event.keyCode == 36)this.caret_home();
        else if(event.keyCode == 46)this.del();
        else if(event.keyCode == 9)this.suggest();
        else if(event.keyCode == 13)this.enter();
        else if(event.keyCode == 37)this.caret_back();
        else if(event.keyCode == 39)this.caret_next();
        else if(event.keyCode == 38)this.history_prev();
        else if(event.keyCode == 40)this.history_next();

        this.renderCommandLine();

        if([8, 9, 13].indexOf(event.keyCode) != -1)return false;
    },

    history_step:0,

    history_next: function() {
        if(this.history_step>0)this.history_step-=1;
        var prev = this.commandline_history[this.commandline_history.length - this.history_step];
        if(typeof prev != 'undefined')this.commandline = prev;
        console.log(this.history_step);
    },

    history_prev: function() {
        if(this.history_step<this.commandline_history.length)this.history_step+=1;
        var prev = this.commandline_history[this.commandline_history.length - this.history_step];
        if(typeof prev != 'undefined')this.commandline = prev;
        console.log(this.history_step);
    },

    posBottom:0,

    scrollDown:function(){
        this.posBottom-=1;
        if(this.posBottom<0)this.posBottom=0;
        this.scrollUpdate();
    },

    scrollUp:function(){
        this.posBottom+=1;
        this.scrollUpdate();
    },

    scrollUpdate:function(){
        this.output.style.bottom = (-this.posBottom*1.5+1.5)+"em";
    },

    enter: function() {

        var index = indexOf(this.commandline_history,this.commandline);
        if(index!=-1)this.commandline_history.splice(index,1);
        this.commandline_history.push(this.commandline);
        this.history_step=0;

        this.write(this.commandline_prepend + this.commandline.stripTags(this.tagsAllowed));
        this.run(this.commandline);
        this.commandline = '';

    },

    suggest: function() {
        if(this.commandline.trim() == '')return;
        var acc = [];
        for(var com in this.commands)
            if(com.indexOf(this.commandline) == 0)
                acc.push(com);
        if(acc.length == 1)this.commandline = acc[0];
        else if(acc.length <= 0)return;
        else{
            this.write(acc.join(' '));
            this.commandline = getMostCommonSymbols(acc);
        }
    },

    write: function(text, noBreak) {
        if(!noBreak)text += '\n';
        var theLine = document.createElement('span');
        theLine.innerHTML = text;
        this.output.appendChild(theLine);
        this.posBottom=0;
        this.scrollUpdate();
        return this;
    },

    nl: function() {
        return this.write('');
    },

    clear: function() {
        this.output.innerHTML = '';
        this.posBottom=0;
        this.scrollUpdate();
        return this;
    },

    run: function(commandline) {
        commandline = commandline.trim();
        if(commandline == '')return;

        commandline = this.parseCommand(commandline);
        if(typeof this.commands[commandline.command] != 'undefined') {
            try {
                this.commands[commandline.command](commandline, this);
            }
            catch(e) {
                this.write(commandline.command.stripTags(this.tagsAllowed) + ': an error uccured\n\n' + e.message).nl();
            }
        }
        else {
            this.write(commandline.command.stripTags(this.tagsAllowed) + ': command not found');
        }
    },

    commands: {
        clear: function(data, cli) {
            cli.clear();
        },
        cls: function(data, cli) {
            cli.clear();
        },
        motd: function(data, cli) {
            cli.write('<a href="https://github.com/andrienko/js_cli">The CLI [version 1.1.2000]</a>')
                .write('(с) Andrienko, 2014 (released under <a href="http://opensource.org/licenses/MIT">MIT</a>)')
                .nl()
                .write(document.location.href)
                .nl()
                .write('Hello and welcome to the command line interpreter!')
                .write('Type <b>help</b> to get list of commands available')
                .nl();
        }
    },

    parseCommand: function(text) {

        var parameters = text.split(/\s+|\s*=\s*/);
        var command = parameters[0].toLower(this.caseSensitiveCommands);

        return {
            text: text,
            command: command,
            parameters: parameters,
            parametersText: text.substr(command.length).trim()
        }

    },

    caret_back: function() {
        if(this.caret_pos < 0)this.caret_pos = this.commandline.length;
        if(this.caret_pos > 0)this.caret_pos--;
    },
    caret_next: function() {
        if(this.caret_pos <= this.commandline.length && this.caret_pos >= 0)this.caret_pos++;
        if(this.caret_pos >= this.commandline.length)this.caret_pos = -1;
    },
    caret_end: function() {
        this.caret_pos = -1;
    },
    caret_home: function() {
        this.caret_pos = 0;
    },

    enterChar: function(char) {
        if(this.caret_pos != -1) {
            this.commandline = this.commandline.substr(0, this.caret_pos) + char + this.commandline.substr(this.caret_pos);
            this.caret_next();
        }
        else this.commandline += char;
    },

    erase: function() {
        if(this.caret_pos != -1) {
            this.commandline = this.commandline.substr(0, this.caret_pos - 1) + this.commandline.substr(this.caret_pos);
            this.caret_back();
        }
        else this.commandline = this.commandline.substring(0, this.commandline.length - 1);
    },

    del: function() {
        if(this.caret_pos != -1) {
            this.commandline = this.commandline.substr(0, this.caret_pos) + this.commandline.substr(this.caret_pos + 1);
            if(this.caret_pos >= this.commandline.length)this.caret_pos = -1;
        }
    },

    renderCommandLine: function() {
        if(this.caret_pos == -1 || this.commandline.trim() == '')this.input.innerHTML = this.commandline_prepend + this.commandline.stripTags() + '<span class="caret"> </span>';
        else {
            var before = this.commandline.substr(0, this.caret_pos).stripTags();
            var curr = this.commandline.substr(this.caret_pos, 1).stripTags();
            var after = this.commandline.substr(this.caret_pos + 1).stripTags();
            this.input.innerHTML = this.commandline_prepend + before + '<span class="caret">' + curr + '</span>' + after;
        }
    },

    init: function(objectID) {

        var parent = document.getElementById(objectID);

        if(typeof parent == 'undefined') {
            console.error(objectID + ' not found :(');
            return false;
        }

        var output = parent.getElementsByClassName('output');
        if(output.length < 1) {
            output = document.createElement('div')
            output.className = "output";
            parent.appendChild(output);
        }
        else output = output[0];

        var input = parent.getElementsByClassName('input');
        if(input.length < 1) {
            input = document.createElement('div');
            input.className = "input";
            parent.appendChild(input);
        }
        else input = input[0];

        this.parent = parent;
        this.output = output;
        this.input = input;

        parent.onfocus = function(e) {
            e.blur();
        };

        this.renderCommandLine();

        this.run('motd');

        var that = this;

        document.onkeypress = function(event) {
            return that.keyPress(event);
        }
        document.onkeydown = function(event) {
            return that.keyDown(event);
        }
        return true;
    },

    calculateDim: function() {
        var tempSpan = document.createElement('span');
        tempSpan.innerHTML = "M".repeat(20);    // Black magic
        this.output.appendChild(tempSpan);

        var dimX = tempSpan.offsetWidth / 20;
        this.output.removeChild(tempSpan);
        return Math.floor(this.parent.offsetWidth / dimX);
    },

    /**
     * Create a command-line parameter, setting callback function as a handler
     * @param name The command to be used
     * @param callback Handler function
     */
    extend: function(name, callback) {
        this.commands[name.toLower(this.caseSensitiveCommands)] = callback;
    }
};
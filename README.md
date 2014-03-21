CLI interpreter
===

This one is a fake command-line written in JS.

![Screenshot](screenshot.png)

Yeah, I know, there were a plenty of them, but this one is mine.

Also, the goal of whole thing is to learn how to work with keys. Nothing more.

Usage (programmatical)
---

### init

See the index.html file. To initialize TheCLI the single line of code is required:

    TheCLI.init('cli_instance');

Where cli_instance is an ID of an element that the cli will run in.

### output a line

This will output a line of text into console:

    TheCLI.write('text');

### getting line width

This will return the number of characters required to output the line:

    TheCLI.calculateDim();

### adding own command

    TheCLI.extend('hello',function(data,cli){
        var person = data.parametersText == ''?'world':data.parametersText;
        cli.write('Hello, '+person+'!');
    });

Call the TheCLI.extend and pass it two parameters: the name of the command and the callback function
the name of the command should contain no space symbols. Just in case.

The callback function recieves two parameters.

First one is the the object which contains the data user inputted and

The data user inputted has 4 fields:

 - data.text is the full text of what user inputted
 - data.commandText is everything user inputted except the command being called
 - data.command is the command being called
 - data.parameters is an array of every word user inputted, separated by spaces and = sign.

The second parameter is the cli object which contains reference to current TheCLI.
It is there for sake of extendability so please use it if you need to call the cli from your function (for example,
to output something to the cli)

Running multiple instances on same page
---
It was not really meant to be used alongside with something else, but you can add some tiny modifications yourself
in order to make several CLI's work together or to make CLI work with something else keypress-bound. Those changes are:

 - redefining the key-capturing events attached to document.
 - Also modifying the key events of the CLI because those may be pretty obstructive
 - creating several TheCLI object inheritors
 - and modifying (extending) all of the functions for those inheritors
 - also, modifying the css may be required if you want it to be non-fullscreen

So, it may be pretty tough, but actually nothing special.

Plans for future
---

 - command history
 - blinking cursor
 - colorized output
 - unknown command processing functions
 - PgUp/PgDn
 - parameter parsing (add ="value" and --parameter, -parameter, /parameter), non-breaking "not breaked"
 - Console inside content mode
 - copypaste using clippy
 - extended suggests (c will become cl if there are clear and cls)
 - fake file system
 - add allowed keys handeling (F-keys etc)
 - locks (for input into a function, etc)
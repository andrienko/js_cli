CLI interpreter
===

Demo: http://andrienko.github.io/js_cli

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

### executing the command

This will execute the 'line' command as if it was typed into command line (will show error if it does not exist)

    TheCLI.run('line');

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

Files
---

the_cli.js is a main file. Also it requires style.css to be attached to page (otherwise everything will be ugly).
the_cli_commands.js and the_cli_filesystem.js are files that contain examples of commands you can create using the API.

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

 - Console inside content mode
 - add allowed (browser-allowed) keys handeling (F-keys etc, like F5 should work normally)
 - locks (for input into a function, etc) (input loops too, maybe. All the input goes to function when locked.
   Exit using Ctrl+C.)

Also, alongside

 - fake file system
 - parameter parsing (add ="value" and --parameter, -parameter, /parameter), non-breaking "not breaked"
 - copypaste using clippy
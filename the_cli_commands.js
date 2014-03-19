TheCLI.extend('help',function(text){
    TheCLI.nl().write('  Well, hello. I am the CLI. And You have following options:').nl();
    for(command in TheCLI.commands){
        TheCLI.write('  - '+command);
    }
    TheCLI.nl();
});

TheCLI.extend('barn',function(text){
    TheCLI.write('\n<span style="color:#0f0">           x\n.-. _______|\n|=|/     /  \\\n| |_____|_""_|\n|_|_[X]_|____|\n</span>');
});





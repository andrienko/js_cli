TheCLI.extend('help',function(){
    TheCLI.nl().write('  Well, hello. I am the CLI. And You have following options:').nl();
    for(command in TheCLI.commands){
        TheCLI.write('  - '+command);
    }
    TheCLI.nl();
});

TheCLI.extend('barn',function(){
    TheCLI.write('\n<span style="color:#0f0">           x\n.-. _______|\n|=|/     /  \\\n| |_____|_""_|\n|_|_[X]_|____|\n</span>');
});

TheCLI.extend('test',function(text){
    TheCLI.nl().write(JSON.stringify(text)).nl();
    console.log(text);
});

TheCLI.extend('echo',function(text){
    TheCLI.write(text.parametersText);
});

TheCLI.extend('eval',function(text){
    TheCLI.nl().write('evaluating ' + text.parametersText).nl();
    eval(text.parametersText);

});



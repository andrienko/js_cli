TheCLI.extend('help',function(data,cli){
    cli.nl().write('  Well, hello. I am the CLI. And You have following options:').nl();
    for(var command in cli.commands){
        cli.write('  - '+command);
    }
    cli.nl();
});

TheCLI.extend('barn',function(data,cli){
    cli.write('\n<span style="color:#0f0">           x\n.-. _______|\n|=|/     /  \\\n| |_____|_""_|\n|_|_[X]_|____|\n</span>');
});

TheCLI.extend('test',function(data,cli){
    cli.nl().write(JSON.stringify(text)).nl();
    console.log(text);
});

TheCLI.extend('echo',function(data,cli){
    cli.write(data.parametersText);
});

TheCLI.extend('eval',function(data){
    cli.nl().write('evaluating ' + data.parametersText).nl();
    eval(text.parametersText);
});

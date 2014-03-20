TheCLI.extend('help',function(data,cli){
    cli.nl().write('Following commands are available:').nl();
    for(var command in cli.commands){
        cli.write('  - '+command);
    }
    cli.nl();
});

TheCLI.extend('barn',function(data,cli){
    cli.write('\n<span style="color:#0f0">           x\n.-. _______|\n|=|/     /  \\\n| |_____|_""_|\n|_|_[X]_|____|\n</span>');
});

TheCLI.extend('test',function(data,cli){
    cli.nl().write(JSON.stringify(data)).nl();
    console.log(data);
});

TheCLI.extend('echo',function(data,cli){
    cli.write(data.parametersText);
});

TheCLI.extend('eval',function(data,cli){
    cli.nl().write('evaluating ' + data.parametersText).nl();
    eval(data.parametersText);
});

TheCLI.extend('reset',function(data,cli){
    cli.clear();
    cli.init(cli.parent.id);
});

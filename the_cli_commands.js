var the_cli = TheCLI;


the_cli.hiddenCommands = ['cls','motd','barn','test','reset','command_with_error','centered'];

the_cli.extend('help',function(data,cli){
    
    cli.nl().write('Following commands are available:').nl();
    for(var command in cli.commands){
        if(cli.hiddenCommands.indexOf(command)==-1) cli.write('  - '+command);
    }
    cli.nl();
});

the_cli.extend('barn',function(data,cli){
    cli.clear();
    cli.write('\n<span style="color:#0f0">           x\n.-. _______|\n|=|/     /  \\\n| |_____|_""_|\n|_|_[X]_|____|\n</span>');
});

the_cli.extend('test',function(data,cli){
    cli.nl().write(JSON.stringify(data)).nl();
    console.log(data);
});

the_cli.extend('echo',function(data,cli){
    cli.write(data.parametersText);
});

the_cli.extend('eval',function(data,cli){
    cli.nl().write('evaluating ' + data.parametersText).nl();
    eval(data.parametersText);
});

the_cli.extend('reset',function(data,cli){
    cli.clear();
    cli.init(cli.parent.id);
});

the_cli.extend('command_with_error',function(){
    the_undefined_function();
});

the_cli.extend('line',function(data,cli){
    cli.write('-'.repeat(cli.calculateDim()));
});

the_cli.extend('centered',function(data,cli){
    var dim = cli.calculateDim();
    var text = data.parametersText;
    if(text=='')return;
    if(text.length>dim){
        cli.write(text);
        return;
    }
    else cli.write(' '.repeat((dim - text.length)/2)+text);
});
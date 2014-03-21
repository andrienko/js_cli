var the_cli = TheCLI; // I know i could use 'with'


the_cli.hiddenCommands = ['cls','motd','barn','test','reset','command_with_error','centered','line'];

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

the_cli.extend('motd',function(data,cli){
    cli.clear();
    cli.nl();
    var dim = cli.calculateDim();

    var pipes = ' ║'+' '.repeat(dim-4)+'║ ';

    var write_c = function(string,pipe){
        if(typeof pipe == 'undefined')pipe = '║';
        var off = Math.floor((dim - string.replace(/(<([^>]+)>)/ig,"").length)/2);
        cli.write(' '+pipe+ ' '.repeat(off)+string+' '.repeat(dim - string.replace(/(<([^>]+)>)/ig,"").length - off - 4)+pipe+' ')
    }

    cli.write(' ╔'+'═'.repeat(dim-4)+'╗ ').
        write(pipes);

    write_c('Hello.');

    cli.write(pipes);

    write_c('I am the fake command-line interpreter,');
    write_c('written in JavaScript.');
    cli.write(pipes);
    write_c('Type <b>help</b> for list of commands.');
    cli.write(pipes).
        write(' ╟'+'─'.repeat(dim-4)+'╢ ').
        write(pipes);
    write_c('(c) Andrienko, 2014. Released under <a href="http://opensource.org/licenses/MIT">MIT</a>.');

    cli.write(pipes).
        write(' ╚'+'═'.repeat(dim-4)+'╝ ').nl();
    write_c('The <a href="https://github.com/andrienko/js_cli">GitHub repository</a> is there for you to hack ;-)',' ');
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

});
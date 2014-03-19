TheCLI.extend('help',function(text){
    TheCLI.nl().write('  Well, hello. I am the CLI. And You have following options:').nl();
    for(command in TheCLI.commands){
        TheCLI.write('  - '+command);
    }
    TheCLI.nl();
});
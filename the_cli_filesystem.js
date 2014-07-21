(function(the_cli){

    the_cli.path = [];

    the_cli.filesystem = {
        windows:{
            system32:{
                drivers:{}
            },
            boot:{}
        },
        games:{
            pacman:function(){},
            batman:function(){}
        },
        test:function(cli){
            cli.write('hello');
        }
    }

    the_cli.get_dir = function(path){
        var current_dir = the_cli.filesystem;
        for(index in path){
            if(typeof current_dir[path[index]] != "object")return false;
            current_dir = current_dir[path[index]];
        }
        return current_dir;
    }

    the_cli.currentDir = the_cli.filesystem;

    the_cli.hiddenCommands.push('dir');

    the_cli.extend('dir',function(command,cli){
        cli.nl().write('Contents of C:\\'+cli.path.join('\\').toUpperCase()).nl();
        var files = [];
        for(var filename in cli.currentDir){
            if(cli.currentDir.hasOwnProperty(filename)){
                if(typeof cli.currentDir[filename] == 'function')files.push(filename);
                else cli.write('['+filename.toUpperCase()+']');
            }
        }
        for(var indx in files){
            cli.write(files[indx]);
        }

        console.log(files);
        cli.nl();
    });

    the_cli.hiddenCommands.push('cd');

    the_cli.extend('cd',function(command,cli){
        if(command.parametersText == '..'){
            cli.path.pop();
            the_cli.currentDir = the_cli.get_dir(cli.path);
        }
        else if(typeof cli.currentDir != 'undefined' && cli.currentDir.hasOwnProperty(command.parametersText) && typeof cli.currentDir[command.parametersText] == 'object'){
            cli.path.push(command.parametersText);
            the_cli.currentDir = the_cli.get_dir(cli.path);
        }
        else cli.write('Could not find directory '+command.parametersText);
        cli.commandline_prepend= 'C:\\'+cli.path.join('\\').toUpperCase()+'>';

    });

    the_cli.hiddenCommands.push('path');
    the_cli.extend('path',function(command,cli){
        cli.write(cli.path.join('\\').toUpperCase());

    });
})(TheCLI);
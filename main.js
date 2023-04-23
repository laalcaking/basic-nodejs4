import { createReadStream, createWriteStream } from 'fs';
import { pipeline as _pipeline } from 'stream';
import { promisify } from 'util';
import { program } from 'commander';

import { ls, up, cd } from './commands/navigation.js'


const pipeline = promisify(_pipeline);

const usernames = async _ => {
    
    const { username } = program.opts();
    process.stdout.write(`Добро пожаловать в диспетчер файлов ${username} \n`)
    const currentDirectory = process.cwd();
    console.log(`В настоящий момент вы находитесь в: ${currentDirectory}`);

    process.stdin.setEncoding('utf8');
    process.on('exit', _ => console.log(`Благодорим вас за использование, ${username}, Досвидания!`));
    process.on('SIGINT', _ => { process.exit(0); });

    while (true) {
        
        const input = await new Promise(resolve => {
          process.stdin.once('data', data => {
            resolve(data.trim());
          });
        });
        
        const arr = input.split(' ');
        switch(arr[0].toString("utf-8")) {
            case "ls":
                ls();
                break;
            case "cd":
                cd(arr[1].toString("utf-8"));
                break;
            case "up":
                up();
                break;
            case ".exit":
                process.exit(0);
            default:
                console.log("Ошибка "+ input)
        }
        const currentDirectory = process.cwd();
        console.log(`В настоящий момент вы находитесь в: ${currentDirectory}`);
    }
}

program
    .requiredOption('--username <username>', 'login')
        .action(usernames)
    .parse(process.argv);

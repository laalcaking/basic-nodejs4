import { createReadStream, createWriteStream } from 'fs';
import { pipeline as _pipeline } from 'stream';
import { promisify } from 'util';
import { program } from 'commander';

import { ls, up, cd } from './commands/navigation.js'
import { calcHash, compress, decompress} from './commands/hash and com decom.js';
import { rm, cat, add, rn, cp, mv } from './commands/Basic operations with files.js'
import { EOL, architecture, cpus, homedir, username_pc} from './commands/Operation system info.js'


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
            case "calcHash":
                calcHash(arr[1].toString("utf-8"));
                break;
            case "compress":
                compress(arr[1], arr[2])
                break;
            case 'decompress':
                decompress(arr[1], arr[2])
                break;
            case 'cat':
                cat(arr[1]);
                break;
            case 'rm':
                rm(arr[1]);
                break;
            case 'add':
                add(arr[1]);
                break;
            case 'rn':
                rn(arr[1], arr[2]);
                break;
            case 'cp':
                cp(arr[1], arr[2])
                break;
            case 'mv':
                mv(arr[1], arr[2])
                break;
            case ".exit":
                process.exit(0);
            case "os":
                switch(arr[1]){
                    case '--EOL':
                        EOL();
                        break;
                    case '--cpus':
                        cpus();
                        break;
                    case '--homedir':
                        homedir();
                        break;
                    case '--username':
                        username_pc();
                        break;
                    case '--architecture':
                        architecture();
                        break;
                    default:
                        console.log("Ошибка, операция введена не верно")
                }
                break;
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

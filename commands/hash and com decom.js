import crypto from 'crypto'
import { createReadStream, createWriteStream  } from 'fs'
import { createGzip, createUnzip } from 'zlib'

export async function calcHash(filePath){
    const hash = crypto.createHash('sha256');
    const stream = createReadStream(filePath);

    stream.on('data', (chunk) => {
        hash.update(chunk); // Обновляем хэш каждый раз при получении новых данных
    });

    stream.on('end', () => {
        const result = hash.digest('hex'); // Получаем окончательное значение хэша в виде строки
        console.log(`Хэш файла ${filePath}: ${result}`);
    });
      
    stream.on('error', (err) => {
        console.error(`Ошибка чтения файла: ${err.message}`);
    });

}

export function compress(source, destination){

    try{  

        const inputFile = createReadStream(source)
        const outputFile = createWriteStream(destination+".gz") 

        inputFile.pipe(createGzip()).pipe(outputFile)
        console.log("Файл успешно сжат!")
    } catch (err) {
        console.log("Файл не сжат " + err)
    }

}

export function decompress(source, destination){

    try{
        const inputFile = createReadStream(source)
        const outputFile = createWriteStream(destination+".txt")

        inputFile.pipe(createUnzip()).pipe(outputFile)
        console.log("Файл успешно распакован")  
    } catch (err) {
        console.log("Файл не распакован " + err)
    }
    
}
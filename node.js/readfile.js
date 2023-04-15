const fs = require('fs');
const { CacheClient, CacheGet, CacheSet, 
    Configurations, CredentialProvider } = require('@gomomento/sdk');
const dotenv = require('dotenv');

dotenv.config();

const filePath = './myfile.json';
const fileName = 'myfile';

async function run(){

    const data = fs.readFileSync(filePath);
    // add your code to catch fs errors here.
    const byteArray = new Uint8Array(data);
    const CACHE_NAME = 'test-cache'

    const cacheClient = new CacheClient({
        configuration: Configurations.Laptop.v1(),
        credentialProvider: CredentialProvider.fromEnvironmentVariable({
        environmentVariableName: 'MOMENTO_AUTH_TOKEN',
        }),
        defaultTtlSeconds: 600,
    });

    // write the file to the cache
    const setResponse = await cacheClient.set(CACHE_NAME, fileName, byteArray);
    if (setResponse instanceof CacheSet.Success) {
        console.log('Key stored successfully!');
    } else if (setResponse instanceof CacheSet.Error){
        console.log(`Error setting key: ${setResponse.toString()}`);
    } else {
        console.log(`Some other error: ${setResponse.toString()}`);
    }

    // read the file from the cache
    const fileResponse = await cacheClient.get(CACHE_NAME, fileName);
    if (fileResponse instanceof CacheGet.Hit) {
        console.log(`cache hit: ${fileResponse.valueString()}`);
        const contents = fileResponse.valueUint8Array();
        const buffer = Buffer.from(contents);
        fs.writeFileSync("./myfile2.json", buffer)
      } else if (fileResponse instanceof CacheGet.Miss) {
        console.log('cache miss');
      } else if (fileResponse instanceof CacheGet.Error) {
        console.log(`Error: ${fileResponse.message()}`);
      }
}

run();
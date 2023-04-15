const fs = require('fs');
const { CacheClient, CacheGet, CacheSet, Configurations, CredentialProvider } = require('@gomomento/sdk');
const dotenv = require('dotenv');

dotenv.config();

const filePath = './myfile.json';
const fileName = 'myfile';
const CACHE_NAME = 'test-cache';

// Read a file from the filesystem
async function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return new Uint8Array(data);
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    return null;
  }
}

// Creates the Momento cache client object
async function createCacheClient() {
  return new CacheClient({
    configuration: Configurations.Laptop.v1(),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: 'MOMENTO_AUTH_TOKEN',
    }),
    defaultTtlSeconds: 600,
  });
}

async function writeToCache(client, cacheName, key, data) {
  const setResponse = await client.set(cacheName, key, data);
  if (setResponse instanceof CacheSet.Success) {
    console.log('Key stored successfully!');
  } else if (setResponse instanceof CacheSet.Error) {
    console.log(`Error setting key: ${setResponse.toString()}`);
  } else {
    console.log(`Some other error: ${setResponse.toString()}`);
  }
}

async function readFromCache(client, cacheName, key) {
  const fileResponse = await client.get(cacheName, key);
  if (fileResponse instanceof CacheGet.Hit) {
    console.log(`cache hit: ${fileResponse.valueString()}`);
    const contents = fileResponse.valueUint8Array();
    const buffer = Buffer.from(contents);
    fs.writeFileSync("./myfile2.json", buffer);
  } else if (fileResponse instanceof CacheGet.Miss) {
    console.log('cache miss');
  } else if (fileResponse instanceof CacheGet.Error) {
    console.log(`Error: ${fileResponse.message()}`);
  }
}

async function run() {
  const byteArray = await readFile(filePath);
  if (byteArray === null) {
    return;
  }

  const cacheClient = await createCacheClient();

  await writeToCache(cacheClient, CACHE_NAME, fileName, byteArray);
  await readFromCache(cacheClient, CACHE_NAME, fileName);
}

run();
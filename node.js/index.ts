import {
    CacheGet,
    CreateCache,
    CacheSet,
    CacheClient,
    Configurations,
    CredentialProvider,
    ListCaches
  } from '@gomomento/sdk';

import dotenv from 'dotenv';

dotenv.config();
  
async function main() {
  const momento = new CacheClient({
    configuration: Configurations.Laptop.v1(),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: 'MOMENTO_AUTH_TOKEN',
    }),
    defaultTtlSeconds: 60,
  });

  const createCacheResponse = await momento.createCache('cache');
  if (createCacheResponse instanceof CreateCache.AlreadyExists) {
    console.log('Cache already exists');
  } else if (createCacheResponse instanceof CreateCache.Error) {
    throw createCacheResponse.innerException();
  }

  console.log('Listing caches:');
  const listResponse = await momento.listCaches();
  if (listResponse instanceof ListCaches.Error) {
    console.log(`Error listing caches: ${listResponse.message()}`);
  } else if (listResponse instanceof ListCaches.Success) {
    console.log('Found caches:');
    listResponse.getCaches().forEach(cacheInfo => {
      console.log('- ', `${cacheInfo.getName()}`);
    });
  } else {
    throw new Error(`Unrecognized response: ${listResponse.toString()}`);
  }

  
  console.log('Storing key=foo, value=FOO');
  const setResponse = await momento.set('cache', 'foo', 'FOO');
  if (setResponse instanceof CacheSet.Success) {
    console.log('Key stored successfully!');
  } else {
    console.log(`Error setting key: ${setResponse.toString()}`);
  }

  const getResponse = await momento.get('cache', 'foo');
  if (getResponse instanceof CacheGet.Hit) {
    console.log(`cache hit: ${getResponse.valueString()}`);
  } else if (getResponse instanceof CacheGet.Miss) {
    console.log('cache miss');
  } else if (getResponse instanceof CacheGet.Error) {
    console.log(`Error: ${getResponse.message()}`);
  }
}

main()
  .then(() => {
    console.log('success!!');
  })
  .catch((e: Error) => {
    console.error(`Uncaught exception while running example: ${e.message}`);
    throw Error;
  });
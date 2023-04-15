import os
from datetime import timedelta
from momento import CacheClient, Configurations, CredentialProvider
from momento.responses import CacheGet, CacheSet

file_path = './myfile.json'
file_name = 'myfile'
CACHE_NAME = 'test-cache'

# Read a file from the filesystem
def read_file(file_path):
    with open(file_path, 'rb') as file:
        byte_array = file.read()
    return byte_array

# Write a file to the filesystem
def write_file(file_path, data):
    with open(file_path, "wb") as out_file:
        out_file.write(data)

# Get a connection to and existing cache with your auth token.
def client():
    momento_auth_token = CredentialProvider.from_environment_variable('MOMENTO_AUTH_TOKEN')
    momento_ttl_seconds = os.getenv('MOMENTO_TTL_SECONDS')
    ttl  = timedelta(seconds=int(momento_ttl_seconds))

    config = {
      'configuration': Configurations.Laptop.v1(),
      'credential_provider': momento_auth_token,
      'default_ttl':  ttl
    }
    # print(config)
    return CacheClient(**config)

def run():
    # read the file contents in. They already come in byte format, so no casting necessary
    byte_array = read_file(file_path)

    # Get the client connection object.
    with client() as cache_client:
        # write the file to the cache
        set_response = cache_client.set(CACHE_NAME, file_name, byte_array)
        if isinstance(set_response, CacheSet.Success):
            print('Key stored successfully!')
        elif isinstance(set_response, CacheSet.Error):
            print(f'Error setting key: {set_response}')
        else:
            print(f'Some other error: {set_response}')

        # read the file from the cache
        file_response = cache_client.get(CACHE_NAME, file_name)
        if isinstance(file_response, CacheGet.Hit):
            print(f'Cache hit! The value is: {file_response.value_string}')
            buffer = bytes(file_response.value_string, 'utf-8')
            print('Writing file to filesystem.')
            write_file("./myfile2.json", buffer)
        elif isinstance(file_response, CacheGet.Miss):
            print('cache miss')
        elif isinstance(file_response, CacheGet.Error):
            print(f'Error: {file_response.message()}')

if __name__ == '__main__':
    run()

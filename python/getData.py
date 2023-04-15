from datetime import timedelta
from momento import CacheClient, Configurations, CredentialProvider
from momento.responses import CacheGet
import os

class GetData:
    def client():
        momento_auth_token = CredentialProvider.from_environment_variable('MOMENTO_AUTH_TOKEN')
        ttl  = timedelta(int(os.getenv('MOMENTO_TTL_SECONDS')))
        config = {
            'configuration': Configurations.Laptop.v1(),
            'credential_provider': momento_auth_token,
            'default_ttl':  ttl
        }
        return CacheClient(**config)

    # Check Momento Cache for the item. If not there, call CheckDB for the item in MongoDB.
    def checkCache(key):
        cache_name = os.getenv('MOMENTO_CACHE_NAME')
        with GetData.client() as client:
            resp = client.get(cache_name, key)
            match resp:
                case CacheGet.Hit():
                    print("found the item")
                    return resp.value_string
                case CacheGet.Miss():
                    print("no item found")
                    return GetData.__checkDB(key)
                case _ as error:
                    print("something went boom")
    
    # This private method takes in a key and returns a value from the DB or not.
    def __checkDB(key):
        DBname = "myDB"
        return key

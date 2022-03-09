# Deployment of RSD

This readme describes RSD deployment with provided docker-compose.yml and .env file.

## Requirements

You need machine with the Docker and Docker-Compose. To validate you can check the versions

```bash
# check docker exists
docker --version
# check docker-compose exists
docker-compose --version
```

## Environment variables

RSD modules require a number of environment variables to work properly. The values should be provided in .env file which should be at the same location as the docker-compose.yml file.

### Start solution

After you provided values in .env file you can start RSD using `docker-compose up`

```bash
# start solution
docker-compose up
```

### Stop solution

```bash
docker-compose stop
```

### Remove solution

```bash
# remove RSD and volumes
docker-compose down --volumes
```

## Volumes and network

In provided docker-compose file we defined a volume where the database will store the data.
The same is true for the internal docker network.
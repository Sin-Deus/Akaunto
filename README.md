# Akaunto

## Start the server

- Install [Docker](https://docs.docker.com/engine/installation/) and [Docker-compose](https://docs.docker.com/compose/install/);
- Run `docker-compose build` in the root folder (and wait for the download / extraction to be over);
- Run `docker-compose up node`.
 
The *Node.js* server will be up and running on port `8181`, and the *MongoDB* on port `27017`.
The server is also started with the `nodemon` utility, and so will automatically restart whenever changes are made to the code.
From now on, running `docker-compose up node` will be sufficient to start the server.

Moreover, the [Genghis](http://genghisapp.com/) utility can be started with `docker-compose up genghis`; it will be available on port `5678`, to manage the *MongoDB* documents.

## Create a user from the command line

To create a user from the command line, run the following command while the Docker container is running:
```
docker exec -ti Akaunto_node node app/scripts/add-user.js
```
A command line prompt will ask for some fields information, and then will save the user.

## Run server-side tests

Run the following command:
```
docker-compose up test
```

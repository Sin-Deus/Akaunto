# Akaunto

## How to start the server

- Install [Docker](https://docs.docker.com/engine/installation/) and [Docker-compose](https://docs.docker.com/compose/install/);
- Run `docker-compose build` in the root folder (and wait for the download / extraction to be over);
- Run `docker-compose up`.
 
The *Node.js* server will be up and running on port `8181`, and the *MongoDB* on port `27017`. Moreover, the [Genghis](http://genghisapp.com/) utility will be available on port `5678`, to manage the *MongoDB* documents.
The server is also started with the `nodemon` utility, and so will automatically restart whenever changes are made to the code.
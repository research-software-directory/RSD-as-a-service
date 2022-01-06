# Research Software Directory (RSD) - Frontend

This service can automatically be build and started with `docker-compose`. It does not work in conjunction with the `data-migration` service. It also assumes that the database is empty at the start.

The service runs its tests using the `newman` npm package. Postman can be used as a GUI for running and editing tests by importing the json file from this directory.

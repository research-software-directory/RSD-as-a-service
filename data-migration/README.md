##  Data migration
This directory contains a `java` program that migrates data from the existing RSD to the new RSD. 

### Building and running. 
The program can easily be run with `docker-compose`: 
1. Go up one directory (that directory contains the file `docker-compose.yml`).
2. Run the command `docker-compose build`. You might see an error from the service `data-migration_1`. This is intentional and is used as a workaround to only download dependencies if needed but to not start the program. The whole process itself should end successfully.
3. Run the command `docker-compose up`. As a lot of data is downloaded and processed, this can take a while (think 10 to 20 seconds).
4. After the service `data-migration_1` has exited with code `0`, you can view the data at various endpoints, e.g. http://localhost:3500/software and http://localhost:3500/project?select=*,output:mention!output_for_project(*),impact:mention!impact_for_project(*).
5. If after you stopped the services you want to start them again, run `docker-compose up database backend` as to not start the data migration program again (otherwise you will get errors).
6. If you want to start from scratch again (if the database structure has changed for example), run `docker-compose down` first to delete the database before going through this process again.

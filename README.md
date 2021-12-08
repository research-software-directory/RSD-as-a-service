# RSD-as-a-service
## Our mission: To promote the visibility, impact and reuse of research software

This repo contains the new RSD-as-a-service implementation

### Building
The program can easily be built with `docker-compose`:
1.  Run the command `docker-compose build`. You might see an error from the service `data-migration_1`. This is intentional and is used as a workaround to only download dependencies if needed but to not start the program. The whole process itself should end successfully.

### Running locally
The program can easily be build with `docker-compose`. To run with the data migration script:
1. Run the command `docker-compose up`. As a lot of data is downloaded and processed, this can take a while (think 15 to 30 seconds).
1. After the service `data-migration_1` has exited with code `0`, you can view the data at various endpoints, e.g. http://localhost:3500/software and http://localhost:3500/project?select=*,output:mention!output_for_project(*),impact:mention!impact_for_project(*).

To run without the data migration script:
1. Run the command `docker-compose up --scale data-migration=0`.

To clear the database (if the database structure has changed for example) before repeating the process:
1. Run the command `docker-compose down`.

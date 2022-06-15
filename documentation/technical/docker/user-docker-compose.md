# How to use docker-compose

2 files are at disposal in order to setup your database.
Since NoSQL and SQL have a different java implementation, you have to take the chosen one by the group.

By default, we have implemented an example with MongoDB in the first version of the application.

The files are in `src/main/docker/docker-compose`.

> Each files will setup 2 images. the first one is the database, the second is a DB explorer web based.
> The DB Explorer listen on `localhost:8082`

## Launch the containers

> The following documentation assume you are working on windows.
> `If you are working on a Unix or MacOS based system, please let us know.`

1. Ensure `DockerDesktop` is running.
2. Open a `powershell` terminal.
3. Use the following commands:

```bash
cd src/main/docker/docker-compose
docker-compose -f $FILE_NAME up
# docker-compose -f mongo.yaml up
# docker-compose -f postgres.yaml up
```

## Notes

- Please do not change binded ports or username/password dedicated for your setup.
- If you want to do it, add your configuration in a dedicated folder and exclude it via `.gitgnore`

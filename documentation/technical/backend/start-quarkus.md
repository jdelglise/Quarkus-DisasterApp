# How to start Quarkus

## Install a JDK

1. Download a JDK17. For instance the JDK Coretto that you can find [here](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html)
2. Unzip the file into the folder you want
3. Set the environment variable `JAVA_HOME` to the folder you just created
4. Add an entry into the `PATH`environment variable pointing to the folder you just create + `\bin`
5. Edit your IDE configuration if needed

#### Example

```bash
JAVA_HOME="C:\Users\johan\.jdks\jdk17.0.2_8"
PATH=$PATH:"C:\Users\johan\.jdks\jdk17.0.2_8\bin"
```

## Install quarkus

Open a powershell terminal then:

```powershell
iex "& { $(iwr https://ps.jbang.dev) } app install --fresh --force quarkus@quarkusio"
```

## Database Setup

### Mongo

1. Connect to mongo on localhost:8082
2. Create the collection `groupe4`

## Lombok

As this project use Lombok, you will have to add a plugin on your IDE in order to use it.
You can find the correct plugin to install depending of your IDE [HERE](https://projectlombok.org/setup/overview).

## First Launch
1. Run `mvn generate-sources`
2. Run `mvn clean package`
## Starting Quarkus application

from the repository root:
`.\mvnw quarkus:dev`

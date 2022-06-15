# Backend cheatsheet

## Random Facts

- Interface name starts with a **I** _(ex: IUserMapper)_.
- If you can, add a _SonarLint_ Plugin in order to check your code practice
- The OpenAPI contract (previously known as Swagger) is the base to generate DTO objects and API calls. Always edit the swagger first, and never edit any of the auto-generate file
- You can regenerate OpenApi and MapStruct Mapping using this command: `mvn generate-sources`
  - **This command is necessary when you create a new mapper**

## Package

> Where should I put my stuff ?

| Package        | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| **resource**   | API implementations                                           |
| **entity**     | database entity models                                        |
| **mapper**     | MapStruct interface for mappings                              |
| **repository** | database CRUD interface                                       |
| **util**       | static classes for specific usage                             |
| **service**    | bean classes for specific usage which cannot be in `resource` |

> NB: All package might not be present yet since they have no content.
> Create them if needed.

### Create your own

If you need other packages, please follow these rules:

- a package name is always singular.

## Dependencies Documentation

### General

- [Quarkus General](https://quarkus.io/guides/)
- [Panache MongoDB](https://quarkus.io/guides/mongodb-panache)
  - **Note**: Use `Solution 2`
- [OpenApi Generator](https://github.com/OpenAPITools/openapi-generator)
- [Lombok](https://projectlombok.org/features/all)
- [MapStruct](https://mapstruct.org/documentation/reference-guide/)

### Tests

- [RestAssured](https://rest-assured.io/)
- [JUnit5 Guide](https://www.baeldung.com/junit-5)
- [Quarkus Testing](https://quarkus.io/guides/getting-started-testing)

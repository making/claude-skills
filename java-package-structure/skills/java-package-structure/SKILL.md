---
name: java-package-structure
description: >
  Enforces "package by feature" structure and class placement rules for Java projects.
  Trigger when creating new classes or reviewing package structure.
---

# Java Package Structure

Apply these rules whenever creating new classes or reviewing code organization.

---

## Core Principle: Package by Feature

Group classes by **business feature**, not by technical layer.

```
com.example.app/
├── user/                        # feature package
│   ├── User.java                #    domain object (clean)
│   ├── UserService.java
│   ├── UserRepository.java
│   └── web/                     #    web layer sub-package
│       └── UserController.java  #    controller + inner DTOs
├── order/
│   ├── Order.java
│   ├── OrderService.java
│   └── web/
│       └── OrderController.java
```

**Never do this:**
```
com.example.app/
├── controller/    ← wrong: technical layer package
├── service/       ← wrong
├── repository/    ← wrong
└── dto/           ← wrong
```

---

## Web Layer Rules

- Controllers go in the **`web` sub-package** under the feature package.
- Each feature has its **own `web` package** — never share `web` across features.
- Other layers (service, repository) do **not** get dedicated sub-packages.

---

## Domain Objects

- Domain objects must be **clean**: no imports from web or database layers.
- Domain objects should not extend or implement framework-specific types.

---

## DTOs — Inner Records

Define request/response DTOs as **inner record classes** inside the class that uses them.

```java
// Correct — DTOs as inner records in the controller
public class UserController {

    /** Request body for user creation. */
    public record CreateUserRequest(String name, String email) {}

    /** Response body after user creation. */
    public record CreateUserResponse(Long id, String name, String email) {}

    @PostMapping
    public CreateUserResponse create(@RequestBody CreateUserRequest request) {
        // ...
    }
}
```

Do **not** create a separate `dto/` package or standalone DTO classes.

---

## No Package Cycles

Package dependencies must form a **directed acyclic graph**. Feature packages must not
depend on each other cyclically, and a sub-package must not depend back on classes that
depend on it.

- If two features need each other, extract the shared concept into a separate package,
  or invert one direction with an interface owned by the depending side.
- `<feature>/web/` may depend on `<feature>/`, never the reverse.

Enforce this with an ArchUnit test so violations fail the build instead of relying on review.

```xml
<dependency>
    <groupId>com.tngtech.archunit</groupId>
    <artifactId>archunit-junit5</artifactId>
    <scope>test</scope>
</dependency>
```

```java
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

@AnalyzeClasses(packages = "com.example.myapp", importOptions = ImportOption.DoNotIncludeTests.class)
class PackageCycleArchTest {

    @ArchTest
    static final ArchRule packagesAreFreeOfCycles = slices().matching("com.example.myapp.(*)..")
        .should()
        .beFreeOfCycles();

}
```

- Replace `com.example.myapp` with the application's base package.
- `matching("...(*)..")` slices by the first package segment below the base package, so each
  top-level feature becomes one slice.
- Never suppress a detected cycle with `allowEmptyShould` or by narrowing the slice pattern —
  fix the dependency direction instead.

---

## Quick Checklist

- [ ] New class placed in the correct feature package (not a technical layer package)
- [ ] Controllers are in `<feature>/web/` sub-package
- [ ] Each feature has its own `web` package (not shared)
- [ ] No dedicated `service/`, `repository/`, `dto/` packages
- [ ] Domain objects have no web or database layer imports
- [ ] DTOs are inner record classes in the class that uses them
- [ ] No cyclic dependencies between packages
- [ ] An ArchUnit `beFreeOfCycles` test exists and passes

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

## Quick Checklist

- [ ] New class placed in the correct feature package (not a technical layer package)
- [ ] Controllers are in `<feature>/web/` sub-package
- [ ] Each feature has its own `web` package (not shared)
- [ ] No dedicated `service/`, `repository/`, `dto/` packages
- [ ] Domain objects have no web or database layer imports
- [ ] DTOs are inner record classes in the class that uses them

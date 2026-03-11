---
name: java-code-standards
description: >
  Enforces general Java coding standards when writing, reviewing, or refactoring Java code.
  Trigger this skill whenever Java code is being written or reviewed — even if the user doesn't
  explicitly mention standards. Covers: builder pattern usage, Javadoc language, Java 25 modern
  features (Records, Pattern Matching, Text Blocks), and prohibited libraries/annotations.
  Always consult this skill before producing any Java code in this project.
---

# Java Code Standards

Apply these rules every time you write or review Java code in this project.

---

## Code Style

- **Builder pattern**: Required when a constructor or method has **more than two arguments**.
- **Javadoc and comments**: Always write in **English**.
- **Formatting**: Must comply with **Spring Java Format** (enforced via Maven plugin). All code
  must pass formatting validation before commit. If the plugin is missing from `pom.xml`, add it
  to `<build><plugins>`:
  ```xml
  <plugin>
      <groupId>io.spring.javaformat</groupId>
      <artifactId>spring-javaformat-maven-plugin</artifactId>
      <version>0.0.47</version>
  </plugin>
  ```

---

## Java Version & Features

Check the project's Java version from `pom.xml` (`<java.version>` or `<maven.compiler.source>`)
and use the latest features available for that version. Do not use features that require a higher
version than the project targets.

| Feature | Min Version | Usage |
|---|---|---|
| Switch expressions | Java 14 | ✅ Prefer over switch statements |
| Text Blocks | Java 15 | ✅ Use for multi-line strings (SQL, JSON, HTML) |
| Java Records | Java 16 | ✅ Use for immutable data carriers, DTOs, config properties |
| Pattern Matching (`instanceof`) | Java 16 | ✅ Eliminate explicit casts |
| Sealed classes | Java 17 | ✅ Use where appropriate |
| Pattern Matching (`switch`) | Java 21 | ✅ Use for type-based dispatch |
| Virtual Threads | Java 21 | ✅ Consider for I/O-bound concurrency |
| `var` | Java 10 | ❌ **Never use** |

---

## Prohibited Dependencies

- ❌ **No Lombok** — write constructors, getters, builders manually or use Records
- ❌ **No Google Guava** — use Java standard library equivalents

---

## Circular References

- Avoid circular references between **classes** and between **packages**.

---

## Quick Checklist

- [ ] Builder pattern used when constructor/method args > 2
- [ ] All Javadoc and comments written in English
- [ ] Spring Java Format plugin present in `pom.xml`
- [ ] No `var` anywhere in the code
- [ ] No Lombok annotations or imports
- [ ] No Guava imports
- [ ] Modern Java features used (within project's Java version)
- [ ] No circular dependencies between classes or packages


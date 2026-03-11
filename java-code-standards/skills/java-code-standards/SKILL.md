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
| Switch expressions | Java 14 | Prefer over switch statements |
| Text Blocks | Java 15 | Use for multi-line strings (SQL, JSON, HTML) |
| Java Records | Java 16 | Use for immutable data carriers, DTOs, config properties |
| Pattern Matching (`instanceof`) | Java 16 | Eliminate explicit casts |
| Sealed classes | Java 17 | Use where appropriate |
| Pattern Matching (`switch`) | Java 21 | Use for type-based dispatch |
| Virtual Threads | Java 21 | Consider for I/O-bound concurrency |
| `var` | Java 10 | **Never use** |

---

## Prohibited Dependencies

- **No Lombok** — write constructors, getters, builders manually or use Records
- **No Google Guava** — use Java standard library equivalents

---

## Null Safety

- **Use JSpecify + NullAway** to enforce null-safety at compile time.
- NullAway is configured via `nullability-maven-plugin`. If the project does not have it, add to
  `<build><plugins>` in `pom.xml`:
  ```xml
  <plugin>
      <groupId>am.ik.maven</groupId>
      <artifactId>nullability-maven-plugin</artifactId>
      <version>0.3.0</version>
      <extensions>true</extensions>
      <executions>
          <execution>
              <goals>
                  <goal>configure</goal>
                  <goal>generate-package-info</goal>
              </goals>
          </execution>
      </executions>
  </plugin>
  ```
- If JSpecify dependency is missing, add it (Spring Boot 4+ includes it transitively):
  ```xml
  <dependency>
      <groupId>org.jspecify</groupId>
      <artifactId>jspecify</artifactId>
      <version>1.0.0</version>
  </dependency>
  ```
- **Approach**: Do NOT eagerly annotate with `@Nullable`. Instead, keep the default (non-null) and
  run `mvn compile` to let NullAway catch issues at compile time. Fix errors by making code
  null-safe:
  - Add `@Nullable` only where null is genuinely required (return value or parameter).
  - Prefer null-free designs: return `Optional`, use default values, validate early, etc.

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
- [ ] `nullability-maven-plugin` present in `pom.xml`
- [ ] JSpecify dependency present in `pom.xml`
- [ ] `mvn compile` passes with no NullAway errors
- [ ] No circular dependencies between classes or packages


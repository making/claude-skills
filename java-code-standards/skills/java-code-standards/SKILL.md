---
name: java-code-standards
description: >
  Enforces general Java coding standards when writing, reviewing, or refactoring Java code.
  Trigger whenever Java code is being written or reviewed.
---

# Java Code Standards

Apply these rules every time you write or review Java code in this project.

---

## Code Style

- **Builder pattern**: Required when a constructor or method has **more than two arguments**.
  See [Builder Pattern Rules](#builder-pattern-rules) below for implementation details.
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

### Builder Pattern Rules

#### Records with > 2 components

Add a static inner `Builder` class. Mark reference-type fields with `@Nullable` and leave them
uninitialized. Validate required fields in `build()` using `Objects.requireNonNull` with an
error message.

```java
public record UserResponse(String id, String name, String email, Instant createdAt) {

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {

        @Nullable
        private String id;

        @Nullable
        private String name;

        @Nullable
        private String email;

        @Nullable
        private Instant createdAt;

        private Builder() {
        }

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserResponse build() {
            return new UserResponse(Objects.requireNonNull(this.id, "id is required"),
                    Objects.requireNonNull(this.name, "name is required"),
                    Objects.requireNonNull(this.email, "email is required"),
                    Objects.requireNonNull(this.createdAt, "createdAt is required"));
        }

    }

}
```

#### Methods with > 2 parameters

Extract parameters into a **parameter object** (record). If the parameter object itself has > 2
components, it also needs a builder.

```java
// Before (3 args — violates rule)
public List<User> findPage(int offset, int limit, String sort) { ... }

// After (1 arg — parameter object with builder)
public record PageRequest(int offset, int limit, String sort) {

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {

        private int offset;

        private int limit;

        @Nullable
        private String sort;

        private Builder() {
        }

        public Builder offset(int offset) {
            this.offset = offset;
            return this;
        }

        public Builder limit(int limit) {
            this.limit = limit;
            return this;
        }

        public Builder sort(String sort) {
            this.sort = sort;
            return this;
        }

        public PageRequest build() {
            return new PageRequest(this.offset, this.limit,
                    Objects.requireNonNull(this.sort, "sort is required"));
        }

    }

}

public List<User> findPage(PageRequest request) { ... }
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
      <configuration>
          <checking>tests</checking>
      </configuration>
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


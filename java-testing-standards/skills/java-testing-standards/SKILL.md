---
name: java-testing-standards
description: >
  Enforces Java testing standards when writing or reviewing test code. Trigger whenever the user
  asks to write tests, add test coverage, set up integration tests, or review existing test
  classes. Covers: JUnit 5 with AssertJ, @SpringBootTest with Testcontainers, @TempDir usage,
  and test independence requirements. Always consult this skill before writing any test code
  in this project.
---

# Java Testing Standards

Apply these rules every time you write or review test code in this project.

---

## Unit Tests

Use **JUnit 5** with **AssertJ** assertions for service layer tests.

```java
// Correct — AssertJ assertions
@Test
void shouldReturnUserWhenFound() {
    User result = userService.findById(1L);

    assertThat(result).isNotNull();
    assertThat(result.name()).isEqualTo("Alice");
}

// Wrong — JUnit built-in assertions
assertEquals("Alice", result.name());
```

---

## Integration Tests

For Spring Boot applications, use `@SpringBootTest` with **Testcontainers** for full application
context tests. When using SQLite as the database, Testcontainers is not needed — use `@TempDir`
with `@DynamicPropertySource` instead (see `spring-code-standards` for the setup).

---

## Filesystem Tests

Use `@TempDir` for any test that involves filesystem operations.

```java
@Test
void shouldWriteFile(@TempDir Path tempDir) {
    Path outputFile = tempDir.resolve("output.txt");
    // ...
}
```

---

## Test Independence

- Tests must **not depend on each other** — each test must set up its own state.
- Tests must **not share mutable state** between test methods.
- All tests must **pass before completing any task**.

---

## Test Assertion Style

- Always assert the full expected output using `isEqualToNormalizingWhitespace` with a text block.
- Do **not** use `contains` / `doesNotContain` for output verification.

---

## Quick Checklist

- [ ] Unit tests use JUnit 5 + AssertJ (not JUnit `assertEquals` etc.)
- [ ] Integration tests use `@SpringBootTest` + Testcontainers (Spring Boot apps only)
- [ ] Filesystem tests use `@TempDir`
- [ ] Each test is independent (no shared mutable state)
- [ ] Output assertions use `isEqualToNormalizingWhitespace` with text block (not `contains`)
- [ ] All tests pass before submitting

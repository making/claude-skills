---
name: java-testing-standards
description: >
  Enforces Java testing standards when writing or reviewing test code.
  Trigger when writing tests or reviewing test classes.
---

# Java Testing Standards

Apply these rules every time you write or review test code in this project.

---

## Test Strategy

Prefer **E2E tests** and **Integration tests** that verify external behavior over unit tests that
test internal implementation details. Tests should exercise the system through its public interfaces
(HTTP endpoints, CLI commands, message handlers) whenever possible.

- **E2E tests**: For applications with HTML-based UI, use **Playwright** for browser-based E2E
  testing. Playwright tests should drive the application through the browser just as a real user
  would.
- **Integration tests**: For API-based applications, use `@SpringBootTest` with a real HTTP client
  (`WebTestClient` or `RestTestClient`) to test endpoints end-to-end within the Spring context.
- **Unit tests**: Reserve for pure logic (utilities, domain calculations) that has no external
  dependencies and benefits from fast, isolated testing.

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

- [ ] Prefer E2E / Integration tests over unit tests for verifying external behavior
- [ ] Browser-based E2E tests use Playwright
- [ ] Unit tests use JUnit 5 + AssertJ (not JUnit `assertEquals` etc.)
- [ ] Integration tests use `@SpringBootTest` + Testcontainers (Spring Boot apps only)
- [ ] Filesystem tests use `@TempDir`
- [ ] Each test is independent (no shared mutable state)
- [ ] Output assertions use `isEqualToNormalizingWhitespace` with text block (not `contains`)
- [ ] All tests pass before submitting

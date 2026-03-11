---
name: spring-code-standards
description: >
  Enforces Spring Boot coding standards when writing or reviewing Spring components and configuration.
  Trigger when writing or reviewing Spring Boot code.
---

# Spring Code Standards

Apply these rules every time you write or review Spring Boot code in this project.

---

## Dependency Injection

- Always use **constructor injection**.
- `@Autowired` is **not required** and should be omitted — except in test code where field
  injection may be acceptable.

```java
// Correct
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}

// Wrong
@Autowired
private UserRepository userRepository;
```

---

## HTTP Client

- Use **`RestClient`** for all external API calls.
- **Never** use `RestTemplate`.
- Inject via autoconfigured **`RestClient.Builder`**:

```java
public class ExternalApiClient {

    private final RestClient restClient;

    public ExternalApiClient(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.baseUrl("https://api.example.com").build();
    }
}
```

---

## Database Access

- Use **`JdbcClient`** for all database operations.
- **Never** use `JdbcTemplate` — **except** for batch updates.
- Do **not** use JPA or Spring Data unless explicitly instructed.

```java
// Correct
public class UserRepository {

    private final JdbcClient jdbcClient;

    public UserRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Optional<User> findById(Long id) {
        return jdbcClient.sql("SELECT * FROM users WHERE id = :id")
                .param("id", id)
                .query(User.class)
                .optional();
    }
}
```

---

## Configuration Classes

- Always use **`@Configuration(proxyBeanMethods = false)`**:

```java
// Correct
@Configuration(proxyBeanMethods = false)
public class AppConfig {
    // ...
}
```

---

## Configuration Properties

- Use **`@ConfigurationProperties` + Java Record** — never `@Value`.
- Use **`@DefaultValue`** for non-null default values.

```java
// Correct
@ConfigurationProperties(prefix = "app.storage")
public record StorageProperties(
        String bucket,
        @DefaultValue("us-east-1") String region,
        @DefaultValue("100") int maxFileSizeMb) {}

// Wrong
@Value("${app.storage.bucket}")
private String bucket;
```

---

## HTTP Testing in Spring Boot Tests

For HTTP access in tests, use **`RestTestClient`** (Spring Boot 4 / Spring Framework 7+).
Do **not** use `TestRestTemplate` or `MockMvc` directly.

`RestTestClient` supports several binding modes:

| Binding | Usage |
|---|---|
| `bindToController(controller)` | Single controller, no Spring context |
| `bindTo(mockMvc)` | Bind to existing `MockMvc` instance (`@WebMvcTest`) |
| `bindToApplicationContext(ctx)` | Full context without live server |
| `bindToServer(requestFactory)` | Live server (use with `@SpringBootTest` + random port) |

For `@SpringBootTest` with a random/defined port, inject `RestTestClient` via
`@AutoConfigureRestTestClient`:

```java
import import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
// ...

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
class UserControllerIT {

    @Autowired
    RestTestClient client;

    @Test
    void shouldReturnUser() {
        client.get().uri("/users/1")
                .exchange()
                .expectStatus().isOk()
                .expectBody(UserResponse.class)
                .value(user -> assertThat(user.name()).isEqualTo("Alice"));
    }
}
```

---

## Database for Demo / Sample Applications

For demo or sample applications, use **SQLite** instead of in-memory implementations.

- Do **not** use in-memory maps, lists, or H2/HSQLDB as a fake database.
- Use SQLite via `jdbc:sqlite:<path>` as a lightweight persistent store.

For tests using SQLite, set up a disposable per-test database with `@TempDir` and
`@DynamicPropertySource`:

```java
@TempDir
static Path tempDir;

@DynamicPropertySource
static void registerProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", () -> "jdbc:sqlite:" + tempDir.resolve("test.db").toAbsolutePath());
}
```

---

## Quick Checklist

- [ ] Constructor injection used everywhere (no `@Autowired` outside tests)
- [ ] `RestClient` used, not `RestTemplate`
- [ ] `RestClient` built from injected `RestClient.Builder`
- [ ] `JdbcClient` used, not `JdbcTemplate` (except batch updates)
- [ ] No JPA or Spring Data unless explicitly instructed
- [ ] `@Configuration(proxyBeanMethods = false)` on all config classes
- [ ] `@ConfigurationProperties` + Record used for config (no `@Value`)
- [ ] `@DefaultValue` used for non-null defaults in config records
- [ ] Demo/sample apps use SQLite, not in-memory implementations

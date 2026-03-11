# claude-skills

A collection of Claude skills for Java and Spring Boot development.

## Skills

| Skill | Description |
|---|---|
| `java-code-standards` | General Java coding standards: builder pattern, modern Java features, prohibited libraries |
| `java-package-structure` | Package by feature structure and DTO placement rules |
| `java-testing-standards` | Testing standards: JUnit 5, AssertJ, Testcontainers, assertion style |
| `spring-code-standards` | Spring Boot standards: DI, RestClient, JdbcClient, configuration, SQLite, HTTP testing |
| `documentation-standards` | Documentation standards for README.md and CLAUDE.md |

## Installation

### Claude Code

Clone this repository into `~/.claude/skills/`:

```bash
git clone https://github.com/making/claude-skills ~/.claude/skills/claude-skills
```

Or install individual skills:

```bash
# Example: install java-code-standards only
mkdir -p ~/.claude/skills
git clone --filter=blob:none --sparse https://github.com/making/claude-skills ~/.claude/skills/claude-skills
cd ~/.claude/skills/claude-skills
git sparse-checkout set java-code-standards
```

### Claude.ai

Download the `.skill` files from the [latest release](https://github.com/making/claude-skills/releases/latest),
then upload them in Claude.ai via **Customize > Skills**.

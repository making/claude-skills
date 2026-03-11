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

Clone this repository and copy skills into `~/.claude/skills/`:

```bash
git clone https://github.com/making/claude-skills /tmp/claude-skills
mkdir -p ~/.claude/skills
cp -r /tmp/claude-skills/*-standards ~/.claude/skills/
rm -rf /tmp/claude-skills
```

Or install individual skills:

```bash
# Example: install java-code-standards only
mkdir -p ~/.claude/skills
git clone --filter=blob:none --sparse https://github.com/making/claude-skills /tmp/claude-skills
cd /tmp/claude-skills
git sparse-checkout set java-code-standards
cp -r java-code-standards ~/.claude/skills/
rm -rf /tmp/claude-skills
```

After installation, verify with `/skills` in Claude Code. Each skill directory should be directly under `~/.claude/skills/`:

```
~/.claude/skills/
  java-code-standards/SKILL.md
  java-testing-standards/SKILL.md
  spring-code-standards/SKILL.md
  ...
```

### Claude.ai

Download the `.skill` files from the [latest release](https://github.com/making/claude-skills/releases/latest),
then upload them in Claude.ai via **Customize > Skills**.

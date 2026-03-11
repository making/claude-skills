# claude-skills

A collection of Claude skills for Java and Spring Boot development.

## Plugins

| Plugin | Description |
|---|---|
| `java-code-standards` | General Java coding standards: builder pattern, modern Java features, prohibited libraries |
| `java-package-structure` | Package by feature structure and DTO placement rules |
| `java-testing-standards` | Testing standards: JUnit 5, AssertJ, Testcontainers, assertion style |
| `spring-code-standards` | Spring Boot standards: DI, RestClient, JdbcClient, configuration, SQLite, HTTP testing |
| `documentation-standards` | Documentation standards for README.md and CLAUDE.md |

## Installation

### Plugin Marketplace (recommended)

Add this marketplace to Claude Code:

```
/plugin marketplace add making/claude-skills
```

Then install individual plugins:

```
/plugin install java-code-standards@making-claude-skills
/plugin install java-package-structure@making-claude-skills
/plugin install java-testing-standards@making-claude-skills
/plugin install spring-code-standards@making-claude-skills
/plugin install documentation-standards@making-claude-skills
```

### Manual Installation

Clone this repository and copy skills into `~/.claude/skills/`:

```bash
git clone https://github.com/making/claude-skills /tmp/claude-skills
mkdir -p ~/.claude/skills
for d in /tmp/claude-skills/*/skills/*/; do cp -r "$d" ~/.claude/skills/; done
rm -rf /tmp/claude-skills
```

After installation, verify with `/skills` in Claude Code.

### Claude.ai

Download the `.skill` files from the [latest release](https://github.com/making/claude-skills/releases/latest),
then upload them in Claude.ai via **Customize > Skills**.

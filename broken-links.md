# Broken Links in valkey-glide Source

## Malformed HTML (missing closing quote)

- `java/client/src/main/java/glide/api/commands/ConnectionManagementCommands.java:85`
- `java/client/src/main/java/glide/api/commands/ConnectionManagementCommands.java:99`
  - Has: `<a href="https://valkey.io/commands/echo/>valkey.io</a>`

## Wrong URL path (`/docs/commands/` → `/commands/`)

- `java/client/src/main/java/glide/api/commands/GenericClusterCommands.java:151`
  - Has: `https://valkey.io/docs/commands/randomkey/`

- `node/src/BaseClient.ts:4411`
  - Has: `https://valkey.io/docs/latest/commands/sinter/`

- `python/glide-async/python/glide/async_commands/standalone_commands.py:532`
  - Has: `https://valkey.io/docs/latest/commands/function-dump/`

- `python/glide-async/python/glide/async_commands/standalone_commands.py:554`
  - Has: `https://valkey.io/docs/latest/commands/function-restore/`

- `python/glide-sync/glide_sync/sync_commands/standalone_commands.py:530`
  - Has: `https://valkey.io/docs/latest/commands/function-dump/`

- `python/glide-sync/glide_sync/sync_commands/standalone_commands.py:552`
  - Has: `https://valkey.io/docs/latest/commands/function-restore/`

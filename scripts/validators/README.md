# Example Validators

Compile the code examples in the docs against the real GLIDE client libraries, to catch broken syntax, wrong method names, and outdated APIs.

## How they work

1. Extract fenced code blocks (e.g. ` ```csharp `, ` ```typescript `) from the MDX docs.
2. Wrap each snippet into a compilable file, injecting common imports/client declarations.
3. Compile everything against a GLIDE client you've already built and point the script at.
4. Report any compiler errors per source file/line.

`_common.py` holds the shared extraction logic used by every language-specific validator.

## Usage

**C#**

You must build `Valkey.Glide.dll` yourself first — the script does not do this for you:

```bash
cd <path_to_valkey-glide-csharp> && dotnet build sources/Valkey.Glide/ --configuration Release /p:SkipCargo=true
```

Then run the validator:

```bash
python scripts/validators/check-csharp-examples.py \
  --validator <path_to_valkey-glide-csharp>/dev/scripts/validate_examples.py \
  --glide-dll <path_to_valkey-glide-csharp>/sources/Valkey.Glide/bin/Release/net8.0/Valkey.Glide.dll
```

**Node.js**

You must build the client yourself first — the script does not do this for you:

```bash
cd <path_to_valkey-glide>/node && npm ci && npm run build:release
```

Then run the validator:

```bash
python scripts/validators/check-node-examples.py --glide-index <path_to_valkey-glide>/node/build-ts/index.d.ts
```

Both scripts run automatically in CI on every PR (see `.github/workflows/check-csharp-examples.yml` and `.github/workflows/check-node-examples.yml`).

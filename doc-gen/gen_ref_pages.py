"""Generate the code reference pages and navigation."""

import ast
from pathlib import Path

import mkdocs_gen_files

nav = mkdocs_gen_files.Nav()

root = Path(__file__).parent

# (section_label, package_name, source_dir)
packages = [
    ("Glide Async", "glide", root / "valkey-glide/python/glide-async/python/glide"),
    ("Glide Sync", "glide_sync", root / "valkey-glide/python/glide-sync/glide_sync"),
    ("Glide Shared", "glide_shared", root / "valkey-glide/python/glide-shared/glide_shared"),
]

# Files/dirs to exclude
EXCLUDE_NAMES = {
    "protobuf",
    "protobuf_codec.py",
    "constants.py",
    "py.typed",
    "glide.pyi",
    "server_modules",
    "ft_options",
    "ft_constants.py",
    "utils.py",
}

# Classes to exclude from documentation
EXCLUDE_CLASSES = {
    "FFIClientTypeEnum",
    "PubSubChannelModes",
    "PubSubSubscriptions",
    "PubSubState",
    "AdvancedBaseClientConfiguration",
    "CommandNames",
    "FtCreateKeywords",
    "FtSearchKeywords",
    "FtAggregateKeywords",
    "FtProfileKeywords",
}


def get_public_classes(filepath):
    """Parse a .py file and return public class names, excluding internal ones."""
    try:
        tree = ast.parse(filepath.read_text())
    except SyntaxError:
        return []
    return [
        node.name
        for node in ast.iter_child_nodes(tree)
        if isinstance(node, ast.ClassDef)
        and not node.name.startswith("_")
        and node.name not in EXCLUDE_CLASSES
    ]


def has_public_functions(filepath):
    """Check if a .py file has any public function definitions."""
    try:
        tree = ast.parse(filepath.read_text())
    except SyntaxError:
        return False
    return any(
        isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
        and not node.name.startswith("_")
        for node in ast.iter_child_nodes(tree)
    )


for section, pkg_name, src_dir in packages:
    for path in sorted(src_dir.rglob("*.py")):
        # Skip excluded files/dirs
        if any(part in EXCLUDE_NAMES for part in path.relative_to(src_dir).parts):
            continue

        module_path = path.relative_to(src_dir).with_suffix("")
        doc_path = path.relative_to(src_dir).with_suffix(".md")
        full_doc_path = Path("reference", pkg_name, doc_path)

        parts = tuple(module_path.parts)

        # Skip private modules
        if any(p.startswith("_") for p in parts):
            continue

        if parts[-1] == "__init__":
            parts = parts[:-1]
            doc_path = doc_path.with_name("index.md")
            full_doc_path = full_doc_path.with_name("index.md")
        elif parts[-1] == "__main__":
            continue

        # Get public classes via ast
        classes = get_public_classes(path)
        if not classes and not has_public_functions(path) and parts[-1] != "__init__":
            continue

        # Build module identifier
        module_ident = ".".join([pkg_name] + list(parts))

        # Nav entry
        nav_parts = (section,) + parts if parts else (section,)
        nav[nav_parts] = Path(pkg_name, doc_path).as_posix()

        with mkdocs_gen_files.open(full_doc_path, "w") as fd:
            if classes:
                for cls in classes:
                    fd.write(f"::: {module_ident}.{cls}\n\n")
            else:
                fd.write(f"::: {module_ident}\n")

        mkdocs_gen_files.set_edit_path(full_doc_path, path.relative_to(root))

with mkdocs_gen_files.open("reference/SUMMARY.md", "w") as nav_file:
    nav_file.writelines(nav.build_literate_nav())

"""Read-only verification of audited Skill copies and the website baseline."""
import hashlib
import json
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parents[3]
docs = root / "docs/creative-direction"
expected = json.loads((docs / "evidence/installed-files-sha256.json").read_text())
actual = {
    str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest()
    for p in (root / ".agents/skills").rglob("*") if p.is_file()
}
assert actual == expected, "Installed files differ from audited manifest; review before restore/update"
lock = json.loads((root / "skills-lock.json").read_text())
sources = json.loads((docs / "audited-sources.json").read_text())
names = {s["name"] for s in sources["sources"] if s["status"] == "installed"}
assert set(lock["skills"]) == names
assert {p.name for p in (root / ".agents/skills").iterdir() if p.is_dir()} == names
for source in sources["sources"]:
    if source["status"] != "installed":
        assert not (root / ".agents/skills" / source["name"]).exists()
        continue
    folder = root / ".agents/skills" / source["name"]
    assert (folder / "SKILL.md").is_file()
    assert lock["skills"][source["name"]]["commit"] == source["commit"]
    digest = hashlib.sha256()
    files = sorted(
        (p for p in folder.rglob("*") if p.is_file()
         and p.name != "metadata.json"
         and not any(x in {".git", "__pycache__", "__pypackages__"} for x in p.relative_to(folder).parts)),
        key=lambda p: p.relative_to(folder).as_posix().encode(),
    )
    for file in files:
        data = file.read_bytes()
        if b"\0" not in data:
            data = data.replace(b"\r\n", b"\n")
        digest.update(file.relative_to(folder).as_posix().encode() + b"\0")
        digest.update(str(len(data)).encode() + b"\0" + data)
    assert digest.hexdigest() == lock["skills"][source["name"]]["computedHash"], source["name"]
subprocess.run([
    "git", "diff", "--exit-code", sources["baseline"], "--",
    "AGENTS.md", "package.json", "package-lock.json", "src", "public", ".github", "scripts", "tests",
], cwd=root, check=True, stdout=subprocess.DEVNULL)
print(json.dumps({"installedSkills": sorted(names), "filesVerified": len(actual),
                  "hashesMatch": True, "websiteAndDependenciesUnchanged": True,
                  "impeccableInstalled": False}, indent=2))

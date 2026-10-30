# Panduan Agent: Tools Lokal

Folder `tools/` berisi repo referensi. Gunakan sesuai kebutuhan; jangan mengubah isinya.

## Skill (aktif di `.agents/skills/`)
Semua skill dari `tools/` sudah disalin ke `.agents/skills/` (daisyUI, graphify, motion, ECC, dioramas-web-design).
Sebelum mengerjakan tugas, cek apakah ada skill yang relevan dan baca `SKILL.md`-nya terlebih dahulu.
- UI/HTML/JSX: wajib pakai skill `daisyui`.
- Pertanyaan arsitektur/codebase: skill `graphify`.
- Audit, bug, perbaikan, PR: `find-bugs`, `improve`, `fix`, `pr-review`.
- Web 3D/sinematik: `dioramas-web-design` dan referensi `tools/dioramas`.
- Workflow umum (TDD, e2e, git, dll.): skill ECC (`tdd-workflow`, `e2e-testing`, `git-workflow`, ...).

## Referensi (tanpa SKILL.md, baca langsung bila relevan)
- `tools/lucide-svg/icons`: sumber ikon SVG Lucide. Untuk dipakai di kode, lebih baik `npm install lucide` (atau paket framework-nya).
- `tools/motion`: library animasi Motion. Rujuk `tools/motion/packages` dan `tools/motion/plans`. Pasang lewat `npm install motion`.
- `tools/dioramas`: contoh situs 3D di `tools/dioramas/examples`, dokumentasi di `tools/dioramas/docs`.
- `tools/daisyUI/packages/docs`: dokumentasi komponen daisyUI.
- `tools/ECC`: sumber lengkap skill ECC; lihat `ecc-guide` untuk panduan.

## Sinkronisasi
Jika `tools/` diperbarui, salin ulang folder `skills/` atau `.agents/skills/` yang baru ke `.agents/skills/`.

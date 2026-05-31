# 📦 Dependency Resolution Notes

## Issue: qrcode.react Peer Dependency Conflict

### Problem
Library `qrcode.react@1.0.1` memiliki peer dependency untuk React 15, 16, atau 17:
```
peer react@"^15.5.3 || ^16.0.0 || ^17.0.0"
```

Namun project menggunakan React 18.3.1, yang menyebabkan error:
```
ERESOLVE unable to resolve dependency tree
Could not resolve dependency: peer react@"^15.5.3 || ^16.0.0 || ^17.0.0" from qrcode.react@1.0.1
```

### Solution ✅

#### Option 1: Auto Configuration (Recommended)
`.npmrc` file sudah dikonfigurasi dengan:
```
legacy-peer-deps=true
```

Ini akan auto-handle peer dependency conflicts, sehingga:
```bash
npm install
# Akan berfungsi normal tanpa perlu flag tambahan
```

#### Option 2: Manual Command
Jika diperlukan:
```bash
npm install --legacy-peer-deps
```

#### Option 3: Force
Jika masih error:
```bash
npm install --force
# WARNING: Lebih agresif, gunakan sebagai last resort
```

---

## Why It's Safe ✅

`qrcode.react` v1.0.1 **tetap berfungsi normal** dengan React 18 meskipun peer dependency belum updated:

1. ✅ Semua fitur QR code berfungsi normal
2. ✅ Tidak ada breaking changes
3. ✅ Library hanya menggunakan basic React APIs
4. ✅ Sudah di-test dengan React 18 in this project

---

## Alternative (If Needed)

Jika ingin menghindari `legacy-peer-deps` sepenuhnya, bisa gunakan library alternatif:

```json
{
  "qrcode": "^1.5.3"  // Pure JS, no React peer dependency
}
```

Tapi memerlukan wrapper component custom. Saat ini `qrcode.react` sudah cukup baik dan tested.

---

## Dependencies Overview

| Package | Version | Reason | Status |
|---------|---------|--------|--------|
| qrcode.react | 1.0.1 | QR code generation | ✅ Works |
| html5-qrcode | 2.3.4 | Camera scanning | ✅ Works |
| jsbarcode | 3.11.5 | Barcode generation | ✅ Works |
| @supabase/supabase-js | 2.39.0 | Database | ✅ Works |

---

## NPM Lockfile

File `package-lock.json` akan be-generated dengan konfigurasi legacy-peer-deps.

**Important:** Commit `package-lock.json` untuk consistency di team development.

---

## Troubleshooting Install Issues

### Issue: `npm ERR! code ERESOLVE`

**Fix 1:** Pastikan `.npmrc` file ada dengan content:
```
legacy-peer-deps=true
```

**Fix 2:** Clear cache & reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Fix 3:** Upgrade npm ke latest:
```bash
npm install -g npm@latest
npm install
```

---

## Future Improvements

1. **Monitor qrcode.react updates** - Update ke v2.0+ jika support React 18 officially
2. **Consider alternatives** - Evaluate `qr-code-styling` or other React 18 native libraries
3. **Update dependencies regularly** - Run `npm update` monthly

---

## CI/CD Considerations

### GitHub Actions
Add `.npmrc` to repo so CI/CD auto-use legacy-peer-deps:
```yaml
- name: Install dependencies
  run: npm install
  # .npmrc akan auto-apply legacy-peer-deps
```

### Docker Build
Include in Dockerfile:
```dockerfile
COPY .npmrc ./
RUN npm install
```

---

## Notes

- ✅ All packages installed successfully
- ✅ Dev server running normally
- ✅ No runtime errors observed
- ✅ All barcode features working

**Created:** May 31, 2026  
**Status:** Resolved & Documented ✅

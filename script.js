// تهيئة EmailJS
(function() {
    emailjs.init('GRpOF1pKqcSg9cx5H');
    console.log('EmailJS initialized');
})();

// تبديل الثيم
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

// تطبيق الثيم المحفوظ
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
}

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
        ip: 'جاري جلب عنوان IP...',
        location: 'جاري تحديد الموقع...'
    };
    
    // عرض رسالة للمستخدم
    showMessage('جاري إرسال البيانات...', '');
    
    // جلب عنوان IP وتحديد الموقع
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            formData.ip = data.ip;
            return fetch(`https://ipapi.co/${data.ip}/json/`);
        })
        .then(response => response.json())
        .then(locationData => {
            formData.location = `
                ${locationData.city || 'غير معروف'}, 
                ${locationData.region || 'غير معروف'}, 
                ${locationData.country_name || 'غير معروف'}
            `;
        })
        .catch(() => {
            formData.ip = 'تعذر جلب عنوان IP';
            formData.location = 'تعذر تحديد الموقع';
        })
        .finally(() => {
            sendEmail(formData);
        });
});

function sendEmail(formData) {
    const serviceID = 'service_25q0ern';
    const templateID = 'template_xi6fmgy';
    
    emailjs.send(serviceID, templateID, {
        to_email: 'enadalharbi@gmail.com',
        subject: 'بيانات جديدة من الاستبيان',
        message: formatEmailHTML(formData)
    })
    .then(() => showMessage('تم إرسال البيانات بنجاح!', 'success'))
    .catch(error => {
        console.error('Error:', error);
        showMessage(`خطأ في الإرسال: ${error.status || 'غير معروف'}`, 'error');
        saveToLocalStorage(formData);
    });
}

function formatEmailHTML(data) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                بيانات جديدة من الاستبيان
            </h2>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #3498db;">المعلومات الشخصية</h3>
                ${formatField('الاسم', data.name)}
                ${formatField('البريد الإلكتروني', data.email)}
                ${formatField('رقم الهاتف', data.phone)}
                ${formatField('العمر', data.age)}
                ${formatField('البلد', getCountryName(data.country))}
                ${formatField('ملاحظات', data.comments)}
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                <h3 style="color: #3498db;">معلومات الجهاز</h3>
                ${formatField('وقت الإرسال', data.timestamp)}
                ${formatField('المتصفح', data.userAgent)}
                ${formatField('دقة الشاشة', data.screenResolution)}
                ${formatField('عنوان IP', data.ip)}
                ${formatField('الموقع التقريبي', data.location)}
            </div>
        </div>
    `;
}

function formatField(label, value) {
    if (!value || value === 'غير معروف') return '';
    return `
        <p style="margin: 8px 0;">
            <strong style="color: #2c3e50;">${label}:</strong> 
            <span style="color: #555;">${value}</span>
        </p>
    `;
}

function getCountryName(code) {
    const countries = {
        'SA': 'السعودية',
        'EG': 'مصر',
        'AE': 'الإمارات',
        'KW': 'الكويت',
        'QA': 'قطر',
        'other': 'دولة أخرى'
    };
    return countries[code] || code;
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
const dbName = "snapflix_users";

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = function (e) {
      let db = e.target.result;
      db.createObjectStore("users", { keyPath: "username" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("DB error");
  });
}

async function register(e) {
  e.preventDefault();
  const user = document.getElementById("reg-user").value;
  const pass = document.getElementById("reg-pass").value;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const db = await initDB();
  const tx = db.transaction("users", "readwrite");
  tx.objectStore("users").add({ username: user, password: pass, code });

  document.getElementById("reg-result").innerText = `تم تسجيلك. كود التوثيق: ${code} يرجى ارسال الرمز للمطورين لتفعيل الحساب`;
}

async function login(e) {
  e.preventDefault();
  const user = document.getElementById("login-user").value;
  const pass = document.getElementById("login-pass").value;

  const db = await initDB();
  const tx = db.transaction("users", "readonly");
  const req = tx.objectStore("users").get(user);
  req.onsuccess = async () => {
    const data = req.result;
    if (!data || data.password !== pass) {
      document.getElementById("login-result").innerText = "بيانات خاطئة.";
      return;
    }
    const res = await fetch("active_accounts.json");
    const activeCodes = await res.json();
    if (!activeCodes.includes(data.code)) {
      document.getElementById("login-result").innerText = `${code} - يرجى ارسال الرمز الى المطورين لتفعيل حسابك`;
      return;
    }
    localStorage.setItem("loggedUser", user);
    window.location.href = "dashboard.html";
  };
}

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = localStorage.getItem("loggedUser");
  if (document.getElementById("username") && user) {
    document.getElementById("username").innerText = user;
  }

  if (document.getElementById("video-list")) {
    const res = await fetch("about_videos.json");
    const videos = await res.json();
    const container = document.getElementById("video-list");
    videos.forEach(v => {
      const cast = v.cast.map(c => `${c.name} (${c.role})`).join(", ");
      container.innerHTML += `
        <div class="video-card">
          <h3>${v.title}</h3>
          <p>المنتج: ${v.producer}</p>
          <p>التاريخ: ${v.release_date}</p>
          <p>الطاقم: ${cast}</p>
          <video src="videos/${v.filename}" controls></video>
        </div>`;
    });
  }
});

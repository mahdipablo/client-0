document.addEventListener("DOMContentLoaded", async () => {
  const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
  const statusElement = document.querySelector("h3");
  const userInfoElement = document.createElement("div"); // یک div برای نمایش اطلاعات کاربر
  document.body.appendChild(userInfoElement); // اضافه کردن div به صفحه

  console.log("کلاینت: داده initDataUnsafe دریافت شد:", initDataUnsafe);

  if (!initDataUnsafe) {
    statusElement.innerText = "❌ داده‌ای از تلگرام دریافت نشد!";
    return;
  }

  statusElement.innerText = "⏳ در حال ارسال به سرور...";

  try {
    const response = await fetch("http://localhost:3000/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initDataUnsafe }),
    });

    const result = await response.json();
    statusElement.innerText = result.message;

    // اگر داده‌ها معتبر باشن، اطلاعات کاربر رو نمایش بده
    if (result.message === "✅ داده‌ها معتبر هستند.") {
      const user = initDataUnsafe.user || {}; // اطلاعات کاربر از initDataUnsafe
      userInfoElement.innerHTML = `
        <p>آیدی: ${user.id || "نامشخص"}</p>
        <p>نام: ${user.first_name || ""} ${user.last_name || ""}</p>
        <p>زبان: ${user.language_code || "نامشخص"}</p>
        ${user.photo_url ? `<img src="${user.photo_url}" alt="عکس کاربر" style="max-width: 100px;">` : "<p>عکس: ندارد</p>"}
      `;
    } else {
      userInfoElement.innerText = "اطلاعات کاربر نمایش داده نمی‌شود.";
    }
  } catch (error) {
    console.error("خطا در کلاینت:", error);
    statusElement.innerText = "❌ خطا در ارتباط با سرور!";
    userInfoElement.innerText = "";
  }
});
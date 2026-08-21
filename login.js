// =========================
// Supabase
// =========================

const SUPABASE_URL = "https://ggvlwcvmekxfnvyebthr.supabase.co";
const SUPABASE_KEY = "sb_publishable_K6GKq7H5pcofxuSWexmkew_veAQ-b2z";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================
// ログインフォーム
// =========================

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    loginMessage.textContent = "ログインしています...";


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


    if (error) {

        console.error(error);

        loginMessage.textContent =
            "ログインできませんでした。";

        return;
    }


    // ログイン成功

    loginMessage.textContent =
        "ログインしました！";


    // 投稿画面へ

    window.location.href = "admin.html";

});

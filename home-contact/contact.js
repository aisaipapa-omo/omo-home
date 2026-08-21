// =========================
// Supabase
// =========================

const SUPABASE_URL =
    "https://ggvlwcvmekxfnvyebthr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_K6GKq7H5pcofxuSWexmkew_veAQ-b2z";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================
// お問い合わせフォーム
// =========================

const contactForm =
    document.getElementById("contact-form");

const contactResult =
    document.getElementById("contact-result");


// =========================
// 送信
// =========================

contactForm.addEventListener(
    "submit",
    async function (event) {

        // ページを移動させない
        event.preventDefault();


        // 入力内容を取得

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const message =
            document.getElementById("message").value.trim();


        // =========================
        // 入力チェック
        // =========================

        if (!name || !email || !message) {

            contactResult.textContent =
                "すべて入力してください。";

            return;
        }


        // =========================
        // 送信中
        // =========================

        contactResult.textContent =
            "送信しています...";


        // =========================
        // Supabaseへ保存
        // =========================

        const {
            data,
            error
        } = await supabaseClient
            .from("contacts")
            .insert([
                {
                    name: name,
                    email: email,
                    message: message
                }
            ]);


        // =========================
        // エラー
        // =========================

        if (error) {
         console.error(
    "お問い合わせ送信エラー:",
    error.message
);

console.error(
    "エラー詳細:",
    error
);

contactResult.textContent =
    "送信できませんでした。";   
        

            return;
        }


        // =========================
        // 成功
        // =========================

        contactResult.textContent =
            "お問い合わせを送信しました。";


        // フォームを空にする

        contactForm.reset();

    }
);
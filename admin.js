// =========================
// Supabase 接続
// =========================

const SUPABASE_URL = "https://ggvlwcvmekxfnvyebthr.supabase.co";
const SUPABASE_KEY = "sb_publishable_K6GKq7H5pcofxuSWexmkew_veAQ-b2z";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================
// ログイン確認
// =========================

async function checkLogin() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();


    console.log("session:", session);
    console.log("session error:", error);


    if (error) {

        console.error(
            "ログイン確認エラー:",
            error
        );

        return null;
    }


    if (!session) {

        window.location.href = "login.html";

        return null;
    }


    console.log("ログイン確認OK");

    return session;
}


// =========================
// ページ開始
// =========================

async function init() {

    const session = await checkLogin();


    if (!session) {
        return;
    }


    console.log("投稿画面を使用できます");


    // =========================
    // フォーム取得
    // =========================

    const form =
        document.getElementById("post-form");

    const message =
        document.getElementById("message");

    const imageInput =
        document.getElementById("image");

    const imagePreview =
        document.getElementById("image-preview");


    // =========================
    // 写真プレビュー
    // =========================

    imageInput.addEventListener(
        "change",
        () => {

            const file =
                imageInput.files[0];


            if (!file) {

                imagePreview.innerHTML = "";

                return;
            }


            const imageURL =
                URL.createObjectURL(file);


            imagePreview.innerHTML = `
                <img
                    src="${imageURL}"
                    alt="写真プレビュー"
                >
            `;
        }
    );


    // =========================
    // 投稿
    // =========================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            console.log(
                "投稿ボタンが押されました"
            );


            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();


            const content =
                document
                    .getElementById("content")
                    .value
                    .trim();


            const imageFile =
                imageInput.files[0];


            if (!title || !content) {

                message.textContent =
                    "タイトルと本文を入力してください。";

                return;
            }


            try {

                message.textContent =
                    "投稿しています...";


                // =========================
                // 写真をStorageへ保存
                // =========================

                let imageURL = null;


                if (imageFile) {

                    const fileName =
                        `${Date.now()}-${imageFile.name}`;


                    const filePath =
                        `posts/${fileName}`;


                    console.log(
                        "写真をアップロードしています..."
                    );


                    const {
                        error: uploadError
                    } = await supabaseClient
                        .storage
                        .from("blog-images")
                        .upload(
                            filePath,
                            imageFile
                        );


                    if (uploadError) {

                        throw uploadError;
                    }


                    const {
                        data: publicURL
                    } =
                        supabaseClient
                            .storage
                            .from("blog-images")
                            .getPublicUrl(
                                filePath
                            );


                    imageURL =
                        publicURL.publicUrl;
                }


                // =========================
                // postsへ保存
                // =========================

                console.log(
                    "postsへ保存します"
                );


                const {
                    error: insertError
                } = await supabaseClient
                    .from("posts")
                    .insert({
                        title: title,
                        content: content,
                        image_url: imageURL
                    });


                console.log(
                    "INSERTエラー:",
                    insertError
                );


                if (insertError) {

                    throw insertError;
                }


                // =========================
                // 投稿成功
                // =========================

                message.textContent =
                    "ブログを投稿しました！🎈";


                form.reset();

                imagePreview.innerHTML = "";


            } catch (error) {

                console.error(
                    "投稿エラー:",
                    error
                );


                message.textContent =
                    "エラー：" +
                    error.message;

            }

        }
    );

}


// =========================
// 実行
// =========================

init();
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
// URLから記事IDを取得
// =========================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const postId =
    urlParams.get("id");


// =========================
// 記事を取得
// =========================

async function loadPost() {


    const postArea =
        document.getElementById("post");


    // =========================
    // IDがない
    // =========================

    if (!postId) {

        postArea.innerHTML = `

            <p>
                記事が見つかりません。
            </p>


            <a
                href="/omo-home/home-blog/blog.html"
                class="back-to-blog"
            >
                ← ブログ一覧へ戻る
            </a>

        `;

        return;
    }


    // =========================
    // Supabaseから記事を取得
    // =========================

    const {
        data: post,
        error
    } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

    // =========================
    // エラー
    // =========================

    if (error) {

        console.error(
            "記事取得エラー:",
            error
        );

        postArea.innerHTML = `
            <p>
                記事を読み込めませんでした。
            </p>

            <a href="/omo-home/home-blog/blog.html" class="back-to-blog">
                ← ブログ一覧へ戻る
            </a>
        `;

        return;
    }


    // =========================
    // 日付
    // =========================

    const date =
        new Date(
            post.created_at
        );


    const formattedDate =
        date.toLocaleDateString(
            "ja-JP",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    // =========================
    // 写真
    // =========================
    let imageHTML = "";
    if (post.image_url) {
        imageHTML = `
            <img
                src="${post.image_url}"
                alt="${post.title || ""}"
                class="post-image"
            >
        `;

    }

    // =========================
    // 記事を表示
    // =========================

    postArea.innerHTML = `
        <p class="post-date">
            ${formattedDate}
        </p>

        <h1 class="post-title no-tape">
            ${post.title || ""}
        </h1>

        ${imageHTML}

        <hr>

        <div class="post-content">
            ${post.content || ""}
        </div>

        <a href="/omo-home/home-blog/blog.html" class="back-to-blog">← ブログ一覧へ戻る</a>
    `;
}


// =========================
// 実行
// =========================

loadPost();
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
// ブログ記事を取得
// =========================

async function loadPosts() {

    const blogPosts =
        document.getElementById("blog-posts");


    // Supabaseから記事を取得

    const {
        data: posts,
        error
    } = await supabaseClient

        .from("posts")

        .select("*")

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    // =========================
    // エラー
    // =========================

    if (error) {

        console.error(
            "記事取得エラー:",
            error
        );


        blogPosts.innerHTML = `

            <p class="error">
                記事を読み込めませんでした。
            </p>

        `;


        return;
    }


    // =========================
    // 記事がない
    // =========================

    if (
        !posts ||
        posts.length === 0
    ) {

        blogPosts.innerHTML = `

            <p class="no-posts">
                まだ記事がありません。
            </p>

        `;


        return;
    }


    // =========================
    // 記事を表示
    // =========================

    blogPosts.innerHTML = "";


    posts.forEach(post => {


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

                <div class="blog-image-wrap">

                    <img
                        src="${post.image_url}"
                        alt="${post.title || ""}"
                        class="blog-image"
                    >

                </div>

            `;

        }


        // =========================
        // 記事カード
        // =========================

        const article =
            document.createElement("a");


        // ★ここが重要
        // クリックした記事のIDをURLに入れる

        article.href =
            `post.html?id=${post.id}`;


        article.className =
            "blog-card";


        // =========================
        // カードの中身
        // =========================

        article.innerHTML = `

            ${imageHTML}


            <div class="blog-card-content">


                <p class="blog-date">
                    ${formattedDate}
                </p>


                <h2>
                    ${post.title || ""}
                </h2>


                <p class="blog-text">
                    ${post.content || ""}
                </p>


            </div>

        `;


        // =========================
        // ブログ一覧に追加
        // =========================

        blogPosts.appendChild(
            article
        );

    });

}


// =========================
// 実行
// =========================

loadPosts();
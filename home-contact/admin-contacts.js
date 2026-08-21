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
// 管理者メールアドレス
// =========================

// ↓ここを自分の管理者メールアドレスに変更

const ADMIN_EMAIL =
    "yuichi.omo@gmail.com";


// =========================
// HTML
// =========================

const adminStatus =
    document.getElementById(
        "admin-status"
    );

const contactList =
    document.getElementById(
        "contact-list"
    );


// =========================
// 管理画面開始
// =========================

async function startAdminPage() {

    // ログインユーザーを取得

    const {
        data: {
            user
        },
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    // ログインしていない

    if (
        error ||
        !user
    ) {

        adminStatus.textContent =
            "ログインが必要です。";

        contactList.innerHTML = `

            <p class="not-admin">
                管理者としてログインしてください。
            </p>

        `;

        return;
    }


    // =========================
    // 管理者確認
    // =========================

    if (
        user.email !== ADMIN_EMAIL
    ) {

        adminStatus.textContent =
            "このページは管理者専用です。";

        contactList.innerHTML = `

            <p class="not-admin">
                閲覧権限がありません。
            </p>

        `;

        return;
    }


    // 管理者OK

    adminStatus.textContent =
        "管理者としてログインしています。";


    // お問い合わせを取得

    await loadContacts();

}


// =========================
// お問い合わせ取得
// =========================

async function loadContacts() {

    const {
        data: contacts,
        error
    } =
        await supabaseClient
            .from("contacts")
            .select(
                "id, name, email, message, created_at"
            )
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
            "お問い合わせ取得エラー:",
            error
        );

        contactList.innerHTML = `

            <p class="error">
                お問い合わせを読み込めませんでした。
            </p>

        `;

        return;
    }


    // =========================
    // 問い合わせがない
    // =========================

    if (
        !contacts ||
        contacts.length === 0
    ) {

        contactList.innerHTML = `

            <p class="no-contacts">
                まだお問い合わせはありません。
            </p>

        `;

        return;
    }


    // =========================
    // 表示
    // =========================

    contactList.innerHTML = "";


    contacts.forEach(
        contact => {

            const date =
                new Date(
                    contact.created_at
                );


            const formattedDate =
                date.toLocaleString(
                    "ja-JP"
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "contact-card";


            card.innerHTML = `

                <p class="contact-card-date">
                    ${formattedDate}
                </p>


                <h2 class="contact-card-name">
                    ${escapeHTML(
                        contact.name
                    )}
                </h2>


                <p class="contact-card-email">

                    <a
                        href="mailto:${escapeHTML(
                            contact.email
                        )}"
                    >
                        ${escapeHTML(
                            contact.email
                        )}
                    </a>

                </p>


                <p class="contact-card-message">
                    ${escapeHTML(
                        contact.message
                    )}
                </p>

            `;


            contactList.appendChild(
                card
            );

        }
    );

}


// =========================
// HTMLエスケープ
// =========================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================
// 実行
// =========================

startAdminPage();

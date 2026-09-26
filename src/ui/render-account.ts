import type { Account } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}

export function renderAccount(
  routeView: HTMLElement,
  account: Account | null,
  errorMessage: string | null = null,
): void {
  if (account) {
    const name = account.profile.displayName || [account.profile.firstName, account.profile.lastName].filter(Boolean).join(" ") || account.email;
    routeView.innerHTML = \`
      <main class="d5-page" id="main-content" aria-labelledby="account-title">
        <section class="d5-intro">
          <p class="eyebrow">NOOR SHOPPER ACCOUNT</p>
          <h1 id="account-title">حساب کاربری من</h1>
          <p>این حساب فقط متعلق به همین Demo Personal Shopper است و به حساب فعلی سایت نور متصل نیست.</p>
        </section>
        <section class="d5-choice-card">
          <p class="eyebrow">حساب فعال</p>
          <h2>\${escapeHtml(name)}</h2>
          <p>\${escapeHtml(account.email)}</p>
          <p>وضعیت ایمیل: تأییدنشده در Demo</p>
          <div class="d5-actions">
            <button class="button button-primary" type="button" data-account-logout>خروج از حساب</button>
            <a class="button button-secondary" href="/choices" data-app-link>انتخاب‌های من</a>
          </div>
        </section>
      </main>
    \`;
    return;
  }

  routeView.innerHTML = \`
    <main class="d5-page" id="main-content" aria-labelledby="account-title">
      <section class="d5-intro">
        <p class="eyebrow">NOOR SHOPPER ACCOUNT</p>
        <h1 id="account-title">حساب Personal Shopper</h1>
        <p>برای این Demo، حساب مستقل خود را بسازید یا با حساب همین Demo وارد شوید.</p>
      </section>
      \${errorMessage ? \`<p class="d5-form-error" role="alert">\${escapeHtml(errorMessage)}</p>\` : ""}
      <section class="d5-account-grid">
        <form class="d5-choice-card d5-form" data-account-register>
          <p class="eyebrow">ثبت‌نام</p>
          <h2>ساخت حساب جدید</h2>
          <label>نام<input name="firstName" type="text" autocomplete="given-name" required></label>
          <label>نام خانوادگی<input name="lastName" type="text" autocomplete="family-name" required></label>
          <label>ایمیل<input name="email" type="email" autocomplete="email" required></label>
          <label>رمز عبور<input name="password" type="password" autocomplete="new-password" minlength="6" required></label>
          <button class="button button-primary" type="submit">ساخت حساب</button>
        </form>
        <form class="d5-choice-card d5-form" data-account-login>
          <p class="eyebrow">ورود</p>
          <h2>ورود به حساب Demo</h2>
          <label>ایمیل<input name="email" type="email" autocomplete="email" required></label>
          <label>رمز عبور<input name="password" type="password" autocomplete="current-password" required></label>
          <button class="button button-primary" type="submit">ورود</button>
        </form>
      </section>
    </main>
  \`;
}


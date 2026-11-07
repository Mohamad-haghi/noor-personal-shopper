import type { Account } from "../domain";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function renderAccount(
  routeView: HTMLElement,
  account: Account | null,
  errorMessage: string | null = null,
): void {
  const error = errorMessage
    ? `<p class="lab-account-error" role="alert">${escapeHtml(errorMessage)}</p>`
    : "";

  if (account) {
    const name = account.profile.displayName ||
      [account.profile.firstName, account.profile.lastName].filter(Boolean).join(" ") ||
      account.email;
    const emailStatus = account.verificationStatus.emailVerified ? "تأیید شده" : "تأییدنشده در Demo";

    routeView.innerHTML = `
      <main class="lab-account-page" id="main-content" aria-labelledby="account-title">
        <header class="lab-account-head">
          <p class="eyebrow" dir="ltr">PERSONAL SHOPPER ACCOUNT</p>
          <h1 id="account-title">حساب کاربری من</h1>
          <p>اطلاعات حساب مستقل Personal Shopper خود را در این نسخهٔ نمایشی مشاهده کنید.</p>
        </header>
        ${error}
        <p class="lab-account-note" role="note">این حساب فقط متعلق به همین Demo Personal Shopper است و به حساب فعلی سایت نور متصل نیست.</p>
        <section class="lab-account-active" aria-labelledby="account-active-title">
          <div>
            <p class="eyebrow">حساب فعال</p>
            <h2 id="account-active-title">${escapeHtml(name)}</h2>
            <p class="lab-account-email">${escapeHtml(account.email)}</p>
            <dl class="lab-account-status">
              <div><dt>وضعیت ایمیل</dt><dd>${emailStatus}</dd></div>
              <div><dt>نوع حساب</dt><dd>Demo Personal Shopper</dd></div>
            </dl>
          </div>
          <div class="lab-account-actions">
            <button class="button button-primary" type="button" data-account-logout>خروج از حساب</button>
            <a class="button button-secondary" href="/choices" data-app-link>انتخاب‌های من</a>
          </div>
        </section>
      </main>
    `;
    return;
  }

  routeView.innerHTML = `
    <main class="lab-account-page" id="main-content" aria-labelledby="account-title">
      <header class="lab-account-head">
        <p class="eyebrow" dir="ltr">PERSONAL SHOPPER ACCOUNT</p>
        <h1 id="account-title">حساب Personal Shopper</h1>
        <p>برای نگهداری انتخاب‌های همین جلسهٔ نمایشی، حساب مستقل خود را بسازید یا وارد شوید.</p>
      </header>
      <p class="lab-account-note" role="note">این حساب فقط متعلق به همین Demo Personal Shopper است و به حساب فعلی سایت نور متصل نیست. ثبت‌نام در این صفحه حساب واقعی فروشگاهی ایجاد نمی‌کند.</p>
      ${error}
      <section class="lab-account-forms" aria-label="ثبت‌نام و ورود">
        <form class="lab-account-form" data-account-register>
          <p class="eyebrow">ثبت‌نام</p>
          <h2>ساخت حساب جدید</h2>
          <label for="account-first-name">نام</label>
          <input id="account-first-name" name="firstName" type="text" autocomplete="given-name" required>
          <label for="account-last-name">نام خانوادگی</label>
          <input id="account-last-name" name="lastName" type="text" autocomplete="family-name" required>
          <label for="account-register-email">ایمیل</label>
          <input id="account-register-email" name="email" type="email" autocomplete="email" required>
          <label for="account-register-password">رمز عبور</label>
          <input id="account-register-password" name="password" type="password" autocomplete="new-password" minlength="6" required>
          <button class="button button-primary" type="submit">ساخت حساب</button>
        </form>
        <form class="lab-account-form" data-account-login>
          <p class="eyebrow">ورود</p>
          <h2>ورود به حساب Demo</h2>
          <label for="account-login-email">ایمیل</label>
          <input id="account-login-email" name="email" type="email" autocomplete="email" required>
          <label for="account-login-password">رمز عبور</label>
          <input id="account-login-password" name="password" type="password" autocomplete="current-password" required>
          <button class="button button-primary" type="submit">ورود</button>
        </form>
      </section>
    </main>
  `;
}

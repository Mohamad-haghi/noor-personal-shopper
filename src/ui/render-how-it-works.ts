export function renderHowItWorks(routeView: HTMLElement): void {
  routeView.innerHTML = `<main class="lab-how-page" id="main-content" aria-labelledby="how-title">
    <header class="lab-page-head"><p class="eyebrow" dir="ltr">THE GUIDED STYLIST</p>
      <h1 id="how-title">NOOR چگونه کار می‌کند؟</h1>
      <p>یک مسیر روشن از شناخت ترجیحات تا بررسی پیشنهادها؛ با حفظ تفاوت میان انتخاب شما و شواهد ثبت‌شدهٔ محصول.</p>
    </header>
    <ol class="lab-how-steps">
      <li><span>01</span><div><h2>گفت‌وگو</h2><p>نوع عینک، موقعیت استفاده، فرم دلخواه و سایر ترجیحاتتان را در چند گام مشخص می‌کنید.</p></div></li>
      <li><span>02</span><div><h2>پروفایل انتخاب</h2><p>پاسخ‌ها در پروفایل ساختاریافتهٔ NOOR نگه‌داری می‌شوند تا بتوانید آن‌ها را مرور یا ویرایش کنید.</p></div></li>
      <li><span>03</span><div><h2>بررسی پیشنهادها</h2><p>پس از تأیید پروفایل، NOOR درخواست پیشنهاد را به مسیر تصمیم‌گیری COR می‌فرستد. نتیجه می‌تواند شامل تطابق، عدم تطابق، دادهٔ نامشخص یا نبود پیشنهاد معتبر باشد.</p></div></li>
    </ol>
    <p class="lab-profile-note" role="note">این نسخه نمایشی است؛ قیمت، موجودی، سفارش و پرداخت واقعی ارائه نمی‌کند.</p>
    <div class="lab-profile-actions"><a class="button button-primary" href="/shopper" data-app-link>شروع مشاوره انتخاب</a><a class="button button-secondary" href="/catalog" data-app-link>مشاهده مجموعه</a></div>
  </main>`;
}

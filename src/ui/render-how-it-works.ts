export function renderHowItWorks(routeView: HTMLElement): void {
  routeView.innerHTML = `<main class="lab-how-page" id="main-content" aria-labelledby="how-title">
    <header class="lab-page-head"><p class="eyebrow" dir="ltr">THE GUIDED STYLIST</p>
      <h1 id="how-title">NOOR چگونه کار می‌کند؟</h1>
      <p>یک مسیر روشن از شناخت ترجیحات تا بررسی پیشنهادها؛ تجربهٔ NOOR انتخاب شما را به تصمیم‌گیری مستند COR متصل می‌کند.</p>
    </header>
    <ol class="lab-how-steps">
      <li><span>01</span><div><h2>تجربهٔ NOOR</h2><p>در گفت‌وگوی هدایت‌شده، نوع عینک، موقعیت استفاده، فرم دلخواه و سایر ترجیحاتتان را مشخص می‌کنید.</p></div></li>
      <li><span>02</span><div><h2>موتور تصمیم COR</h2><p>پس از تأیید پروفایل، NOOR درخواست پیشنهاد را به موتور تصمیم COR می‌فرستد تا معیارها و شرط‌های ضروری را بررسی کند.</p></div></li>
      <li><span>03</span><div><h2>شواهد محصول</h2><p>هر ویژگی فقط بر پایهٔ دادهٔ ثبت‌شده ارزیابی می‌شود؛ اطلاعات ناموجود به‌جای حدس‌زدن، نامشخص باقی می‌ماند.</p></div></li>
      <li><span>04</span><div><h2>پیشنهاد شفاف</h2><p>NOOR نتیجه و دلیل تطابق، عدم تطابق یا نبود گزینهٔ معتبر را نمایش می‌دهد؛ امتیاز تطابق احتمال خرید یا تضمین اندازه نیست.</p></div></li>
    </ol>
    <p class="lab-profile-note" role="note">این نسخه برای نمایش و ارزیابی مسیر تصمیم‌گیری است؛ قیمت، موجودی، سفارش و پرداخت واقعی ارائه نمی‌کند.</p>
    <div class="lab-profile-actions"><a class="button button-primary" href="/shopper" data-app-link>شروع مشاوره انتخاب</a><a class="button button-secondary" href="/catalog" data-app-link>مشاهده مجموعه</a></div>
  </main>`;
}

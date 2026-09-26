import type { HeroContent, Product, Recommendation, SavedChoice, Comparison } from "../domain";
import type { RecommendationsService } from "../services/recommendations-service";
import type { CatalogService } from "../services/catalog-service";
import type { ChoicesService } from "../services/choices-service";
import type { CompareService } from "../services/compare-service";
import type { AccountService } from "../services/account-service";
import type { CartService } from "../services/cart-service";
import type { CommerceService } from "../services/commerce-service";
import type { CheckoutService } from "../services/checkout-service";
import type { PaymentService } from "../services/payment-service";
import type { FoundationStatus } from "../domain/foundation-status";
import type { ShopperFeature } from "../features/shopper/shopper-feature";
import { APP_ROUTES, type RouteMatch } from "../app/routing/routes";
import { renderFoundationStatus } from "./render-foundation";
import { renderHero } from "./render-hero";
import { renderRoutePlaceholder } from "./render-route-placeholder";
import { renderShopper } from "./render-shopper";
import { renderRecommendations } from "./render-recommendations";
import { renderChoices } from "./render-choices";
import { renderCompare } from "./render-compare";
import { renderAccount } from "./render-account";
import { renderCart } from "./render-cart";
import { renderCheckout } from "./render-checkout";

function isNavigationRouteCurrent(navigationPath: string, match: RouteMatch | null): boolean {
  if (!match) return false;
  return match.route.path === navigationPath ||
    (navigationPath !== "/" && match.route.path.startsWith(`${navigationPath}/`));
}

function renderNavigation(match: RouteMatch | null): string {
  return APP_ROUTES.filter((route) => route.navigationLabel !== null)
    .map((route) => {
      const current = isNavigationRouteCurrent(route.path, match);
      const currentAttribute = current ? ' aria-current="page"' : "";
      return `<li><a href="${route.path}" data-app-link${currentAttribute}>${route.navigationLabel}</a></li>`;
    })
    .join("");
}

function createSavedChoice(recommendation: Recommendation): SavedChoice {
  const now = new Date();
  return {
    identity: { id: `demo-choice-${recommendation.variantId.id}` },
    variantId: recommendation.variantId,
    status: "saved",
    notes: null,
    tags: ["recommendation"],
    createdAt: now,
    updatedAt: now,
  };
}

async function renderRecommendationRoute(
  routeView: HTMLElement,
  shopperFeature: ShopperFeature,
  recommendationsService: RecommendationsService,
  choicesService: ChoicesService,
): Promise<void> {
  routeView.innerHTML = `<main class="app-loading" id="main-content" aria-live="polite"><p>در حال ساخت پیشنهادهای شما…</p></main>`;
  const flow = shopperFeature.getFlowState();
  const recommendations = await recommendationsService.generateRecommendations(
    { id: "demo-shopper" },
    { occasion: flow.journey.useCase, season: null, requestSource: "shopper_request", journey: flow.journey },
  );
  const products: Product[] = [];
  for (const recommendation of recommendations) {
    const product = await recommendationsService.getProductForVariant(recommendation.variantId);
    if (product) products.push(product);
  }
  renderRecommendations(routeView, recommendations, products);

  routeView.querySelectorAll<HTMLButtonElement>("[data-save-choice]").forEach((button) => {
    button.addEventListener("click", async () => {
      const variantId = button.dataset.saveChoice;
      const recommendation = recommendations.find((item) => item.variantId.id === variantId);
      if (!recommendation) return;
      await choicesService.saveChoice(createSavedChoice(recommendation));
      button.textContent = "در انتخاب‌های من ذخیره شد";
      button.disabled = true;
    });
  });
}

async function renderChoicesRoute(
  routeView: HTMLElement,
  catalogService: CatalogService,
  choicesService: ChoicesService,
): Promise<void> {
  const choices = await choicesService.listChoices();
  const products = await catalogService.listProducts();
  renderChoices(routeView, choices, products);

  routeView.querySelectorAll<HTMLButtonElement>("[data-remove-choice]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.removeChoice;
      if (!id) return;
      await choicesService.removeChoice({ id });
      await renderChoicesRoute(routeView, catalogService, choicesService);
    });
  });
}


async function renderAccountRoute(routeView: HTMLElement, accountService: AccountService, errorMessage: string | null = null): Promise<void> {
  const account = await accountService.getCurrentAccount();
  renderAccount(routeView, account, errorMessage);

  const logoutButton = routeView.querySelector<HTMLButtonElement>("[data-account-logout]");
  logoutButton?.addEventListener("click", async () => {
    await accountService.logout();
    await renderAccountRoute(routeView, accountService);
  });

  const registerForm = routeView.querySelector<HTMLFormElement>("[data-account-register]");
  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(registerForm);
    try {
      const now = new Date();
      await accountService.register({
        identity: { id: `demo-account-${String(form.get("email")).trim().toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}` },
        email: String(form.get("email")),
        phone: null,
        profile: {
          firstName: String(form.get("firstName")),
          lastName: String(form.get("lastName")),
          displayName: null,
          avatarUrl: null,
          language: "fa",
          region: null,
        },
        verificationStatus: {
          emailVerified: false,
          phoneVerified: false,
          identityVerified: false,
          verifiedAt: null,
        },
        createdAt: now,
        updatedAt: now,
      }, String(form.get("password")));
      await renderAccountRoute(routeView, accountService);
    } catch (error) {
      await renderAccountRoute(routeView, accountService);
      const formError = routeView.querySelector<HTMLElement>(".d5-form-error");
      if (formError) formError.textContent = error instanceof Error ? error.message : "ثبت‌نام انجام نشد.";
    }
  });

  const loginForm = routeView.querySelector<HTMLFormElement>("[data-account-login]");
  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(loginForm);
    const account = await accountService.login(String(form.get("email")), String(form.get("password")));
    if (!account) {
      await renderAccountRoute(routeView, accountService, "ایمیل یا رمز عبور صحیح نیست.");
      return;
    }
    await renderAccountRoute(routeView, accountService);
  });
}

async function renderCompareRoute(
  routeView: HTMLElement,
  catalogService: CatalogService,
  choicesService: ChoicesService,
  compareService: CompareService,
): Promise<void> {
  const choices = await choicesService.listChoices();
  const items = choices.slice(0, 3).map((choice, index) => ({
    variantId: choice.variantId,
    addedAt: choice.createdAt,
    position: index + 1,
  }));

  const comparison: Comparison | null = items.length >= 2
    ? await compareService.saveComparison({
        identity: { id: "demo-current-comparison" },
        name: "مقایسهٔ انتخاب‌های من",
        items,
        criteria: ["style", "brand", "material", "color", "size", "availability"],
        createdAt: new Date(),
      })
    : null;

  const products = await catalogService.listProducts();
  renderCompare(routeView, comparison, products);
}

async function attachPurchaseActions(
  routeView: HTMLElement,
  commerceService: CommerceService,
  cartService: CartService,
): Promise<void> {
  routeView.querySelectorAll<HTMLButtonElement>("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", async () => {
      const variantId = button.dataset.addToCart;
      const productId = button.dataset.productId;
      if (!variantId || !productId) return;
      const offer = await commerceService.getOffer({ id: variantId, productId: { id: productId, source: "demo" } });
      if (!offer) return;
      await cartService.addCommerceOffer({ id: "demo-cart" }, offer);
      button.textContent = "به سبد خرید اضافه شد";
      button.disabled = true;
      const cartLink = document.createElement("a");
      cartLink.className = "button button-secondary";
      cartLink.href = "/cart";
      cartLink.dataset.appLink = "";
      cartLink.textContent = "مشاهدهٔ سبد خرید";
      button.parentElement?.appendChild(cartLink);
    });
  });
}



async function renderCheckoutRoute(
  routeView: HTMLElement,
  cartService: CartService,
  accountService: AccountService,
  checkoutService: CheckoutService,
  paymentService: PaymentService,
  errorMessage: string | null = null,
): Promise<void> {
  const cart = await cartService.getCart({ id: "demo-cart" });
  const account = await accountService.getCurrentAccount();
  renderCheckout(routeView, cart, account, null, errorMessage);

  const form = routeView.querySelector<HTMLFormElement>("[data-checkout-form]");
  if (!form) return;

  const deliveryFields = routeView.querySelector<HTMLElement>("[data-delivery-fields]");
  const pickupFields = routeView.querySelector<HTMLElement>("[data-pickup-fields]");
  const syncFulfillmentFields = () => {
    const method = form.querySelector<HTMLInputElement>('input[name="fulfillment"]:checked')?.value;
    const delivery = method === "delivery";
    if (deliveryFields) deliveryFields.hidden = !delivery;
    if (pickupFields) pickupFields.hidden = delivery;
    const address = form.elements.namedItem("addressLine1") as HTMLInputElement | null;
    const city = form.elements.namedItem("city") as HTMLInputElement | null;
    const postalCode = form.elements.namedItem("postalCode") as HTMLInputElement | null;
    const branchId = form.elements.namedItem("branchId") as HTMLInputElement | null;
    if (address) address.required = delivery;
    if (city) city.required = delivery;
    if (postalCode) postalCode.required = delivery;
    if (branchId) branchId.required = !delivery;
  };
  form.querySelectorAll<HTMLInputElement>('input[name="fulfillment"]').forEach((input) => {
    input.addEventListener("change", syncFulfillmentFields);
  });
  syncFulfillmentFields();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const currentAccount = await accountService.getCurrentAccount();
    if (!currentAccount) {
      await renderCheckoutRoute(routeView, cartService, accountService, checkoutService, paymentService, "ابتدا وارد حساب مستقل Personal Shopper شوید.");
      return;
    }

    const data = new FormData(form);
    const method = String(data.get("fulfillment"));
    const recipientName = String(data.get("recipientName")).trim();
    const phone = String(data.get("phone")).trim() || null;

    try {
      const request = method === "pickup"
        ? {
            cartId: { id: "demo-cart" },
            accountId: currentAccount.identity,
            shopper: { recipientName, phone },
            fulfillment: { method: "pickup" as const, branchId: String(data.get("branchId")).trim() },
          }
        : {
            cartId: { id: "demo-cart" },
            accountId: currentAccount.identity,
            shopper: { recipientName, phone },
            fulfillment: {
              method: "delivery" as const,
              address: {
                recipientName,
                addressLine1: String(data.get("addressLine1")).trim(),
                addressLine2: null,
                city: String(data.get("city")).trim(),
                state: String(data.get("state")).trim() || null,
                postalCode: String(data.get("postalCode")).trim(),
                country: "IR",
                phone,
              },
            },
          };

      const order = await checkoutService.createOrderFromCart(request);
      const pay = async (simulateFailure: boolean) => {
        renderPaymentState(routeView, order, null, async (retryFailure) => {
          const payment = await paymentService.createPayment({
            identity: { id: "demo-payment-" + order.identity.id },
            orderId: order.identity,
            amount: order.pricing.total,
            currency: order.pricing.currency,
            method: "digital_wallet",
            status: "pending",
            transaction: {
              providerTransactionId: "demo-pending",
              authorizationCode: null,
              capturedAt: null,
              failureReason: (simulateFailure || retryFailure) ? "demo_failure" : null,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          renderPaymentState(routeView, order, payment, async (nextFailure) => {
            const retried = await paymentService.createPayment({
              identity: { id: "demo-payment-" + order.identity.id },
              orderId: order.identity,
              amount: order.pricing.total,
              currency: order.pricing.currency,
              method: "digital_wallet",
              status: "pending",
              transaction: {
                providerTransactionId: "demo-pending",
                authorizationCode: null,
                capturedAt: null,
                failureReason: nextFailure ? "demo_failure" : null,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            renderPaymentState(routeView, order, retried, async (againFailure) => {
              await pay(againFailure);
            });
          });
        });
      };
      renderPaymentState(routeView, order, null, pay);
    } catch (error) {
      await renderCheckoutRoute(
        routeView,
        cartService,
        accountService,
        checkoutService,
        paymentService,
        error instanceof Error ? error.message : "ثبت سفارش انجام نشد.",
      );
    }
  });
}

async function renderCartRoute(routeView: HTMLElement, cartService: CartService, catalogService: CatalogService): Promise<void> {
  const cart = await cartService.getCart({ id: "demo-cart" });
  const products = await catalogService.listProducts();
  renderCart(routeView, cart, products);
  routeView.querySelectorAll<HTMLButtonElement>("[data-cart-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      const itemId = button.dataset.cartRemove;
      if (!itemId) return;
      await cartService.removeItem({ id: "demo-cart" }, itemId);
      await renderCartRoute(routeView, cartService, catalogService);
    });
  });
}

export async function renderApplicationShell(
  root: HTMLElement,
  match: RouteMatch | null,
  status: FoundationStatus,
  hero: HeroContent | null,
  heroDestination: string | null,
  shopperFeature: ShopperFeature,
  recommendationsService: RecommendationsService,
  catalogService: CatalogService,
  choicesService: ChoicesService,
  compareService: CompareService,
  accountService: AccountService,
  cartService: CartService,
  commerceService: CommerceService,
  checkoutService: CheckoutService,
  paymentService: PaymentService,
): Promise<void> {
  const navigation = renderNavigation(match);
  root.innerHTML = `
    <a class="skip-link" href="#main-content">پرش به محتوای اصلی</a>
    <div class="app-shell">
      <header class="app-header">
        <a class="app-brand" href="/" data-app-link aria-label="نور، صفحهٔ اصلی">
          <span class="app-brand-mark" aria-hidden="true">ن</span>
          <span class="app-brand-name">نور</span>
        </a>
        <div class="app-header-meta">
          <span class="app-mode">دموی مستقل</span>
          <details class="mobile-nav">
            <summary>منو</summary>
            <nav aria-label="ناوبری موبایل"><ul>${navigation}</ul></nav>
          </details>
        </div>
      </header>
      <nav class="primary-nav" aria-label="ناوبری اصلی"><ul>${navigation}</ul></nav>
      <div id="route-view" class="route-view" aria-live="polite"></div>
      <footer class="app-footer">
        <span>NOOR Personal Shopper</span>
        <span>دموی مستقل · بدون اتصال به سامانه‌های واقعی نور</span>
      </footer>
    </div>
  `;

  const routeView = root.querySelector<HTMLElement>("#route-view");
  if (!routeView) throw new Error("Application route view was not created.");

  if (match?.route.path === "/") {
    if (hero) renderHero(routeView, hero, heroDestination);
    else renderFoundationStatus(routeView, status);
  } else if (match?.route.path === "/shopper") {
    renderShopper(routeView, shopperFeature);
  } else if (match?.route.path === "/recommendations") {
    await renderRecommendationRoute(routeView, shopperFeature, recommendationsService, choicesService);
  } else if (match?.route.path === "/choices") {
    await renderChoicesRoute(routeView, catalogService, choicesService);
  } else if (match?.route.path === "/compare") {
    await renderCompareRoute(routeView, catalogService, choicesService, compareService);
  } else if (match?.route.path === "/account") {
    await renderAccountRoute(routeView, accountService);
  } else if (match?.route.path === "/cart") {
    await renderCartRoute(routeView, cartService, catalogService);
  } else if (match?.route.path === "/checkout") {
    await renderCheckoutRoute(routeView, cartService, accountService, checkoutService, paymentService);
  } else {
    renderRoutePlaceholder(routeView, match);
  }

  if (match?.route.path !== "/cart") {
    await attachPurchaseActions(routeView, commerceService, cartService);
  }
}

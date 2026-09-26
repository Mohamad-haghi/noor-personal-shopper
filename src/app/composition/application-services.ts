import type {
  CatalogProvider,
  ShopperProvider,
  RecommendationsProvider,
  ChoicesProvider,
  CompareProvider,
  AccountProvider,
  CartProvider,
  OrderProvider,
  PaymentProvider,
  ConfirmationProvider,
  BranchProvider,
  VisitProvider,
  HeroProvider,
  SearchProvider,
  FavoritesProvider,
  IdentityProvider,
  ShopperProfileProvider,
  CheckoutProvider,
  ReservationProvider,
} from "../../providers";
import {
  CatalogService,
  ShopperService,
  RecommendationsService,
  ChoicesService,
  CompareService,
  AccountService,
  CartService,
  OrderService,
  PaymentService,
  ConfirmationService,
  BranchService,
  VisitService,
  HeroService,
  SearchService,
  FavoritesService,
  IdentityService,
  ShopperProfileService,
  CheckoutService,
  ReservationService,
} from "../../services";

export interface ApplicationServices {
  readonly catalog: CatalogService;
  readonly shopper: ShopperService;
  readonly recommendations: RecommendationsService;
  readonly choices: ChoicesService;
  readonly compare: CompareService;
  readonly account: AccountService;
  readonly cart: CartService;
  readonly order: OrderService;
  readonly payment: PaymentService;
  readonly confirmation: ConfirmationService;
  readonly branch: BranchService;
  readonly visit: VisitService;
  readonly hero: HeroService;
  readonly search: SearchService;
  readonly favorites: FavoritesService;
  readonly identity: IdentityService;
  readonly shopperProfile: ShopperProfileService;
  readonly checkout: CheckoutService;
  readonly reservation: ReservationService;
}

export interface ApplicationProviders {
  readonly catalog: CatalogProvider;
  readonly shopper: ShopperProvider;
  readonly recommendations: RecommendationsProvider;
  readonly choices: ChoicesProvider;
  readonly compare: CompareProvider;
  readonly account: AccountProvider;
  readonly cart: CartProvider;
  readonly order: OrderProvider;
  readonly payment: PaymentProvider;
  readonly confirmation: ConfirmationProvider;
  readonly branch: BranchProvider;
  readonly visit: VisitProvider;
  readonly hero: HeroProvider;
  readonly search: SearchProvider;
  readonly favorites: FavoritesProvider;
  readonly identity: IdentityProvider;
  readonly shopperProfile: ShopperProfileProvider;
  readonly checkout: CheckoutProvider;
  readonly reservation: ReservationProvider;
}

export function composeApplicationServices(providers: ApplicationProviders): ApplicationServices {
  const catalog = new CatalogService(providers.catalog);

  return {
    catalog,
    shopper: new ShopperService(providers.shopper),
    recommendations: new RecommendationsService(catalog),
    choices: new ChoicesService(providers.choices),
    compare: new CompareService(providers.compare),
    account: new AccountService(providers.account),
    cart: new CartService(providers.cart),
    order: new OrderService(providers.order),
    payment: new PaymentService(providers.payment),
    confirmation: new ConfirmationService(providers.confirmation),
    branch: new BranchService(providers.branch),
    visit: new VisitService(providers.visit),
    hero: new HeroService(providers.hero),
    search: new SearchService(providers.search),
    favorites: new FavoritesService(providers.favorites),
    identity: new IdentityService(providers.identity),
    shopperProfile: new ShopperProfileService(providers.shopperProfile),
    checkout: new CheckoutService(providers.checkout),
    reservation: new ReservationService(providers.reservation),
  };
}

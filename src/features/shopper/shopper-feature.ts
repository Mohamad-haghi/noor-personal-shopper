import type {
  SelectionProfile,
  SelectionProfileCriteria,
  SelectionProfileId,
} from "../../domain";
import type { SelectionProfileService } from "../../services/selection-profile-service";
import type { ShopperProfileId } from "../../domain";
import type {
  ShopperFlowState,
  ShopperJourneyProfile,
} from "../../state/interfaces/shopper-flow-state";

export interface ShopperState {
  readonly profileId: ShopperProfileId | null;
  readonly isLoading: boolean;
}

export type ShopperStepId =
  | "intro"
  | "product-type"
  | "use-case"
  | "style"
  | "face-shape"
  | "frame-material"
  | "frame-color"
  | "gender"
  | "complete";

export interface ShopperStep {
  readonly id: ShopperStepId;
  readonly title: string;
  readonly description: string;
  readonly options?: readonly string[];
  readonly field?: keyof ShopperJourneyProfile;
}

const INITIAL_JOURNEY: ShopperJourneyProfile = {
  productType: null,
  useCase: null,
  style: null,
  faceShape: null,
  frameMaterial: null,
  frameColor: null,
  gender: null,
  mandatoryCriteria: [],
};

const DEFAULT_SELECTION_PROFILE_ID: SelectionProfileId = {
  id: "demo-selection-profile",
};

const STEPS: readonly ShopperStep[] = [
  { id: "intro", title: "از اینجا شروع کنیم", description: "چند انتخاب کوتاه به ما کمک می‌کند مسیر مناسب شما را بسازیم." },
  { id: "product-type", title: "برای چه نوع عینکی جست‌وجو می‌کنید؟", description: "نوع اصلی عینکی را که در ذهن دارید انتخاب کنید.", field: "productType", options: ["عینک طبی", "عینک آفتابی", "هر دو"] },
  { id: "use-case", title: "بیشتر برای چه موقعیتی؟", description: "کاربردی که بیشتر برایتان اهمیت دارد را مشخص کنید.", field: "useCase", options: ["استفاده روزمره", "کار و جلسات", "رانندگی و فضای باز", "مناسبت و استایل"] },
  { id: "style", title: "چه فرم فریمی را ترجیح می‌دهید؟", description: "شکل فریم را مستقیماً انتخاب کنید تا سیستم همان ترجیح را به COR بفرستد؛ این گزینه ادعایی درباره سازگاری قطعی با فرم صورت ندارد.", field: "style", options: ["خلبانی", "مستطیلی", "گرد", "مربعی", "پروانه‌ای", "ویفِرر"] },
  { id: "face-shape", title: "فرم صورتتان را چطور توصیف می‌کنید؟", description: "اگر مطمئن نیستید، گزینه نزدیک‌تر را انتخاب کنید؛ بعداً قابل تغییر است.", field: "faceShape", options: ["گرد", "بیضی", "مستطیلی / کشیده", "قلبی", "مثلثی", "مطمئن نیستم"] },
  { id: "frame-material", title: "جنس فریم دلخواهتان چیست؟", description: "این ترجیح به موتور COR ارسال می‌شود؛ اگر برایتان مهم نیست، «فرقی ندارد» را انتخاب کنید.", field: "frameMaterial", options: ["فلزی", "نایلونی", "استات", "تیتانیوم", "فرقی ندارد"] },
  { id: "frame-color", title: "چه رنگی را ترجیح می‌دهید؟", description: "رنگ به‌عنوان ترجیح امتیازدهی می‌شود؛ «فرقی ندارد» یعنی رنگ در رتبه‌بندی دخالت نکند.", field: "frameColor", options: ["طلایی", "هاوانا قهوه‌ای", "مشکی", "نقره‌ای", "فرقی ندارد"] },
  { id: "gender", title: "کدام گروه محصول را ترجیح می‌دهید؟", description: "این گزینه فقط با برچسب گروه محصول در کاتالوگ آزمایشی تطبیق داده می‌شود؛ «فرقی ندارد» آن را از امتیازدهی خارج می‌کند.", field: "gender", options: ["زنانه", "مردانه", "یونیسکس", "فرقی ندارد"] },
  { id: "complete", title: "پروفایل انتخاب شما آماده است", description: "انتخاب‌های شما در یک Selection Profile ساختاریافته ذخیره شد و برای مرحله پیشنهادها آماده است." },
];

function journeyToCriteria(journey: ShopperJourneyProfile): SelectionProfileCriteria {
  return {
    productType: journey.productType,
    useCase: journey.useCase,
    style: journey.style,
    faceShape: journey.faceShape,
    ...(journey.frameMaterial ? { frameMaterial: journey.frameMaterial } : {}),
    ...(journey.frameColor ? { frameColor: journey.frameColor } : {}),
    ...(journey.gender ? { gender: journey.gender } : {}),
    ...((journey.mandatoryCriteria?.length ?? 0) > 0 ? { mandatoryCriteria: journey.mandatoryCriteria } : {}),
  };
}

function profileToJourney(profile: SelectionProfile): ShopperJourneyProfile {
  return {
    productType: profile.criteria.productType,
    useCase: profile.criteria.useCase,
    style: profile.criteria.style,
    faceShape: profile.criteria.faceShape,
    frameMaterial: profile.criteria.frameMaterial ?? null,
    frameColor: profile.criteria.frameColor ?? null,
    gender: profile.criteria.gender ?? null,
    mandatoryCriteria: profile.criteria.mandatoryCriteria ?? [],
  };
}

function createEmptyProfile(id: SelectionProfileId): SelectionProfile {
  const now = new Date();
  return {
    identity: id,
    accountId: null,
    name: "NOOR Personal Shopper Selection",
    description: "Structured shopper selection profile for the Personal Shopper journey.",
    criteria: { ...INITIAL_JOURNEY },
    items: [],
    createdAt: now,
    updatedAt: now,
  };
}

export class ShopperFeature {
  private journey: ShopperJourneyProfile;
  private stepIndex: number;
  private completed: boolean;
  private selectionProfile: SelectionProfile;

  constructor(
    private readonly selectionProfileService: SelectionProfileService,
    initialProfile: SelectionProfile | null = null,
  ) {
    this.selectionProfile = initialProfile ?? createEmptyProfile(DEFAULT_SELECTION_PROFILE_ID);
    this.journey = initialProfile ? profileToJourney(initialProfile) : { ...INITIAL_JOURNEY };
    this.stepIndex = 0;
    this.completed = false;
  }

  private async persistProfile(): Promise<void> {
    this.selectionProfile = await this.selectionProfileService.saveProfile(this.selectionProfile);
  }

  getState(): ShopperState {
    return { profileId: null, isLoading: false };
  }

  getFlowState(): ShopperFlowState {
    return {
      profile: null,
      selections: this.selectionProfile,
      journey: { ...this.journey },
      currentStep: STEPS[this.stepIndex]?.id ?? null,
      completed: this.completed,
    };
  }

  getSelectionProfile(): SelectionProfile {
    return this.selectionProfile;
  }

  getCurrentStep(): ShopperStep { return this.getSteps()[this.stepIndex]; }
  getSteps(): readonly ShopperStep[] {
    const productType = this.journey.productType;
    const styleOptions = productType === "عینک آفتابی"
      ? ["خلبانی", "مستطیلی", "مربعی", "پروانه‌ای"]
      : productType === "عینک طبی"
        ? ["گرد", "مستطیلی", "مربعی", "ویفِرر"]
        : ["خلبانی", "مستطیلی", "گرد", "مربعی", "پروانه‌ای", "ویفِرر"];
    // Titanium is intentionally selectable for sunglasses even though the current
    // 8-item demo sunglasses catalog has no verified titanium frame. This lets the
    // shopper express a true hard requirement and COR safely return no match.
    const materialOptions = productType === "عینک آفتابی"
      ? ["فلزی", "نایلونی", "استات", "تیتانیوم", "فرقی ندارد"]
      : ["فلزی", "نایلونی", "استات", "تیتانیوم", "فرقی ندارد"];
    const colorOptions = productType === "عینک طبی"
      ? ["طلایی", "مشکی", "فرقی ندارد"]
      : ["طلایی", "هاوانا قهوه‌ای", "مشکی", "سفید", "فرقی ندارد"];
    return STEPS.map((step) => {
      if (step.id === "style") return { ...step, options: styleOptions };
      if (step.id === "frame-material") return {
        ...step,
        options: materialOptions,
        description: productType === "عینک آفتابی"
          ? "تیتانیوم هم قابل انتخاب است؛ اما در کاتالوگ فعلی Demo عینک آفتابی محصولی با فریم تیتانیومی ثبت نشده. اگر این شرط را اجباری کنید، انتظار می‌رود COR هیچ محصولی پیشنهاد نکند."
          : step.description,
      };
      if (step.id === "frame-color") return { ...step, options: colorOptions };
      return step;
    });
  }

  async setAnswer(field: keyof ShopperJourneyProfile, value: string): Promise<void> {
    this.journey = { ...this.journey, [field]: value };
    this.selectionProfile = {
      ...this.selectionProfile,
      criteria: journeyToCriteria(this.journey),
      updatedAt: new Date(),
    };
    await this.persistProfile();
  }

  async setCriterionMandatory(criterion: "frameShape" | "frameMaterial" | "frameColor", mandatory: boolean): Promise<void> {
    const current = new Set(this.journey.mandatoryCriteria ?? []);
    if (mandatory) current.add(criterion);
    else current.delete(criterion);
    this.journey = { ...this.journey, mandatoryCriteria: [...current] };
    this.selectionProfile = {
      ...this.selectionProfile,
      criteria: journeyToCriteria(this.journey),
      updatedAt: new Date(),
    };
    await this.persistProfile();
  }

  canContinue(): boolean {
    const step = this.getCurrentStep();
    return step.field ? Boolean(this.journey[step.field]) : true;
  }

  next(): void {
    if (!this.canContinue()) return;
    if (this.stepIndex < STEPS.length - 1) {
      this.stepIndex += 1;
      this.completed = STEPS[this.stepIndex].id === "complete";
    }
  }

  back(): void {
    if (this.stepIndex > 0) {
      this.stepIndex -= 1;
      this.completed = false;
    }
  }

  async restart(): Promise<void> {
    this.journey = { ...INITIAL_JOURNEY };
    this.stepIndex = 0;
    this.completed = false;
    this.selectionProfile = {
      ...this.selectionProfile,
      criteria: { ...INITIAL_JOURNEY },
      items: [],
      updatedAt: new Date(),
    };
    await this.persistProfile();
  }
}

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
};

const STORAGE_KEY = "noor-demo-shopper-journey";

const STEPS: readonly ShopperStep[] = [
  { id: "intro", title: "از اینجا شروع کنیم", description: "چند انتخاب کوتاه به ما کمک می‌کند مسیر مناسب شما را بسازیم." },
  { id: "product-type", title: "برای چه نوع عینکی جست‌وجو می‌کنید؟", description: "نوع اصلی عینکی را که در ذهن دارید انتخاب کنید.", field: "productType", options: ["عینک طبی", "عینک آفتابی", "هر دو"] },
  { id: "use-case", title: "بیشتر برای چه موقعیتی؟", description: "کاربردی که بیشتر برایتان اهمیت دارد را مشخص کنید.", field: "useCase", options: ["استفاده روزمره", "کار و جلسات", "رانندگی و فضای باز", "مناسبت و استایل"] },
  { id: "style", title: "چه استایلی به شما نزدیک‌تر است؟", description: "حس کلی فریم مورد علاقه‌تان را انتخاب کنید.", field: "style", options: ["مینیمال و ظریف", "کلاسیک و ماندگار", "مدرن و شاخص", "جسور و متفاوت"] },
  { id: "face-shape", title: "فرم صورتتان را چطور توصیف می‌کنید؟", description: "اگر مطمئن نیستید، گزینه نزدیک‌تر را انتخاب کنید؛ بعداً قابل تغییر است.", field: "faceShape", options: ["گرد", "بیضی", "مربع", "کشیده", "قلبی", "مطمئن نیستم"] },
  { id: "complete", title: "پروفایل انتخاب شما آماده است", description: "انتخاب‌های شما برای مرحله پیشنهادها آماده شد." },
];

interface PersistedShopperJourney {
  journey: ShopperJourneyProfile;
  stepIndex: number;
  completed: boolean;
}

function readPersistedState(): PersistedShopperJourney | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedShopperJourney>;
    if (!parsed.journey || typeof parsed.journey !== "object") return null;
    const journey = parsed.journey as ShopperJourneyProfile;
    const validStepIndex = typeof parsed.stepIndex === "number"
      && Number.isInteger(parsed.stepIndex)
      && parsed.stepIndex >= 0
      && parsed.stepIndex < STEPS.length;
    return {
      journey: {
        productType: typeof journey.productType === "string" ? journey.productType : null,
        useCase: typeof journey.useCase === "string" ? journey.useCase : null,
        style: typeof journey.style === "string" ? journey.style : null,
        faceShape: typeof journey.faceShape === "string" ? journey.faceShape : null,
      },
      stepIndex: validStepIndex ? parsed.stepIndex! : 0,
      completed: parsed.completed === true && validStepIndex ? parsed.stepIndex === STEPS.length - 1 : false,
    };
  } catch {
    return null;
  }
}

export class ShopperFeature {
  private journey: ShopperJourneyProfile;
  private stepIndex: number;
  private completed: boolean;

  constructor() {
    const persisted = readPersistedState();
    this.journey = persisted?.journey ?? { ...INITIAL_JOURNEY };
    this.stepIndex = persisted?.stepIndex ?? 0;
    this.completed = persisted?.completed ?? false;
  }

  private persist(): void {
    try {
      const state: PersistedShopperJourney = {
        journey: { ...this.journey },
        stepIndex: this.stepIndex,
        completed: this.completed,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Persistence is best-effort; the in-memory journey remains authoritative for this session.
    }
  }

  getState(): ShopperState {
    return { profileId: null, isLoading: false };
  }

  getFlowState(): ShopperFlowState {
    return {
      profile: null,
      selections: null,
      journey: { ...this.journey },
      currentStep: STEPS[this.stepIndex]?.id ?? null,
      completed: this.completed,
    };
  }

  getCurrentStep(): ShopperStep { return STEPS[this.stepIndex]; }
  getSteps(): readonly ShopperStep[] { return STEPS; }

  setAnswer(field: keyof ShopperJourneyProfile, value: string): void {
    this.journey = { ...this.journey, [field]: value };
    this.persist();
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
      this.persist();
    }
  }

  back(): void {
    if (this.stepIndex > 0) {
      this.stepIndex -= 1;
      this.completed = false;
      this.persist();
    }
  }

  restart(): void {
    this.journey = { ...INITIAL_JOURNEY };
    this.stepIndex = 0;
    this.completed = false;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures; the in-memory state is still reset.
    }
  }
}

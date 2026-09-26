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

const STEPS: readonly ShopperStep[] = [
  { id: "intro", title: "از اینجا شروع کنیم", description: "چند انتخاب کوتاه به ما کمک می‌کند مسیر مناسب شما را بسازیم." },
  { id: "product-type", title: "برای چه نوع عینکی جست‌وجو می‌کنید؟", description: "نوع اصلی عینکی را که در ذهن دارید انتخاب کنید.", field: "productType", options: ["عینک طبی", "عینک آفتابی", "هر دو"] },
  { id: "use-case", title: "بیشتر برای چه موقعیتی؟", description: "کاربردی که بیشتر برایتان اهمیت دارد را مشخص کنید.", field: "useCase", options: ["استفاده روزمره", "کار و جلسات", "رانندگی و فضای باز", "مناسبت و استایل"] },
  { id: "style", title: "چه استایلی به شما نزدیک‌تر است؟", description: "حس کلی فریم مورد علاقه‌تان را انتخاب کنید.", field: "style", options: ["مینیمال و ظریف", "کلاسیک و ماندگار", "مدرن و شاخص", "جسور و متفاوت"] },
  { id: "face-shape", title: "فرم صورتتان را چطور توصیف می‌کنید؟", description: "اگر مطمئن نیستید، گزینه نزدیک‌تر را انتخاب کنید؛ بعداً قابل تغییر است.", field: "faceShape", options: ["گرد", "بیضی", "مربع", "کشیده", "قلبی", "مطمئن نیستم"] },
  { id: "complete", title: "پروفایل انتخاب شما آماده است", description: "انتخاب‌های شما برای مرحله پیشنهادها آماده شد." },
];

export class ShopperFeature {
  private journey: ShopperJourneyProfile = { ...INITIAL_JOURNEY };
  private stepIndex = 0;
  private completed = false;

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

  restart(): void {
    this.journey = { ...INITIAL_JOURNEY };
    this.stepIndex = 0;
    this.completed = false;
  }
}

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

const DEFAULT_SELECTION_PROFILE_ID: SelectionProfileId = {
  id: "demo-selection-profile",
};

const STEPS: readonly ShopperStep[] = [
  { id: "intro", title: "از اینجا شروع کنیم", description: "چند انتخاب کوتاه به ما کمک می‌کند مسیر مناسب شما را بسازیم." },
  { id: "product-type", title: "برای چه نوع عینکی جست‌وجو می‌کنید؟", description: "نوع اصلی عینکی را که در ذهن دارید انتخاب کنید.", field: "productType", options: ["عینک طبی", "عینک آفتابی", "هر دو"] },
  { id: "use-case", title: "بیشتر برای چه موقعیتی؟", description: "کاربردی که بیشتر برایتان اهمیت دارد را مشخص کنید.", field: "useCase", options: ["استفاده روزمره", "کار و جلسات", "رانندگی و فضای باز", "مناسبت و استایل"] },
  { id: "style", title: "چه استایلی به شما نزدیک‌تر است؟", description: "حس کلی فریم مورد علاقه‌تان را انتخاب کنید.", field: "style", options: ["مینیمال و ظریف", "کلاسیک و ماندگار", "مدرن و شاخص", "جسور و متفاوت"] },
  { id: "face-shape", title: "فرم صورتتان را چطور توصیف می‌کنید؟", description: "اگر مطمئن نیستید، گزینه نزدیک‌تر را انتخاب کنید؛ بعداً قابل تغییر است.", field: "faceShape", options: ["گرد", "بیضی", "مربع", "کشیده", "قلبی", "مطمئن نیستم"] },
  { id: "complete", title: "پروفایل انتخاب شما آماده است", description: "انتخاب‌های شما در یک Selection Profile ساختاریافته ذخیره شد و برای مرحله پیشنهادها آماده است." },
];

function journeyToCriteria(journey: ShopperJourneyProfile): SelectionProfileCriteria {
  return {
    productType: journey.productType,
    useCase: journey.useCase,
    style: journey.style,
    faceShape: journey.faceShape,
  };
}

function profileToJourney(profile: SelectionProfile): ShopperJourneyProfile {
  return {
    productType: profile.criteria.productType,
    useCase: profile.criteria.useCase,
    style: profile.criteria.style,
    faceShape: profile.criteria.faceShape,
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

  getCurrentStep(): ShopperStep { return STEPS[this.stepIndex]; }
  getSteps(): readonly ShopperStep[] { return STEPS; }

  async setAnswer(field: keyof ShopperJourneyProfile, value: string): Promise<void> {
    this.journey = { ...this.journey, [field]: value };
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

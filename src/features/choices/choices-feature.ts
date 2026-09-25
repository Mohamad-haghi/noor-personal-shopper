import type { SavedChoiceId } from "../../domain";

export interface ChoicesState {
  readonly savedChoiceIds: readonly SavedChoiceId[];
  readonly isLoading: boolean;
}

export class ChoicesFeature {
  getState(): ChoicesState {
    return {
      savedChoiceIds: [],
      isLoading: false,
    };
  }
}

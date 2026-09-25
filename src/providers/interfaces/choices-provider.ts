import type { SavedChoice, SavedChoiceId } from "../../domain";

export interface ChoicesProvider {
  listChoices(): Promise<readonly SavedChoice[]>;
  getChoice(id: SavedChoiceId): Promise<SavedChoice | null>;
  saveChoice(choice: SavedChoice): Promise<SavedChoice>;
  removeChoice(id: SavedChoiceId): Promise<void>;
}

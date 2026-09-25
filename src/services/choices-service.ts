import type { ChoicesProvider } from "../providers/interfaces/choices-provider";
import type { SavedChoice, SavedChoiceId } from "../../domain";

export class ChoicesService {
  constructor(private readonly provider: ChoicesProvider) {}

  listChoices(): Promise<readonly SavedChoice[]> {
    return this.provider.listChoices();
  }

  getChoice(id: SavedChoiceId): Promise<SavedChoice | null> {
    return this.provider.getChoice(id);
  }

  saveChoice(choice: SavedChoice): Promise<SavedChoice> {
    return this.provider.saveChoice(choice);
  }

  removeChoice(id: SavedChoiceId): Promise<void> {
    return this.provider.removeChoice(id);
  }
}

import type { SavedChoice, SavedChoiceId } from "../../domain";

export class DemoChoicesProvider implements ChoicesProvider {
  async listChoices(): Promise<readonly SavedChoice[]> { return []; }

  async getChoice(id: SavedChoiceId): Promise<SavedChoice | null> { return null; }

  async saveChoice(choice: SavedChoice): Promise<SavedChoice> { return choice; }

  async removeChoice(id: SavedChoiceId): Promise<void> {}
}

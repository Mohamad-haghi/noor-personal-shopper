import type { ChoicesProvider } from "../interfaces/choices-provider";
import type { SavedChoice, SavedChoiceId } from "../../domain";

export class DemoChoicesProvider implements ChoicesProvider {
  async listChoices(): Promise<readonly SavedChoice[]> { return []; }

  async getChoice(_id: SavedChoiceId): Promise<SavedChoice | null> { return null; }

  async saveChoice(choice: SavedChoice): Promise<SavedChoice> { return choice; }

  async removeChoice(_id: SavedChoiceId): Promise<void> {}
}

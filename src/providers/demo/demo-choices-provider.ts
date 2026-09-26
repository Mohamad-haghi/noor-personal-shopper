import type { ChoicesProvider } from "../interfaces/choices-provider";
import type { SavedChoice, SavedChoiceId } from "../../domain";

export class DemoChoicesProvider implements ChoicesProvider {
  private readonly choices = new Map<string, SavedChoice>();

  async listChoices(): Promise<readonly SavedChoice[]> {
    return [...this.choices.values()].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }

  async getChoice(id: SavedChoiceId): Promise<SavedChoice | null> {
    return this.choices.get(id.id) ?? null;
  }

  async saveChoice(choice: SavedChoice): Promise<SavedChoice> {
    this.choices.set(choice.identity.id, choice);
    return choice;
  }

  async removeChoice(id: SavedChoiceId): Promise<void> {
    this.choices.delete(id.id);
  }
}

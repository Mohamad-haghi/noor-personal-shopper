import type { FavoritesProvider } from "../interfaces/favorites-provider";
import type { SavedChoice, SavedChoiceId } from "../../domain";

export class DemoFavoritesProvider implements FavoritesProvider {
  async listFavorites(): Promise<readonly SavedChoice[]> { return []; }
  async getFavorite(_id: SavedChoiceId): Promise<SavedChoice | null> { return null; }
  async saveFavorite(choice: SavedChoice): Promise<SavedChoice> { return choice; }
  async removeFavorite(_id: SavedChoiceId): Promise<void> {}
}

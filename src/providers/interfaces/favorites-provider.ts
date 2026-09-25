import type { SavedChoice, SavedChoiceId } from "../../domain";

export interface FavoritesProvider {
  listFavorites(): Promise<readonly SavedChoice[]>;
  getFavorite(id: SavedChoiceId): Promise<SavedChoice | null>;
  saveFavorite(choice: SavedChoice): Promise<SavedChoice>;
  removeFavorite(id: SavedChoiceId): Promise<void>;
}

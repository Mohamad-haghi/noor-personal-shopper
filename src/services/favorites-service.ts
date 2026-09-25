import type { FavoritesProvider } from "../providers/interfaces/favorites-provider";
import type { SavedChoice, SavedChoiceId } from "../domain";

export class FavoritesService {
  constructor(private readonly provider: FavoritesProvider) {}

  list(): Promise<readonly SavedChoice[]> { return this.provider.listFavorites(); }
  get(id: SavedChoiceId): Promise<SavedChoice | null> { return this.provider.getFavorite(id); }
  save(choice: SavedChoice): Promise<SavedChoice> { return this.provider.saveFavorite(choice); }
  remove(id: SavedChoiceId): Promise<void> { return this.provider.removeFavorite(id); }
}

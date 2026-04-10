/**
 * Plataformas soportadas con sus IDs de RAWG API.
 * Fuente: GET https://api.rawg.io/api/platforms
 */
export enum Platform {
  PC = 4,
  PlayStation4 = 18,
  PlayStation5 = 187,
  XboxOne = 1,
  XboxSeriesX = 186,
  Xbox360 = 14,
  NintendoSwitch = 7,
  Nintendo3DS = 8,
  NintendoWii = 11,
  NintendoWiiU = 10,
  iOS = 3,
  Android = 21,
  macOS = 5,
  Linux = 6,
}

/** Etiquetas de display para el filtro de plataforma del sidebar. */
export const PLATFORM_LABELS: Record<Platform, string> = {
  [Platform.PC]: 'PC',
  [Platform.PlayStation4]: 'PlayStation 4',
  [Platform.PlayStation5]: 'PlayStation 5',
  [Platform.XboxOne]: 'Xbox One',
  [Platform.XboxSeriesX]: 'Xbox Series X|S',
  [Platform.Xbox360]: 'Xbox 360',
  [Platform.NintendoSwitch]: 'Nintendo Switch',
  [Platform.Nintendo3DS]: 'Nintendo 3DS',
  [Platform.NintendoWii]: 'Nintendo Wii',
  [Platform.NintendoWiiU]: 'Nintendo Wii U',
  [Platform.iOS]: 'iOS',
  [Platform.Android]: 'Android',
  [Platform.macOS]: 'macOS',
  [Platform.Linux]: 'Linux',
};

/**
 * Un juego en la lista personal del usuario.
 * Se guarda en localStorage y se usa para el shuffle.
 */
export interface Game {
  /** ID de RAWG. Sirve como identificador único en la lista. */
  id: number;
  /** Nombre del juego tal como lo devuelve RAWG. */
  name: string;
  /** URL de la imagen de portada (background_image de RAWG). */
  coverUrl: string | null;
  /** Plataforma(s) del juego (puede tener varias). */
  platforms: Platform[];
  /** Slug de RAWG para deep-linking futuro. */
  slug: string;
}

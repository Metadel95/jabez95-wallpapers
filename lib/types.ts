export interface Wallpaper {
  /** Stable unique id, also used as the public slug */
  id: string;
  /** Display title, e.g. "Be Holy" */
  title: string;
  /** Free-form tags, e.g. ["Scripture", "Typography"] */
  categories: string[];
  /** Public URL of the full-resolution image in Blob storage */
  imageUrl: string;
  /** Pathname in Blob storage, needed to delete the file later */
  pathname: string;
  /** Original filename, used for the download */
  filename: string;
  width: number;
  height: number;
  /** File size in bytes */
  size: number;
  /** ISO date string */
  createdAt: string;
  /** Sequential catalog number, e.g. 14 */
  catalogNumber: number;
}

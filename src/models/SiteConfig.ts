import mongoose, { Schema, Document, Model } from "mongoose";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IBorderRadiusOverrides {
  radiusCard?: string;
  radiusButton?: string;
  radiusBadge?: string;
  radiusInput?: string;
}

export interface IProductCardOverrides {
  bgFrom?: string;
  bgTo?: string;
  border?: string;
  hoverShadow?: string;
  headerText?: string;
  mutedText?: string;
  badgeBg?: string;
  badgeBorder?: string;
  badgeText?: string;
  imageBg?: string;
}

export interface ISiteConfig extends Document {
  /** Fixed key — always "site". Ensures exactly one document. */
  singleton: string;
  /** ID of the active theme from public/themes.json */
  activeThemeId: string;
  /** Admin-defined border radius overrides (applied on top of active theme) */
  borderRadiusOverrides: IBorderRadiusOverrides;
  /** Admin-defined product card overrides (applied on top of active theme) */
  productCardOverrides: IProductCardOverrides;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const borderRadiusOverridesSchema = new Schema<IBorderRadiusOverrides>(
  {
    radiusCard:   { type: String },
    radiusButton: { type: String },
    radiusBadge:  { type: String },
    radiusInput:  { type: String },
  },
  { _id: false }
);

const productCardOverridesSchema = new Schema<IProductCardOverrides>(
  {
    bgFrom:      { type: String },
    bgTo:        { type: String },
    border:      { type: String },
    hoverShadow: { type: String },
    headerText:  { type: String },
    mutedText:   { type: String },
    badgeBg:     { type: String },
    badgeBorder: { type: String },
    badgeText:   { type: String },
    imageBg:     { type: String },
  },
  { _id: false }
);

const siteConfigSchema = new Schema<ISiteConfig>(
  {
    singleton:            { type: String, default: "site", unique: true, immutable: true },
    activeThemeId:        { type: String, default: "dark-luxe" },
    borderRadiusOverrides: { type: borderRadiusOverridesSchema, default: {} },
    productCardOverrides:  { type: productCardOverridesSchema,  default: {} },
  },
  { timestamps: true }
);

// ─── Model ────────────────────────────────────────────────────────────────────

const SiteConfig: Model<ISiteConfig> =
  mongoose.models.SiteConfig ||
  mongoose.model<ISiteConfig>("SiteConfig", siteConfigSchema);

export default SiteConfig;

// ─── Helper: get or create the singleton document ─────────────────────────────

export async function getSiteConfig(): Promise<ISiteConfig> {
  let config = await SiteConfig.findOne({ singleton: "site" });
  if (!config) {
    config = await SiteConfig.create({ singleton: "site" });
  }
  return config;
}

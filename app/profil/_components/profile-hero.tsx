"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import {
  activityCategoryOptions,
  interestCategoryOptions,
  InterestCategoryTag,
} from "@/components/activity/category-tag";
import { AvatarUpload } from "@/components/account/avatar-upload";
import { Avatar } from "@/components/account/avatar";
import {
  BANNER_PRESETS,
  resolveBannerBackground,
} from "@/lib/banner-themes";
import { updateProfileDetails } from "@/lib/actions/profile";
import type { ActivityInterestCategory } from "@/lib/supabase/types";
import { ProfileStat } from "./profile-stat";

interface ProfileStats {
  planer: number;
  arrangerer: number;
  deltar: number;
  reach: number;
}

interface ProfileHeroProps {
  userId: string;
  displayName: string;
  initials: string;
  avatarColor: string;
  avatarUrl: string | null;
  bio: string | null;
  bannerTheme: string | null;
  favoriteCategories: ActivityInterestCategory[];
  memberSince: string;
  isSelf: boolean;
  stats: ProfileStats;
}

export function ProfileHero({
  userId,
  displayName,
  initials,
  avatarColor,
  avatarUrl,
  bio,
  bannerTheme,
  favoriteCategories,
  memberSince,
  isSelf,
  stats,
}: ProfileHeroProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [bioDraft, setBioDraft] = useState(bio ?? "");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    bannerTheme && /^#/.test(bannerTheme)
      ? null
      : (bannerTheme ?? BANNER_PRESETS[0].id)
  );
  const [customColor, setCustomColor] = useState(
    bannerTheme && /^#/.test(bannerTheme) ? bannerTheme : "#7aa060"
  );
  const [useCustomColor, setUseCustomColor] = useState(
    !!bannerTheme && /^#/.test(bannerTheme)
  );
  const [selectedCategories, setSelectedCategories] =
    useState<ActivityInterestCategory[]>(favoriteCategories);

  const bannerBackground = resolveBannerBackground(bannerTheme);
  const bioText = bio?.trim() ?? "";
  const hasBio = bioText.length > 0;
  const hasFavoriteCategories = favoriteCategories.length > 0;
  const bannerThemeValue = useCustomColor
    ? customColor
    : (selectedPreset ?? BANNER_PRESETS[0].id);

  const groupedCategories = activityCategoryOptions.map(({ value }) => ({
    group: value,
    options: interestCategoryOptions.filter((category) => category.group === value),
  }));

  function resetEditorState() {
    setBioDraft(bio ?? "");
    setSelectedPreset(
      bannerTheme && /^#/.test(bannerTheme)
        ? null
        : (bannerTheme ?? BANNER_PRESETS[0].id)
    );
    setCustomColor(bannerTheme && /^#/.test(bannerTheme) ? bannerTheme : "#7aa060");
    setUseCustomColor(!!bannerTheme && /^#/.test(bannerTheme));
    setSelectedCategories(favoriteCategories);
  }

  function toggleEditor() {
    if (editorOpen) {
      resetEditorState();
      setEditorOpen(false);
      return;
    }

    setEditorOpen(true);
  }

  function toggleCategory(category: ActivityInterestCategory) {
    setSelectedCategories((current) => {
      if (current.includes(category)) {
        return current.filter((value) => value !== category);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, category];
    });
  }

  return (
    <>
      <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card-strong)]">
        <div className="relative flex min-h-[19rem] items-center overflow-hidden px-6 py-8 sm:min-h-[20.5rem] sm:px-8 sm:py-10">
          <div
            className="absolute inset-0"
            style={{ background: bannerBackground }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--hero-overlay)" }}
          />

          <div className="relative flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              <div className="relative inline-block self-start">
                <Avatar
                  src={avatarUrl}
                  initials={initials}
                  color={avatarColor}
                  size={152}
                  className="rounded-[36px] ring-4 ring-white/70 shadow-[var(--shadow-card-strong)]"
                />
                {isSelf && (
                  <div className="absolute -right-1 -bottom-1">
                    <AvatarUpload
                      variant="icon"
                      userId={userId}
                      currentSrc={avatarUrl}
                      initials={initials}
                      color={avatarColor}
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0 pb-1 text-white">
                <h1 className="card-title break-words text-[2.6rem] leading-[0.92] text-white sm:text-[3.4rem]">
                  {displayName}
                </h1>
                <p className="mt-3 text-sm font-medium text-white/82">
                  Medlem siden {memberSince}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 self-center sm:grid-cols-4 lg:w-[18rem] lg:self-center lg:grid-cols-2">
              <ProfileStat label="Planer" value={stats.planer} />
              <ProfileStat label="Arrangerer" value={stats.arrangerer} />
              <ProfileStat label="Deltar" value={stats.deltar} />
              <ProfileStat label="Reach" value={stats.reach} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <form action={updateProfileDetails}>
          {editorOpen ? (
            <>
              <input type="hidden" name="banner_theme" value={bannerThemeValue} />
              {selectedCategories.map((category) => (
                <input
                  key={category}
                  type="hidden"
                  name="favorite_categories"
                  value={category}
                />
              ))}
            </>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="card-title text-[2rem] text-[var(--ink)]">
                Mer om {displayName}
              </h2>
            </div>
            {isSelf && (
              <div className="flex flex-wrap items-center gap-3 self-start">
                <button
                  type="button"
                  onClick={toggleEditor}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--sage-500)] hover:bg-[var(--sage-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
                >
                  {editorOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                  {editorOpen ? "Avbryt" : "Rediger profil"}
                </button>
                {editorOpen ? (
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--sage-500)] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--sage-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2"
                  >
                    Lagre profil
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                Bio
              </p>
              {editorOpen ? (
                <div className="mt-3 space-y-5">
                  <div className="relative">
                    <textarea
                      id="profile-bio-inline"
                      name="bio"
                      maxLength={280}
                      rows={5}
                      value={bioDraft}
                      onChange={(event) => setBioDraft(event.target.value)}
                      placeholder="Fortell andre litt om deg selv..."
                      autoFocus
                      className="card-copy w-full resize-none rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 text-[15px] text-[var(--ink)] outline-none transition focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[color:rgba(122,160,96,0.18)]"
                    />
                    <span className="absolute bottom-3 right-4 text-xs text-[var(--ink-subtle)]">
                      {bioDraft.length}/280
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                      Banner
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {BANNER_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setSelectedPreset(preset.id);
                            setUseCustomColor(false);
                          }}
                          className={`h-10 w-16 rounded-2xl border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
                            !useCustomColor && selectedPreset === preset.id
                              ? "border-[var(--sage-500)] shadow-sm"
                              : "border-transparent hover:border-[var(--border)]"
                          }`}
                          style={{ backgroundColor: preset.swatch }}
                          title={preset.label}
                          aria-label={preset.label}
                          aria-pressed={!useCustomColor && selectedPreset === preset.id}
                        />
                      ))}

                      <label
                        className={`relative flex h-10 w-16 cursor-pointer items-center justify-center rounded-2xl border-2 transition focus-within:ring-2 focus-within:ring-[var(--sage-600)] focus-within:ring-offset-2 ${
                          useCustomColor
                            ? "border-[var(--sage-500)] shadow-sm"
                            : "border-transparent hover:border-[var(--border)]"
                        }`}
                        style={{ background: customColor }}
                        title="Egendefinert farge"
                      >
                        <span className="text-[10px] font-bold text-white/80 drop-shadow">
                          Velg
                        </span>
                        <input
                          type="color"
                          value={customColor}
                          onChange={(event) => {
                            setCustomColor(event.target.value);
                            setUseCustomColor(true);
                            setSelectedPreset(null);
                          }}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          aria-label="Velg egendefinert farge"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="card-copy mt-3 max-w-prose text-[15px]">
                  {hasBio
                    ? bioText
                    : isSelf
                      ? "Skriv noen linjer om deg selv i profilredigeringen."
                      : "Ingen bio lagt til enda."}
                </p>
              )}
            </div>

            <div className="border-t border-[var(--border)] pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-subtle)]">
                Interesser
              </p>
              {editorOpen ? (
                <div className="mt-3 space-y-4">
                  {groupedCategories.map(({ group, options }) => (
                    <div key={group}>
                      <p className="text-xs font-medium text-[var(--ink-muted)]">
                        {group}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {options.map((option) => {
                          const isSelected = selectedCategories.includes(option.value);
                          const isDisabled =
                            !isSelected && selectedCategories.length >= 3;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleCategory(option.value)}
                              disabled={isDisabled}
                              aria-pressed={isSelected}
                              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage-600)] focus-visible:ring-offset-2 ${
                                isSelected
                                  ? "border-[var(--sage-500)] bg-[var(--sage-50)] text-[var(--sage-700)]"
                                  : isDisabled
                                    ? "cursor-not-allowed border-[var(--border)] bg-[var(--surface-muted)] text-[var(--ink-subtle)] opacity-40"
                                    : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--ink)] hover:border-[var(--sage-400)] hover:bg-[var(--sage-50)]"
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : hasFavoriteCategories ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {favoriteCategories.map((category) => (
                    <InterestCategoryTag key={category} category={category} />
                  ))}
                </div>
              ) : (
                <p className="card-copy mt-3 text-[15px]">
                  {isSelf
                    ? "Velg opptil tre favorittkategorier for profilen din."
                    : "Ingen interesser eller preferanser er valgt enda."}
                </p>
              )}
            </div>
          </div>

        </form>
      </section>
    </>
  );
}

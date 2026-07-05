export const APP_MAX_WIDTH = "max-w-[1440px]";

/** Full viewport backdrop (visible on sides when content is centered) */
export const APP_SCREEN_CLASS = "min-h-screen bg-stone-200";

/** Centered shell: sidebar + main share one max-width column */
export const APP_SHELL_CLASS = `mx-auto flex min-h-[calc(100vh-57px)] w-full ${APP_MAX_WIDTH}`;

export const APP_SIDEBAR_CLASS =
  "hidden w-64 shrink-0 overflow-hidden border-r border-stone-300/60 bg-white md:block";

export const APP_MAIN_CLASS =
  "min-w-0 flex-1 bg-stone-50 px-4 py-4 pb-24 md:px-8 md:py-6";

export const APP_HEADER_CLASS = "border-b border-stone-300/60 bg-white";

export const APP_HEADER_INNER_CLASS = `mx-auto flex w-full ${APP_MAX_WIDTH} items-center justify-between px-4 py-3 md:px-8`;

/** Dashboard chart grid — uses extra width on large screens */
export const DASHBOARD_CHART_GRID_CLASS = "grid gap-4 md:grid-cols-2 xl:grid-cols-3";

export const CHART_HEIGHT = 300;

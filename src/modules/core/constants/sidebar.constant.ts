enum OptionsCanActivated {
  HOME = 'home',
  EXPLORE = 'explore',
  PROFILE = 'profile',
}

enum OptionsCannotActivated {
  SEARCH = 'search',
  CREATE = 'create',
  LOGOUT = 'logout',
}

export const SIDEBAR_OPTION = {
  CAN_ACTIVATED: [...Object.values(OptionsCanActivated)],
  CANNOT_ACTIVATED: [...Object.values(OptionsCannotActivated)],
  ...OptionsCanActivated,
  ...OptionsCannotActivated,
};

export type SidebarOptionStrings =
  | `${OptionsCanActivated}`
  | `${OptionsCannotActivated}`;

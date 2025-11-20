const PERMISSIONS = {
  admin: {
    products: ["view", "create", "edit", "delete"],
  },
  user: {
    products: ["view", "create"],
  },
};

function getRoleFromProfile(profile) {
  return profile?.profile || "guest";
}

export function canUserDo(featureName, action, prof) {
  const profile = getRoleFromProfile(prof);
  const profilePerms = PERMISSIONS[profile] || PERMISSIONS.guest;
  const featurePerms = profilePerms[featureName] || [];
  return featurePerms.includes(action);
}

export function FeatureGuard({
  feature,
  action = "view",
  profile,
  fallback = null,
  children,
}) {
  const allowed = canUserDo(feature, action, profile);

  if (!allowed) {
    return fallback;
  }

  return <>{children}</>;
}

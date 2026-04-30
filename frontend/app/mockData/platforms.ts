export const platforms = [
  { slug: "pc", name: "PC (Microsoft Windows)", id: 6 },
  { slug: "mac", name: "Mac", id: 14 },
  { slug: "linux", name: "Linux", id: 3 },
  { slug: "ps4", name: "PlayStation 4", id: 48 },
  { slug: "ps5", name: "PlayStation 5", id: 167 },
  { slug: "xbox-one", name: "Xbox One", id: 49 },
  { slug: "xbox-series", name: "Xbox Series X|S", id: 169 },
  { slug: "switch", name: "Nintendo Switch", id: 130 },
  { slug: "switch-2", name: "Nintendo Switch 2", id: 508 },
  { slug: "ios", name: "iOS", id: 39 },
  { slug: "android", name: "Android", id: 34 },
];

export const platformMap = Object.fromEntries(
  platforms.map((p) => [p.slug, p.id]),
);

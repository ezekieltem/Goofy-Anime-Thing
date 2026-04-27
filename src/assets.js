import assetMap from './Assets/map.json';

const assetContext = require.context(
  './Assets',
  true,
  /\.(png|jpe?g|gif|webp|svg)$/i,
);

const assetEntries = Object.values(assetMap)
  .filter(Array.isArray)
  .flat()
  .filter((entry) => (
    typeof entry?.id === 'string'
    && typeof entry?.path === 'string'
  ));

const assetRegistry = assetEntries
  .reduce((registry, asset) => {
    const normalizedPath = `.${asset.path}`;

    registry[asset.id] = assetContext(normalizedPath);
    return registry;
  }, {});

const allTitles = Array.isArray(assetMap.Titles) ? assetMap.Titles : [];

const titlesByTag = allTitles.reduce((registry, { value, tags = [] }) => {
  tags.forEach((tag) => {
    if (!registry[tag]) {
      registry[tag] = [];
    }

    registry[tag].push(value);
  });

  return registry;
}, {});

export function getAssetUrl(assetId) {
  return assetRegistry[assetId] ?? null;
}

export function setImageSource(element, assetId) {
  const assetUrl = getAssetUrl(assetId);

  if (!element || !assetUrl) {
    return false;
  }

  element.src = assetUrl;
  return true;
}

export function getTagsByTitle(title) {
  const match = allTitles.find(({ value }) => value === title);
  return match?.tags ?? [];
}

export function getTitlesByTag(tag) {
  return titlesByTag[tag] ?? [];
}

export function getTitle(tags = []) {
  const possibleTitles = tags.length === 0
    ? allTitles.map(({ value }) => value)
    : [...new Set(tags.flatMap((tag) => getTitlesByTag(tag)))];

  if (possibleTitles.length === 0) {
    return '';
  }

  const randomIndex = Math.floor(Math.random() * possibleTitles.length);
  return possibleTitles[randomIndex];
}

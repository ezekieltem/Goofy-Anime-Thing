import rawAssetMap from './Assets/map.jsonc';

function stripJsonComments(source) {
  let result = '';
  let inString = false;
  let stringDelimiter = '';
  let isEscaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < source.length; index += 1) {
    const currentChar = source[index];
    const nextChar = source[index + 1];

    if (inLineComment) {
      if (currentChar === '\n') {
        inLineComment = false;
        result += currentChar;
      }
      continue;
    }

    if (inBlockComment) {
      if (currentChar === '*' && nextChar === '/') {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      result += currentChar;

      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (currentChar === '\\') {
        isEscaped = true;
        continue;
      }

      if (currentChar === stringDelimiter) {
        inString = false;
        stringDelimiter = '';
      }

      continue;
    }

    if (currentChar === '"' || currentChar === '\'') {
      inString = true;
      stringDelimiter = currentChar;
      result += currentChar;
      continue;
    }

    if (currentChar === '/' && nextChar === '/') {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (currentChar === '/' && nextChar === '*') {
      inBlockComment = true;
      index += 1;
      continue;
    }

    result += currentChar;
  }

  return result;
}

const assetMap = JSON.parse(stripJsonComments(rawAssetMap));

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
const messageStages = assetMap.MsgStages ?? {};

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

function hasMatchingTags(entry, tags = []) {
  const entryTags = Array.isArray(entry?.Tags) ? entry.Tags : [];

  if (tags.length === 0 || entryTags.length === 0) {
    return true;
  }

  return entryTags.some((tag) => tags.includes(tag));
}

export function getRandomStageValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '';
    }

    const randomIndex = Math.floor(Math.random() * value.length);
    return value[randomIndex] ?? '';
  }

  return value ?? '';
}

export function getStageEntry(stageName, tags = []) {
  const rawStage = messageStages[stageName];

  if (Array.isArray(rawStage)) {
    const stageEntries = rawStage;

    if (stageEntries.length === 0) {
      return null;
    }

    const filteredEntries = tags.length === 0
      ? stageEntries
      : stageEntries.filter((entry) => hasMatchingTags(entry, tags));

    const possibleEntries = filteredEntries.length > 0 ? filteredEntries : stageEntries;
    const randomIndex = Math.floor(Math.random() * possibleEntries.length);

    return possibleEntries[randomIndex] ?? null;
  }

  if (!rawStage || typeof rawStage !== 'object') {
    return null;
  }

  if (!hasMatchingTags(rawStage, tags) && tags.length > 0) {
    return null;
  }

  return rawStage;
}

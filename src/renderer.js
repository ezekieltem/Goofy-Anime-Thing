import './index.css';
import {
  setImageSource,
  getTitle,
  getTagsByTitle,
  getStageEntry,
  getRandomStageValue,
} from './assets.js';

const animeImage = document.getElementById('anime');
const titleLabel = document.getElementById('title');
const consentAcceptButton = document.getElementById('consentAccept');
const consentExitButton = document.getElementById('consentExit');
const introMessage = document.getElementById('in-msg');
const introButton = document.getElementById('in-yes');
const transitionDiv = document.getElementById('Transition');
const cardBackButton = document.getElementById('cardBack');
const cardContinueButton = document.getElementById('cardContinue');
const billingBackButton = document.getElementById('billingBack');
const billingContinueButton = document.getElementById('billingContinue');
const cardPanelTitle = document.querySelector('#cardInfo .panelTitle');
const cardPanelSubTitle = document.querySelector('#cardInfo .panelSubTitle');
const cardNumLabel = document.getElementById('cardNum-Txt');
const cardExpLabel = document.getElementById('cardExp-Txt');
const cardSecLabel = document.getElementById('cardSec-Txt');
const billingPanelTitle = document.querySelector('#nameAdd .panelTitle');
const billingPanelSubTitle = document.querySelector('#nameAdd .panelSubTitle');
const billingNameLabel = document.getElementById('billingName-Txt');
const billingAddress1Label = document.getElementById('billingAddress1-Txt');
const billingTownLabel = document.getElementById('billingTown-Txt');
const billingStateLabel = document.getElementById('billingState-Txt');
const billingZipLabel = document.getElementById('billingZip-Txt');
const billingCountryLabel = document.getElementById('billingCountry-Txt');
const billingPhoneLabel = document.getElementById('billingPhone-Txt');
const billingEmailLabel = document.getElementById('billingEmail-Txt');
const finalMessage = document.getElementById('final-msg');

let RuntimeRandoms = {
  title: undefined,
  titleTags: undefined,

  Image: undefined,

  Intro: undefined,

  Card: undefined,

  NameAdd: undefined,

  Final: undefined,
};

let curState = 'intro';

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function applyInlineStyles(element, styleDefinition = {}) {
  if (styleDefinition.color) {
    element.style.color = styleDefinition.color;
  }

  if (styleDefinition.BackgroundColor) {
    element.style.backgroundColor = styleDefinition.BackgroundColor;
  }

  if (styleDefinition.Size?.Value && styleDefinition.Size?.type) {
    element.style.fontSize = `${styleDefinition.Size.Value}${styleDefinition.Size.type}`;
  }

  if (styleDefinition.Italics) {
    element.style.fontStyle = 'italic';
  }

  if (styleDefinition.Bold) {
    element.style.fontWeight = 'bold';
  }

  if (styleDefinition.Underlined) {
    element.style.textDecoration = 'underline';
  }
}

function appendRichNode(parent, nodeDefinition) {
  if (typeof nodeDefinition === 'string') {
    parent.append(document.createTextNode(nodeDefinition));
    return;
  }

  if (Array.isArray(nodeDefinition)) {
    nodeDefinition.forEach((childNode) => {
      appendRichNode(parent, childNode);
    });
    return;
  }

  if (nodeDefinition && typeof nodeDefinition === 'object' && typeof nodeDefinition.Text === 'string') {
    const span = document.createElement('span');
    span.textContent = nodeDefinition.Text;
    applyInlineStyles(span, nodeDefinition);
    parent.append(span);
  }
}

function renderStageLines(target, lines = []) {
  if (!target) {
    return;
  }

  target.replaceChildren();

  lines.forEach((lineDefinition, index) => {
    const line = document.createElement('div');
    appendRichNode(line, lineDefinition);
    target.append(line);

    if (index < lines.length - 1) {
      target.append(document.createElement('br'));
    }
  });
}

function setTextContent(target, value) {
  if (!target) {
    return;
  }

  target.textContent = value;
}

let stateDebounce = false;

const containers = [
  document.getElementById('consent'),
  document.getElementById('intro'),
  document.getElementById('cardInfo'),
  document.getElementById('nameAdd'),
  document.getElementById('final'),
];

function setActiveContainer(state) {
  containers.forEach((element) => {
    if (!element) {
      return;
    }

    const isActive = element.id === state;
    element.hidden = !isActive;
  });
}

function nextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

window.DEBUG = {
  ChangeTitle: () => {
    RuntimeRandoms.title = getTitle();
    window.windowControls.setTitle(RuntimeRandoms.title);
    if (titleLabel) {
      titleLabel.textContent = RuntimeRandoms.title;
    }

    RuntimeRandoms.titleTags = getTagsByTitle(RuntimeRandoms.title);

    return RuntimeRandoms.title;
  },
  ChangeImage: () => {

  },
  ChangeIntro: () => {
    RuntimeRandoms.Intro = getStageEntry('Intro', RuntimeRandoms.titleTags ?? []);

    if (!RuntimeRandoms.Intro) {
      return null;
    }

    renderStageLines(introMessage, RuntimeRandoms.Intro.Lines);

    if (introButton && typeof RuntimeRandoms.Intro.Button === 'string') {
      introButton.value = RuntimeRandoms.Intro.Button;
    }

    return RuntimeRandoms.Intro;
  },
  ChangeCard: () => {
    RuntimeRandoms.Card = getStageEntry('Card', RuntimeRandoms.titleTags ?? []);

    if (!RuntimeRandoms.Card) {
      return null;
    }

    setTextContent(cardPanelTitle, getRandomStageValue(RuntimeRandoms.Card.Title));
    setTextContent(cardPanelSubTitle, getRandomStageValue(RuntimeRandoms.Card.SubText));
    setTextContent(cardNumLabel, getRandomStageValue(RuntimeRandoms.Card.Num));
    setTextContent(cardExpLabel, getRandomStageValue(RuntimeRandoms.Card.Exp));
    setTextContent(cardSecLabel, getRandomStageValue(RuntimeRandoms.Card.Sec));
    setTextContent(cardBackButton, getRandomStageValue(RuntimeRandoms.Card.Back));
    setTextContent(cardContinueButton, getRandomStageValue(RuntimeRandoms.Card.Next));

    return RuntimeRandoms.Card;
  },
  ChangeNameAdd: () => {
    RuntimeRandoms.NameAdd = getStageEntry('NameAdd', RuntimeRandoms.titleTags ?? []);

    if (!RuntimeRandoms.NameAdd) {
      return null;
    }

    setTextContent(billingPanelTitle, getRandomStageValue(RuntimeRandoms.NameAdd.Title) || 'Billing Details');
    setTextContent(billingPanelSubTitle, getRandomStageValue(RuntimeRandoms.NameAdd.SubText) || '');
    setTextContent(billingNameLabel, getRandomStageValue(RuntimeRandoms.NameAdd.Name));
    setTextContent(billingAddress1Label, getRandomStageValue(RuntimeRandoms.NameAdd.Address));
    setTextContent(billingTownLabel, getRandomStageValue(RuntimeRandoms.NameAdd.Town));
    setTextContent(billingStateLabel, getRandomStageValue(RuntimeRandoms.NameAdd.State));
    setTextContent(billingZipLabel, getRandomStageValue(RuntimeRandoms.NameAdd.Zip));
    setTextContent(billingCountryLabel, getRandomStageValue(RuntimeRandoms.NameAdd.Country));
    setTextContent(billingPhoneLabel, getRandomStageValue(RuntimeRandoms.NameAdd.Phone));
    setTextContent(billingEmailLabel, getRandomStageValue(RuntimeRandoms.NameAdd.Email));
    setTextContent(billingBackButton, getRandomStageValue(RuntimeRandoms.NameAdd.Back));
    setTextContent(billingContinueButton, getRandomStageValue(RuntimeRandoms.NameAdd.Next));

    return RuntimeRandoms.NameAdd;
  },
  ChangeFinal: () => {
    RuntimeRandoms.Final = getStageEntry('Final', RuntimeRandoms.titleTags ?? []);

    if (!RuntimeRandoms.Final) {
      return null;
    }

    renderStageLines(finalMessage, RuntimeRandoms.Final.Lines);

    return RuntimeRandoms.Final;
  },
  /**
   * 
   * @param {"consent" | "intro" | "cardInfo" | "nameAdd" | "final"} state 
   */
  TransitionTo: async (state) => {
    if (state == curState) return;
    if (stateDebounce) return;

    stateDebounce = true;

    transitionDiv.setAttribute('state', '1');
    await sleep(1100);

    setActiveContainer(state);
    await nextFrame();

    transitionDiv.setAttribute('state', '2');
    await sleep(1100);
    transitionDiv.setAttribute('state', '0');
    curState = state;

    stateDebounce = false;

    if (
      state === 'final'
      && RuntimeRandoms.Final?.ForceClose?.Do === true
      && typeof RuntimeRandoms.Final.ForceClose.Time === 'number'
    ) {
      await sleep(RuntimeRandoms.Final.ForceClose.Time);

      if (curState === 'final') {
        window.windowControls.close();
      }
    }
  },
};

async function initializeApp() {
  window.DEBUG.ChangeTitle();
  window.DEBUG.ChangeIntro();
  window.DEBUG.ChangeCard();
  window.DEBUG.ChangeNameAdd();
  window.DEBUG.ChangeFinal();

  const firstRunState = await window.appState.getFirstRunState();
  curState = firstRunState?.acknowledged ? 'intro' : 'consent';
  setActiveContainer(curState);
}

if (animeImage instanceof HTMLImageElement) {
  const loaded = setImageSource(animeImage, 'shy1');
}

const minBtn = document.getElementById('min');
const closeBtn = document.getElementById('x');

minBtn?.addEventListener('click', () => {
  window.windowControls.minimize();
});

closeBtn?.addEventListener('click', () => {
  window.windowControls.close();
});


introButton?.addEventListener('click', (ev) => {
  window.DEBUG.TransitionTo('cardInfo');
});

cardBackButton?.addEventListener('click', () => {
  window.DEBUG.TransitionTo('intro');
});

cardContinueButton?.addEventListener('click', () => {
  window.DEBUG.TransitionTo('nameAdd');
});

billingBackButton?.addEventListener('click', () => {
  window.DEBUG.TransitionTo('cardInfo');
});

billingContinueButton?.addEventListener('click', () => {
  window.DEBUG.TransitionTo('final');
});

consentExitButton?.addEventListener('click', () => {
  window.windowControls.close();
});

consentAcceptButton?.addEventListener('click', async () => {
  await window.appState.acknowledgeFirstRun();
  window.DEBUG.TransitionTo('intro');
});

initializeApp();

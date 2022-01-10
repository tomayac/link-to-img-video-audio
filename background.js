/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

(async (browser) => {
  function loadMessages(language) {
    return fetch(`_locales/${language}/messages.json`).then((response) =>
      response.json(),
    );
  }

  const languages = await new Promise((resolve) =>
    browser.i18n.getAcceptLanguages(resolve),
  );
  const language = languages[0].split('-')[0];
  const messages = await loadMessages(language).catch((_) =>
    loadMessages('en'),
  );

  console.log(messages);

  browser.contextMenus.create({
    id: 'link-to-media',
    title: messages.contextMenuTitle.message,
    contexts: ['image', 'video', 'audio'],
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    const { mediaType, srcUrl } = info;
    console.log(mediaType, srcUrl, tab.id);
    browser.tabs.sendMessage(
      tab.id,
      {
        selection: {
          mediaType,
          srcUrl,
        },
      },
      (response) => {
        console.log(response);
      },
    );
  });
})(chrome || browser);

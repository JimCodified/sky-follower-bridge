import { type BskyLoginParams } from "./lib/bskyClient";
import type { PlasmoCSConfig } from "plasmo"
import { MESSAGE_NAMES, VIEWER_STATE } from "~lib/constants";
import "./style.content.css"
import { searchAndInsertBskyUsers } from '~lib/searchAndInsertBskyUsers';
import { BskyServiceWorkerClient } from "~lib/bskyServiceWorkerClient";

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*"],
  all_frames: true
}

const searchAndShowBskyUsers = async ({
  identifier,
  password,
  messageName,
}: BskyLoginParams & { messageName: string }) => {

  const agent = await BskyServiceWorkerClient.createAgent({
    identifier,
    password,
  });

  switch (messageName) {
    case MESSAGE_NAMES.SEARCH_BSKY_USER_ON_FOLLOW_PAGE:
      await searchAndInsertBskyUsers({
        agent,
        btnLabel: {
          add: "Follow",
          remove: "Unfollow",
          progressive: "Following",
        },
        statusKey: VIEWER_STATE.FOLLOWING,
        userCellQueryParam: '[data-testid="primaryColumn"] [data-testid="UserCell"]',
        addQuery: async (arg: string) => await agent.follow(arg),
        removeQuery: async (arg: string) => await agent.unfollow(arg),
      })
      break
    case MESSAGE_NAMES.SEARCH_BSKY_USER_ON_LIST_MEMBERS_PAGE:
      await searchAndInsertBskyUsers({
        agent,
        btnLabel: {
          add: "Follow",
          remove: "Unfollow",
          progressive: "Following",
        },
        statusKey: VIEWER_STATE.FOLLOWING,
        userCellQueryParam: '[data-testid="cellInnerDiv"] [data-testid="UserCell"]',
        addQuery: async (arg: string) => await agent.follow(arg),
        removeQuery: async (arg: string) => await agent.unfollow(arg),
      })
      break
    case MESSAGE_NAMES.SEARCH_BSKY_USER_ON_BLOCK_PAGE:
      // TODO: If already blocked, don't show blocking state. because blocking user can't find.
      await searchAndInsertBskyUsers({
        agent,
        btnLabel: {
          add: "Block",
          remove: "Unblock",
          progressive: "Blocking",
        },
        statusKey: VIEWER_STATE.BLOCKING,
        userCellQueryParam: '[data-testid="UserCell"]',
        addQuery: async (arg: string) => await agent.block(arg),
        removeQuery: async (arg: string) => await agent.unblock(arg),
      })
      break
  }
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (Object.values(MESSAGE_NAMES).includes(message.name)) {
    searchAndShowBskyUsers({
      identifier: message.body.userId,
      password: message.body.password,
      messageName: message.name,
    })
      .then(() => {
        sendResponse({ hasError: false })
      })
      .catch((e) => {
        console.error(e)
        sendResponse({ hasError: true, message: e.toString() })
      });
    return true
  }
  return false
})

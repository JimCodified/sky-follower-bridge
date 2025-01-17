
import van from "vanjs-core"

const { div, p } = van.tags
const { svg, path } = van.tagsNS("http://www.w3.org/2000/svg")

const WarningIcon = () => svg(
  {
    fill: "none",
    "stroke-width": "1.5",
    stroke: "currentColor",
    class: "w-6 h-6",
    viewBox: "0 0 24 24"
  },
  path({
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
  }),
)

export const NotFoundCell = () => div({ class: "bsky-user-content-wrapper" },
  div({ class: "bsky-user-content bsky-user-content__not-found bsky-fade-in" },
    WarningIcon(),
    p({
      class: "not-found"
    },
      "No similar users found."
    )
  ))

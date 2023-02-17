import { CookieConsentProps } from "../../src/CookieConsent.props";
import { defaultStoryProps } from "../defaults/storyProps";
import { DefaultTemplate } from "../defaults/template";

const CustomOnCustomize = DefaultTemplate.bind({});
CustomOnCustomize.args = {
  ...defaultStoryProps,
  enableDeclineButton: true,
  enableCustomizeButton: true,
  customizeModalTitle: "Customize Cookie Settings",
  overlay: true,
  customize: true,
  optionsToCustomize: [
    {
      name: "functionality",
      title: "Functionality Cookies",
      description: "These cookies enables storage that supports the functionality of the website.",
      checked: true,
      required: true,
      type: "functionality_storage",
    },
    {
      name: "ads",
      title: "Ads Cookies",
      description: "These cookies are used to track advertising effectiveness.",
      checked: false,
      type: "ad_storage",
    },
    {
      name: "personalization",
      title: "Personalization Cookies",
      description: "These cookies enables storage related to personalization.",
      checked: false,
      type: "personalization_storage",
    },
    {
      name: "analytics",
      title: "Analytics Cookies",
      description: "These cookies help us to understand how visitors interact with our website.",
      checked: false,
      type: "analytics_storage",
    },
    {
      name: "security",
      title: "Security Cookies",
      description:
        "These cookies enables storage related to security such as authentication functionality.",
      checked: false,
      type: "security_storage",
    },
  ],
} as CookieConsentProps;

export { CustomOnCustomize };

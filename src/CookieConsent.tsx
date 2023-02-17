import Cookies from "js-cookie";
import React, { Component, CSSProperties } from "react";
import { ConditionalWrapper } from "./components/ConditionalWrapper";
import { CookieConsentProps, defaultCookieConsentProps } from "./CookieConsent.props";
import { CookieConsentState, defaultState } from "./CookieConsent.state";
import { POSITION_OPTIONS, SAME_SITE_OPTIONS, VISIBILITY_OPTIONS } from "./models/constants";
import { getCookieConsentValue, getLegacyCookieName } from "./utilities";

export class CookieConsent extends Component<CookieConsentProps, CookieConsentState> {
  public static defaultProps = defaultCookieConsentProps;

  state: CookieConsentState = defaultState;

  componentDidMount() {
    const { overlay, customize, optionsToCustomize, debug } = this.props;

    this.setState({
      cookies: optionsToCustomize,
      overlay,
      customize,
    });

    // if cookie undefined or debug
    if (this.getCookieValue() === undefined || debug) {
      this.setState({ visible: true });
      // if acceptOnScroll is set to true and (cookie is undefined or debug is set to true), add a listener.
      if (this.props.acceptOnScroll) {
        window.addEventListener("scroll", this.handleScroll, { passive: true });
      }
    }
  }

  componentWillUnmount() {
    // remove listener if still set
    this.removeScrollListener();
  }

  /**
   * Set a persistent accept cookie
   */
  accept(acceptedByScrolling = false) {
    const { cookieName, cookieValue, hideOnAccept, onAccept } = this.props;

    this.setCookie(cookieName, cookieValue);

    onAccept(acceptedByScrolling ?? false);

    if (hideOnAccept) {
      this.setState({ visible: false });
      this.removeScrollListener();
    }
  }

  /**
   * Handle a click on the overlay
   */
  overlayClick() {
    const { acceptOnOverlayClick, onOverlayClick } = this.props;
    if (acceptOnOverlayClick) {
      this.accept();
    }
    onOverlayClick();
  }

  /**
   * Set a persistent decline cookie
   */
  decline() {
    const { cookieName, declineCookieValue, hideOnDecline, onDecline, setDeclineCookie } =
      this.props;

    if (setDeclineCookie) {
      this.setCookie(cookieName, declineCookieValue);
    }

    onDecline();

    if (hideOnDecline) {
      this.setState({ visible: false });
    }
  }

  /**
   * Open the customize modal
   */
  customize() {
    this.setState({ customize: true, overlay: true });
  }

  /**
   * Set a persistent cookie based on the customized cookie settings
   */
  saveCustomize() {
    const { cookieName, onCustomize } = this.props;

    const cookiesValue = this.state.cookies.reduce((acc: any, cookie: any) => {
      acc[cookie.type] = cookie.enabled ? "granted" : "denied";
      return acc;
    }, {});

    this.setCookie(cookieName, cookiesValue);

    onCustomize(cookiesValue);

    this.setState({ visible: false, customize: false, overlay: false });
  }

  /**
   * Close the customize modal
   */
  hideOverlay() {
    this.setState({ overlay: false });
  }

  /**
   * onChange handler for the customize modal
   * @param e React.ChangeEvent<HTMLInputElement>
   * @param cookieName string
   */
  handleCookieChange(e: React.ChangeEvent<HTMLInputElement>, cookieName: string) {
    const { checked } = e.target;

    const cookies = this.state.cookies.map((cookie) => {
      if (cookie.name === cookieName) {
        return { ...cookie, enabled: checked };
      }
      return cookie;
    });

    this.setState({ cookies });
  }

  /**
   * Function to set the consent cookie based on the provided variables
   * Sets two cookies to handle incompatible browsers, more details:
   * https://web.dev/samesite-cookie-recipes/#handling-incompatible-clients
   */
  setCookie(cookieName: string, cookieValue: string | object) {
    const { extraCookieOptions, expires, sameSite } = this.props;
    let { cookieSecurity } = this.props;

    if (cookieSecurity === undefined) {
      cookieSecurity = window.location ? window.location.protocol === "https:" : true;
    }

    const cookieOptions = { expires, ...extraCookieOptions, sameSite, secure: cookieSecurity };

    // Fallback for older browsers where can not set SameSite=None,
    // SEE: https://web.dev/samesite-cookie-recipes/#handling-incompatible-clients
    if (sameSite === SAME_SITE_OPTIONS.NONE) {
      Cookies.set(getLegacyCookieName(cookieName), cookieValue, cookieOptions);
    }

    // set the regular cookie
    Cookies.set(cookieName, cookieValue, cookieOptions);
  }

  /**
   * Returns the value of the consent cookie
   * Retrieves the regular value first and if not found the legacy one according
   * to: https://web.dev/samesite-cookie-recipes/#handling-incompatible-clients
   */
  getCookieValue() {
    const { cookieName } = this.props;
    return getCookieConsentValue(cookieName);
  }

  /**
   * checks whether scroll has exceeded set amount and fire accept if so.
   */
  handleScroll = () => {
    const { acceptOnScrollPercentage } = this.props;

    // (top / height) - height * 100
    const rootNode = document.documentElement;
    const body = document.body;
    const top = "scrollTop";
    const height = "scrollHeight";

    const percentage =
      ((rootNode[top] || body[top]) /
        ((rootNode[height] || body[height]) - rootNode.clientHeight)) *
      100;

    if (percentage > acceptOnScrollPercentage) {
      this.accept(true);
    }
  };

  removeScrollListener = () => {
    const { acceptOnScroll } = this.props;
    if (acceptOnScroll) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  };

  render() {
    // If the bar shouldn't be visible don't render anything.
    switch (this.props.visible) {
      case VISIBILITY_OPTIONS.HIDDEN:
        return null;
      case VISIBILITY_OPTIONS.BY_COOKIE_VALUE:
        if (!this.state.visible) {
          return null;
        }
        break;
      default:
        break;
    }

    const {
      location,
      style,
      buttonStyle,
      declineButtonStyle,
      customizeButtonStyle,
      contentStyle,
      disableStyles,
      buttonText,
      declineButtonText,
      customizeButtonText,
      containerClasses,
      contentClasses,
      buttonClasses,
      buttonWrapperClasses,
      declineButtonClasses,
      customizeButtonClasses,
      buttonId,
      declineButtonId,
      disableButtonStyles,
      customizeButtonId,
      enableDeclineButton,
      enableCustomizeButton,
      flipButtons,
      ButtonComponent,
      overlayClasses,
      overlayStyle,
      ariaAcceptLabel,
      ariaDeclineLabel,
      ariaCustomizeLabel,
      customContainerAttributes,
      customContentAttributes,
      customButtonProps,
      customDeclineButtonProps,
      customCustomizeButtonProps,
      customButtonWrapperAttributes,
      customizeModalTitle,
      customizeModalStyle,
      customizeModalOptionsWrapperStyle,
      customizeModalOptionWrapperStyle,
      customizeModalOptionTextStyle,
      customizeOptionCheckboxStyle,
      customizeSaveButtonStyle,
      customizeHideOverlayButtonStyle,
      customizeSaveWrapperStyle,
      customizeOptionWrapperStyle,
    } = this.props;

    let myStyle: CSSProperties = {};
    let myButtonStyle: CSSProperties = {};
    let myDeclineButtonStyle: CSSProperties = {};

    let myCustomizeButtonStyle: CSSProperties = {};
    let myCustomizeSaveWrapperStyle: CSSProperties = {};
    let myCustomizeSaveButtonStyle: CSSProperties = {};
    let myCustomizeModalStyle: CSSProperties = {};
    let myCustomizeHideOverlayButtonStyle: CSSProperties = {};
    let myCustomizeModalOptionsWrapperStyle: CSSProperties = {};
    let myCustomizeModalOptionWrapperStyle: CSSProperties = {};
    let myCustomizeModalOptionTextStyle: CSSProperties = {};
    let myCustomizeOptionWrapperStyle: CSSProperties = {};
    let myCustomizeOptionCheckboxStyle: CSSProperties = {};

    let myContentStyle: CSSProperties = {};
    let myOverlayStyle: CSSProperties = {};

    if (disableStyles) {
      // if styles are disabled use the provided styles (or none)
      myStyle = Object.assign({}, style);
      myButtonStyle = Object.assign({}, buttonStyle);
      myDeclineButtonStyle = Object.assign({}, declineButtonStyle);

      myCustomizeButtonStyle = Object.assign({}, customizeButtonStyle);
      myCustomizeSaveButtonStyle = Object.assign({}, customizeSaveButtonStyle);
      myCustomizeSaveWrapperStyle = Object.assign({}, customizeSaveWrapperStyle);
      myCustomizeHideOverlayButtonStyle = Object.assign({}, customizeHideOverlayButtonStyle);
      myCustomizeModalStyle = Object.assign({}, customizeModalStyle);
      myCustomizeModalOptionTextStyle = Object.assign({}, customizeModalOptionTextStyle);
      myCustomizeModalOptionsWrapperStyle = Object.assign({}, customizeModalOptionsWrapperStyle);
      myCustomizeModalOptionWrapperStyle = Object.assign({}, customizeModalOptionWrapperStyle);
      myCustomizeOptionWrapperStyle = Object.assign({}, customizeOptionWrapperStyle);
      myCustomizeOptionCheckboxStyle = Object.assign({}, customizeOptionCheckboxStyle);

      myContentStyle = Object.assign({}, contentStyle);
      myOverlayStyle = Object.assign({}, overlayStyle);
    } else {
      // if styles aren't disabled merge them with the styles that are provided (or use default styles)
      myStyle = Object.assign({}, { ...this.state.style, ...style });
      myContentStyle = Object.assign({}, { ...this.state.contentStyle, ...contentStyle });
      myOverlayStyle = Object.assign({}, { ...this.state.overlayStyle, ...overlayStyle });

      // switch to disable JUST the button styles
      if (disableButtonStyles) {
        myButtonStyle = Object.assign({}, buttonStyle);
        myDeclineButtonStyle = Object.assign({}, declineButtonStyle);
        myCustomizeButtonStyle = Object.assign({}, customizeButtonStyle);
        myCustomizeSaveWrapperStyle = Object.assign({}, customizeSaveWrapperStyle);
        myCustomizeSaveButtonStyle = Object.assign({}, customizeSaveButtonStyle);
        myCustomizeHideOverlayButtonStyle = Object.assign({}, customizeHideOverlayButtonStyle);
        myCustomizeModalStyle = Object.assign({}, customizeModalStyle);
        myCustomizeModalOptionTextStyle = Object.assign({}, customizeModalOptionTextStyle);
        myCustomizeModalOptionsWrapperStyle = Object.assign({}, customizeModalOptionsWrapperStyle);
        myCustomizeModalOptionWrapperStyle = Object.assign({}, customizeModalOptionWrapperStyle);
        myCustomizeOptionWrapperStyle = Object.assign({}, customizeOptionWrapperStyle);
        myCustomizeOptionCheckboxStyle = Object.assign({}, customizeOptionCheckboxStyle);
      } else {
        myButtonStyle = Object.assign({}, { ...this.state.buttonStyle, ...buttonStyle });
        myDeclineButtonStyle = Object.assign(
          {},
          { ...this.state.declineButtonStyle, ...declineButtonStyle }
        );
        myCustomizeButtonStyle = Object.assign(
          {},
          { ...this.state.customizeButtonStyle, ...customizeButtonStyle }
        );
        myCustomizeSaveWrapperStyle = Object.assign(
          {},
          { ...this.state.customizeSaveWrapperStyle, ...customizeSaveWrapperStyle }
        );
        myCustomizeSaveButtonStyle = Object.assign(
          {},
          { ...this.state.customizeSaveButtonStyle, ...customizeSaveButtonStyle }
        );
        myCustomizeHideOverlayButtonStyle = Object.assign(
          {},
          { ...this.state.customizeHideOverlayButtonStyle, ...customizeHideOverlayButtonStyle }
        );
        myCustomizeModalStyle = Object.assign(
          {},
          { ...this.state.customizeModalStyle, ...customizeModalStyle }
        );
        myCustomizeOptionWrapperStyle = Object.assign(
          {},
          { ...this.state.customizeOptionWrapperStyle, ...customizeOptionWrapperStyle }
        );
        myCustomizeOptionCheckboxStyle = Object.assign(
          {},
          { ...this.state.customizeOptionCheckboxStyle, ...customizeOptionCheckboxStyle }
        );
        myCustomizeModalOptionsWrapperStyle = Object.assign(
          {},
          { ...this.state.customizeModalOptionsWrapperStyle, ...customizeModalOptionsWrapperStyle }
        );
        myCustomizeModalOptionWrapperStyle = Object.assign(
          {},
          { ...this.state.customizeModalOptionWrapperStyle, ...customizeModalOptionWrapperStyle }
        );
        myCustomizeModalOptionTextStyle = Object.assign(
          {},
          { ...this.state.customizeModalOptionTextStyle, ...customizeModalOptionTextStyle }
        );
      }
    }

    // syntactic sugar to enable user to easily select top / bottom
    switch (location) {
      case POSITION_OPTIONS.TOP:
        myStyle.top = "0";
        break;

      case POSITION_OPTIONS.BOTTOM:
        myStyle.bottom = "0";
        break;
    }

    const buttonsToRender = [];

    // add decline button
    enableDeclineButton &&
      buttonsToRender.push(
        <ButtonComponent
          key="declineButton"
          style={myDeclineButtonStyle}
          className={declineButtonClasses}
          id={declineButtonId}
          aria-label={ariaDeclineLabel}
          onClick={() => {
            this.decline();
          }}
          {...customDeclineButtonProps}
        >
          {declineButtonText}
        </ButtonComponent>
      );

    // add customize button
    enableCustomizeButton &&
      buttonsToRender.push(
        <ButtonComponent
          key="customizeButton"
          style={myCustomizeButtonStyle}
          className={customizeButtonClasses}
          id={customizeButtonId}
          aria-label={ariaCustomizeLabel}
          onClick={() => {
            this.customize();
          }}
          {...customCustomizeButtonProps}
        >
          {customizeButtonText}
        </ButtonComponent>
      );

    // add accept button
    buttonsToRender.push(
      <ButtonComponent
        key="acceptButton"
        style={myButtonStyle}
        className={buttonClasses}
        id={buttonId}
        aria-label={ariaAcceptLabel}
        onClick={() => {
          this.accept();
        }}
        {...customButtonProps}
      >
        {buttonText}
      </ButtonComponent>
    );

    if (flipButtons) {
      buttonsToRender.reverse();
    }

    return (
      <ConditionalWrapper
        condition={this.state.overlay}
        wrapper={(children) => (
          <div
            style={myOverlayStyle}
            className={overlayClasses}
            onClick={() => {
              this.overlayClick();
            }}
          >
            {children}
          </div>
        )}
      >
        <>
          {this.props.enableCustomizeButton && this.state.overlay && this.state.customize ? (
            <div style={myCustomizeModalStyle}>
              <button style={myCustomizeHideOverlayButtonStyle} onClick={() => this.hideOverlay()}>
                X
              </button>
              <h2>{customizeModalTitle}</h2>
              <div style={myCustomizeModalOptionsWrapperStyle}>
                {this.state.cookies &&
                  this.state.cookies.length > 0 &&
                  this.state.cookies.map((cookie) => (
                    <div style={myCustomizeModalOptionWrapperStyle}>
                      <div style={myCustomizeModalOptionTextStyle}>
                        <h3>{cookie.title}</h3>
                        <p>{cookie.description}</p>
                      </div>
                      <div style={myCustomizeOptionWrapperStyle}>
                        <input
                          style={myCustomizeOptionCheckboxStyle}
                          type="checkbox"
                          name={cookie.name}
                          checked={cookie.enabled}
                          onChange={(e) => this.handleCookieChange(e, cookie.name)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <div style={myCustomizeSaveWrapperStyle}>
                <button style={myCustomizeSaveButtonStyle} onClick={() => this.saveCustomize()}>
                  Save
                </button>
              </div>
            </div>
          ) : null}
          <div className={`${containerClasses}`} style={myStyle} {...customContainerAttributes}>
            <div style={myContentStyle} className={contentClasses} {...customContentAttributes}>
              {this.props.children}
            </div>
            <div className={`${buttonWrapperClasses}`} {...customButtonWrapperAttributes}>
              {buttonsToRender.map((button) => {
                return button;
              })}
            </div>
          </div>
        </>
      </ConditionalWrapper>
    );
  }
}

export default CookieConsent;

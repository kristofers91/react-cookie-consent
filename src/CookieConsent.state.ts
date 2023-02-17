export interface CookieConsentState {
  visible: boolean;
  overlay: boolean;
  customize: boolean;
  cookies: Array<{
    name: string;
    title: string;
    description: string;
    checked: boolean;
    required: boolean | undefined;
    type: string;
  }>;
  style: React.CSSProperties;
  buttonStyle: React.CSSProperties;
  declineButtonStyle: React.CSSProperties;
  customizeButtonStyle: React.CSSProperties;
  customizeSaveWrapperStyle: React.CSSProperties;
  customizeSaveButtonStyle: React.CSSProperties;
  customizeModalStyle: React.CSSProperties;
  customizeModalTitleStyle: React.CSSProperties;
  customizeHideOverlayButtonStyle: React.CSSProperties;
  customizeModalOptionsWrapperStyle: React.CSSProperties;
  customizeModalOptionWrapperStyle: React.CSSProperties;
  customizeModalOptionTextStyle: React.CSSProperties;
  customizeOptionWrapperStyle: React.CSSProperties;
  customizeOptionCheckboxStyle: React.CSSProperties;
  contentStyle: React.CSSProperties;
  overlayStyle: React.CSSProperties;
}

export const defaultState: CookieConsentState = {
  visible: false,
  overlay: false,
  customize: false,
  cookies: [],
  style: {
    alignItems: "baseline",
    background: "#353535",
    color: "white",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    left: "0",
    position: "fixed",
    width: "100%",
    zIndex: "999",
  },
  buttonStyle: {
    background: "#ffd42d",
    border: "0",
    borderRadius: "0px",
    boxShadow: "none",
    color: "black",
    cursor: "pointer",
    flex: "0 0 auto",
    padding: "5px 10px",
    margin: "15px",
  },
  declineButtonStyle: {
    background: "#c12a2a",
    border: "0",
    borderRadius: "0px",
    boxShadow: "none",
    color: "#e5e5e5",
    cursor: "pointer",
    flex: "0 0 auto",
    padding: "5px 10px",
    margin: "15px",
  },
  customizeButtonStyle: {
    background: "#c12a2a",
    border: "0",
    borderRadius: "0px",
    boxShadow: "none",
    color: "#e5e5e5",
    cursor: "pointer",
    flex: "0 0 auto",
    padding: "5px 10px",
    margin: "15px",
  },
  customizeHideOverlayButtonStyle: {
    position: "absolute",
    zIndex: "9999",
    top: "20px",
    right: "20px",
  },
  customizeModalOptionsWrapperStyle: {
    maxHeight: "500px",
    overflowY: "scroll",
  },
  customizeModalOptionWrapperStyle: {
    display: "flex",
    justifyContent: "flex-end",
  },
  customizeSaveWrapperStyle: {
    display: "flex",
    justifyContent: "flex-end",
  },
  customizeSaveButtonStyle: {
    margin: "20px",
    padding: "10px 30px",
    background: "black",
    color: "white",
  },
  customizeModalStyle: {
    background: "white",
    border: "1px solid #dfdfdf",
    minHeight: "70vh",
    display: "block",
    width: "50%",
    margin: "40px auto",
    padding: "0px 20px",
    position: "relative",
  },
  customizeModalOptionTextStyle: {
    flexGrow: 1,
    paddingRight: "20px",
  },
  customizeOptionWrapperStyle: {
    display: "flex",
    width: "100px",
    justifyContent: "end",
    paddingRight: "20px",
  },
  customizeOptionCheckboxStyle: {
    alignSelf: "center",
  },
  contentStyle: {
    flex: "1 0 300px",
    margin: "15px",
  },
  overlayStyle: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    zIndex: "999",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  customizeModalTitleStyle: {

  }
};

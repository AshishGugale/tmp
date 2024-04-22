export function NavbarStyle(color, radius) {
  return {
    margin: "10px 16px 0",
    padding: 0,
    background: color,
    textAlign: "center",
    borderRadius: radius,
  };
}

export const SiderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
};

export function ContentStyle(color, radius) {
  return {
    margin: "20px 16px 0",
    overflow: "initial",
    background: color,
    borderRadius: radius,
  };
}

export function ContentInnerDivStyle(color, radius) {
  return {
    padding: 24,
    textAlign: "center",
    background: color,
    borderRadius: radius,
    height: "100%",
    minHeight: "100vh",
  };
}

export const CardSectionStyle = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  gap: "20px",
  alignItems: "center",
  alignContent: "center",
  alignSelf: "center",
};

export const CardFlexStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "10px",
};

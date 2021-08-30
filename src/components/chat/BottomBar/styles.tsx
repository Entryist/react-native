import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  spacer: {
    width: "100%",
    maxWidth: "100%",
  },
  bar: {
    width: "100%",
    maxWidth: "100%",
  },
  barInner: {
    width: "100%",
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    zIndex: 2,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    paddingLeft: 18,
    paddingRight: 18,
    borderWidth: 1,
    fontSize: 17,
    lineHeight: 20,
  },
  sendButtonWrap: {
    width: 55,
    height: 40,
  },
  sendButton: {
    marginLeft: 7,
    width: 38,
    maxWidth: 38,
    height: 38,
    maxHeight: 38,
    borderRadius: 19,
    marginTop: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  attach: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginLeft: 8,
    marginRight: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  recordSecs: {
    flex: 1,
    paddingLeft: 10,
    minWidth: 80,
  },
  recordSecsText: {
    fontSize: 24,
  },
  recording: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
  },
  recordingCircle: {
    height: 100,
    width: 100,
    backgroundColor: "#6289FD",
    position: "absolute",
    right: -15,
    top: -15,
    borderRadius: 50,
  },
});
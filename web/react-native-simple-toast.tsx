class Toast {
  show(message: string, duration?: number, viewControllerBlacklist?: Array<string>) {
    console.log("Toast:", message)
  }
}

export default Toast

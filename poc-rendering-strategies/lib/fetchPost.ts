export async function fetchPost() {
  return {
    title: "Sample post",
    timestamp: new Date().toLocaleTimeString(),
  };
}

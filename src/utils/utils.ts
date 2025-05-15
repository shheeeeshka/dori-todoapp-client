export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const canUseShare = (): boolean => !!navigator.share;

export const handleShare = async (): Promise<void> => {
  try {
    if (canUseShare()) {
      await navigator.share({
        title: "My ToDo List",
        text: "Check out my ToDo list!",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  } catch (err) {
    console.error("Error sharing:", err);
  }
};

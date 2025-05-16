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
    const profileUrl = window.location.href.includes("profile")
      ? window.location.href
      : `${window.location.href}profile`;

    if (navigator.share) {
      await navigator.share({
        title: "My ToDo Profile",
        text: "Check out my ToDo profile!",
        url: profileUrl,
      });
    } else {
      await navigator.clipboard.writeText(profileUrl);
      alert("Profile link copied to clipboard!");
    }
  } catch (err) {
    console.error("Error sharing:", err);
  }
};

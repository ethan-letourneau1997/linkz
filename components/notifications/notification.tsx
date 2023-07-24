import { notifications } from "@mantine/notifications";

export function triggerNotification() {
  notifications.show({
    title: "Default notification",
    message: "Your post has been uploaded! 🤥",
  });
}

export function triggerShortTitleNotif() {
  notifications.show({
    title: "Error",
    message: "Your title must be at least 10 characters! 🤥",
  });
}

export function triggerNoContentNotif() {
  notifications.show({
    title: "Error",
    message: "Your post is empty!",
  });
}

export function triggerNoFileNotif() {
  notifications.show({
    title: "Error",
    message: "You have not uploaded an image!",
  });
}

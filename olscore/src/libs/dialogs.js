import { confirmAlert } from "react-confirm-alert"; // Import
import { APP_TITLE } from "../Global";

export const confirm = (
  message,
  title = APP_TITLE,
  config = {
    YesButtonText: "Yes",
    NoButtonText: "No",
  }
) => {
  return new Promise((resolve, reject) => {
    confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: config.YesButtonText,
          onClick: () => {
            resolve(true);
          },
        },
        {
          label: config.NoButtonText,
          onClick: () => {
            reject(false);
          },
        },
      ],
    });
  });
};

const dialogs = {
  confirm,
};

export default dialogs;

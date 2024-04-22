export const successNotif = (api, message, description) => {
  api.success({
    message: message,
    description: description,
    className: "custom-class",
    style: {
      width: 600,
    },
    duration: "1.5",
  });
};

export const errorNotif = (api, message, description) => {
  api.error({
    message: message,
    description: description,
    className: "custom-class",
    style: {
      width: 600,
    },
    duration: "1.5",
  });
};

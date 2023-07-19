export const buildHeaders = ({
  token,
  email,
  uid,
}: {
  token: string;
  email: string;
  uid: string;
}) => {
  return {
    Authorization: token,
    "x-user-id": uid,
    "x-user-email": email,
  };
};

export const convertCentsToFixed = (amount) => {
  if (amount === 0) return "Free";
  return (amount / 100).toFixed(2);
};

export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

import { useContext, useEffect, useState } from "react";
import { AlertContext } from "@/contexts/AlertContext";

export const AlertBox = () => {
  const [visible, setVisible] = useState(false);
  const { alertBox, setAlertBox } = useContext(AlertContext);
  const { message = "", messageType = "alert-warning" } = alertBox;

  useEffect(() => {
    if (message !== "") {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        setAlertBox({ message: "" });
      }, 5000);
    }
  }, [message]);

  return (
    <section
      className={`${
        visible ? "" : "hidden"
      } absolute bottom-32 w-[30%] ml-10 animate-pulse alert ${messageType} shadow-lg`}
    >
      <div className="mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Warning: {message}</span>
      </div>
    </section>
  );
};

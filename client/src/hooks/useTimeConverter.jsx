const useTimeConverter = () => {
  const timeConverter = (minutes) => {
    if (typeof minutes !== "number" || minutes < 0) return 0;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return (
      `${hours ? hours + "h" : ""} ${
        remainingMinutes ? remainingMinutes + "m" : ""
      }`.trim() || "0m"
    );
  };

  return { timeConverter };
};

export default useTimeConverter;

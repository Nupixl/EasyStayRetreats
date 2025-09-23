import { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/router";
import DatePicker from "../Pickers/DatePicker";
import GuestsPicker from "../Pickers/GuestsPicker";
import BtnPrimary from "../Button/BtnPrimary";
import useLabeling from "../../hooks/useLabeling";
import { guestsData } from "../../utils/miniData";
import { classNames } from "../../utils/datePickerUtils";

const buildGuestsState = (initial = {}) => ({
  adults: { ...guestsData.adults, value: Number(initial.numberOfAdults) || 0 },
  children: {
    ...guestsData.children,
    value: Number(initial.numberOfChildren) || 0,
  },
  infants: {
    ...guestsData.infants,
    value: Number(initial.numberOfInfants) || 0,
  },
  pets: { ...guestsData.pets, value: Number(initial.numberOfPets) || 0 },
});

const parseDate = (value) => {
  if (!value || value === "null") return null;
  try {
    return parseISO(value);
  } catch (_err) {
    return null;
  }
};

const SearchPanel = ({
  initialValues = {},
  buttonLabel = "Search retreats",
  className = "",
  variant = "default",
}) => {
  const router = useRouter();
  const containerRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [destination, setDestination] = useState(initialValues.destination || "");
  const [selectedDay, setSelectedDay] = useState(parseDate(initialValues.checkin));
  const [selectEnd, setSelectEnd] = useState(parseDate(initialValues.checkout));
  const [guests, setGuests] = useState(() => buildGuestsState(initialValues));

  const result = useLabeling(guests);

  useEffect(() => {
    setDestination(initialValues.destination || "");
    setSelectedDay(parseDate(initialValues.checkin));
    setSelectEnd(parseDate(initialValues.checkout));
    setGuests(buildGuestsState(initialValues));
  }, [
    initialValues.checkin,
    initialValues.checkout,
    initialValues.destination,
    initialValues.numberOfAdults,
    initialValues.numberOfChildren,
    initialValues.numberOfInfants,
    initialValues.numberOfPets,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelection(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelection(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const submit = () => {
    router.push(
      `/s/${destination || "_"}?numberOfAdults=${
        guests.adults.value
      }&numberOfChildren=${guests.children.value}&numberOfInfants=${
        guests.infants.value
      }&numberOfPets=${guests.pets.value}&checkin=${
        selectedDay ? format(selectedDay, "yyyy-MM-dd") : null
      }&checkout=${selectEnd ? format(selectEnd, "yyyy-MM-dd") : null}`
    );
    setSelection(null);
  };

  const panelClasses = useMemo(() => {
    const base =
      "relative flex flex-col gap-3 rounded-3xl border border-lightBorderColor bg-white p-4 shadow-lg sm:flex-row sm:items-stretch";

    if (variant === "hero") {
      return `${base} sm:gap-0 sm:p-2 sm:pr-3 backdrop-blur-lg bg-white/95 shadow-xl`;
    }

    if (variant === "compact") {
      return `${base} sm:gap-0 sm:p-1`;
    }

    return base;
  }, [variant]);

  const segmentClasses = (active) =>
    classNames(
      "flex flex-1 cursor-pointer select-none flex-col rounded-2xl px-4 py-3 transition sm:min-w-[170px]",
      active ? "bg-surfaceMuted shadow" : "hover:bg-surfaceMuted"
    );

  const separator = (
    <span className="hidden h-10 w-px self-center border-l border-lightBorderColor sm:block" />
  );

  return (
    <div ref={containerRef} className={classNames("relative", className)}>
      <div className={panelClasses}>
        <button
          type="button"
          className={segmentClasses(selection === "destination")}
          onClick={() => setSelection((prev) => (prev === "destination" ? null : "destination"))}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-lightTextColor">
            Where
          </span>
          <span className="truncate text-left text-sm font-semibold text-blackColor">
            {destination || "Search destinations"}
          </span>
        </button>

        {separator}

        <button
          type="button"
          className={segmentClasses(selection === "dates")}
          onClick={() => setSelection((prev) => (prev === "dates" ? null : "dates"))}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-lightTextColor">
            When
          </span>
          <span className="text-left text-sm font-semibold text-blackColor">
            {selectedDay && selectEnd
              ? `${format(selectedDay, "MMM dd")} - ${format(selectEnd, "MMM dd")}`
              : "Add dates"}
          </span>
        </button>

        {separator}

        <button
          type="button"
          className={segmentClasses(selection === "guests")}
          onClick={() => setSelection((prev) => (prev === "guests" ? null : "guests"))}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-lightTextColor">
            Who
          </span>
          <span className="text-left text-sm font-semibold text-blackColor">
            {result || "Add guests"}
          </span>
        </button>

        <div className="flex w-full items-center justify-end sm:w-auto sm:flex-none">
          <BtnPrimary
            onClick={submit}
            rounded
            dark={false}
            style={{ background: "#1f7a8c", backgroundImage: "none" }}
          >
            {buttonLabel}
          </BtnPrimary>
        </div>
      </div>

      {selection === "destination" && (
        <div className="absolute z-30 mt-2 w-full max-w-xl rounded-3xl border border-lightBorderColor bg-white p-4 shadow-xl sm:w-[360px]">
          <label htmlFor="search-destination" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-lightTextColor">
            Destination
          </label>
          <input
            id="search-destination"
            type="text"
            value={destination}
            autoFocus
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Search by city, region, or landmark"
            className="w-full rounded-2xl border border-lightBorderColor px-4 py-3 text-sm font-medium text-blackColor outline-none focus:border-primaryColor"
          />
        </div>
      )}

      {selection === "dates" && (
        <div className="absolute z-40 mt-4 w-full max-w-3xl -translate-x-1/2 rounded-3xl border border-lightBorderColor bg-white p-6 shadow-2xl sm:left-1/2">
          <DatePicker
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectEnd={selectEnd}
            setSelectEnd={setSelectEnd}
          />
        </div>
      )}

      {selection === "guests" && (
        <div className="absolute z-30 mt-4 w-full max-w-sm rounded-3xl border border-lightBorderColor bg-white p-4 shadow-2xl sm:right-0">
          <GuestsPicker guests={guests} setGuests={setGuests} />
        </div>
      )}
    </div>
  );
};

export default SearchPanel;

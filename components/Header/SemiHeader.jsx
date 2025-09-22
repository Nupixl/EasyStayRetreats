const HeaderSelection = ({ headerSearch }) => {
  return (
    <div
      className={`${
        headerSearch ? "semi_header_active" : "semi_header_inactive"
      }`}
    >
      <div className="flex h-full gap-4 mx-auto">
        <button className="p-2 text-sm text-lightTextColor border-b-2 border-primaryColor font-medium">
          Retreats
        </button>
        <button className="p-2 text-sm text-lightTextColor hover:text-primaryColor transition-colors">
          Corporate escapes
        </button>
        <button className="p-2 text-sm text-lightTextColor hover:text-primaryColor transition-colors">
          Wellness breaks
        </button>
      </div>
    </div>
  );
};

export default HeaderSelection;

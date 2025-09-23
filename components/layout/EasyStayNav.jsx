import { NavBar } from "../../devlink/NavBar";

const EasyStayNav = ({ className = "" }) => {
  return (
    <div className={className}>
      <NavBar />
      {/* Spacer keeps main content from sitting under the fixed Webflow nav */}
      <div aria-hidden="true" className="h-[65px] lg:h-20" />
    </div>
  );
};

export default EasyStayNav;

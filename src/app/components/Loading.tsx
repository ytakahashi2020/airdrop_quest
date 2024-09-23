import { GiPentacle } from "react-icons/gi";

/**
 * Loading Component
 */
const Loading = () => {
  return (
    <div className="w-24 h-24 mx-auto">
      <GiPentacle className="animate-spin" size={100} />
      <br/>
      Now Loading...
    </div>
  );
}

export default Loading;
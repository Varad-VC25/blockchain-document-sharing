import { FiLoader } from "react-icons/fi";

const Loader = ({ size = "md", fullScreen = false, text = "" }) => {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12", xl: "w-16 h-16" };
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <FiLoader className={sizes[size] + " animate-spin text-primary-600"} />
      {text && <p className="text-sm text-dark-500 dark:text-dark-400 font-medium">{text}</p>}
    </div>
  );
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-950/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }
  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default Loader;

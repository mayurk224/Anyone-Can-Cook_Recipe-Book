const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-solid"></div>
    </div>
  );
};

export default Spinner;
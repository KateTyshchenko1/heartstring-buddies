const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 animate-float">
            <span className="text-3xl text-primary">❤️</span>
          </div>
        </div>
        <p className="text-gray-600 font-medium">Adding the perfect amount of mystery... ✨</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
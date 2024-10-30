const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* First floating heart */}
          <div className="absolute left-0 animate-[float_3s_ease-in-out_infinite]">
            <span className="text-3xl text-primary">❤️</span>
          </div>
          {/* Second floating heart */}
          <div className="absolute left-1/2 -translate-x-1/2 animate-[float_2.5s_ease-in-out_infinite_0.5s]">
            <span className="text-3xl text-primary">❤️</span>
          </div>
          {/* Third floating heart */}
          <div className="absolute right-0 animate-[float_3.5s_ease-in-out_infinite_1s]">
            <span className="text-3xl text-primary">❤️</span>
          </div>
        </div>
        <p className="text-gray-600 font-medium">Adding the perfect amount of mystery... ✨</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
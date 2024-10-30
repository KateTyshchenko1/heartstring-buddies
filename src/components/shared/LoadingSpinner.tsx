const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary animate-[spin_1.5s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl animate-[bounce_2s_ease-in-out_infinite]">
            ✨
          </div>
        </div>
        <p className="text-gray-600 font-medium">Adding the perfect amount of mystery... ✨</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
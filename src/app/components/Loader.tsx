import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className="animate-spin rounded-full h-15 w-15 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
};

export default Loader;
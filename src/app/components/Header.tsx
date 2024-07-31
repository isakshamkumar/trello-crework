import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Search, CalendarDays, Sparkles, Filter, Share2, Plus, CircleHelp } from 'lucide-react';
import Image from "next/image"
interface HeaderProps {
  onCreateNew: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateNew }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
      <h1 className="text-4xl font-semibold mb-4 text-gray-800">
          Good morning, {user?.fullName || 'User'}!
        </h1>
        <div className="flex gap-2 mb-4 text-gray-800">
          Help & Feedback
          <CircleHelp size={20} />
        </div>
      </div>
      <div className="flex justify-center items-center gap-4">
        {['tags', 'share', 'access'].map((feature) => (
          <div
            key={feature}
            className="bg-white p-2 rounded-lg mb-4 h-[10rem] flex-1 flex gap-2 justify-center items-center"
          >
            <Image
            height={16}
            width={20}
              src={`/header-${feature}.png`}
              alt={`header-${feature}`}
              className="w-20 h-16"
            />
            <div className="flex flex-col gap-2 m-0">
              <h3 className="text-gray-500 font-semibold">
                {feature === 'tags' && 'Introducing tags'}
                {feature === 'share' && 'Share Notes Instantly'}
                {feature === 'access' && 'Access Anywhere'}
              </h3>
              <p className="text-gray-500 font-normal">
                {feature === 'tags' &&
                  'Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient.'}
                {feature === 'share' &&
                  'Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options.'}
                {feature === 'access' &&
                  'Sync your notes across all devices. Stay productive whether you\'re on your phone, tablet, or computer.'}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search"
            className="w-[250px] border rounded-lg pl-2 pr-3 py-2 text-gray-700"
          />
          <Search
            size={20}
            className="absolute left-[13.5rem] top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        {['Calendar view', 'Automation', 'Filter', 'Share'].map((button, index) => (
          <button
            key={button}
            className="bg-transparent px-3 py-2 rounded-md text-gray-500 flex gap-2 items-center"
          >
            {button}
            {index === 0 && <CalendarDays size={20} className="mr-2" />}
            {index === 1 && <Sparkles size={20} className="mr-2" />}
            {index === 2 && <Filter size={20} className="mr-2" />}
            {index === 3 && <Share2 size={20} className="mr-2" />}
          </button>
        ))}
        <button
          onClick={onCreateNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex gap-2 items-center"
        >
          Create new
          <Plus
            size={24}
            className="mr-2 bg-white text-black rounded-full p-1"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CogIcon, 
  EnvelopeIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const EventManagementLayout = ({ event, children }) => {
  const tabs = [
    { name: 'Overview', icon: DocumentTextIcon },
    { name: 'Insights', icon: ChartBarIcon },
    { name: 'Guest List', icon: UsersIcon },
    { name: 'Email Blast', icon: EnvelopeIcon },
    { name: 'Settings', icon: CogIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="max-w-[2000px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <p className="text-gray-400 mt-2">Event Management</p>
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-800 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                     ${selected 
                       ? 'bg-blue-600 text-white shadow'
                       : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                     }
                     flex items-center justify-center space-x-2`
                  }
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-6">
              {children}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default EventManagementLayout; 
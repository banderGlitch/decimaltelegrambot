import React , { useEffect , useState } from 'react';
import { getTasks } from '../services/api';


interface Task {
    id: string;
    action: string;
    callbackUrl: string;
    reward: number;
    status: boolean;
    title: string;
    type: string;
  }
  


const Earn: React.FC = () => {

    const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);  // Ensure fetchedTasks is of type Task[]
        console.log('tasks-------------->', fetchedTasks);
      } catch (err) {
        // setError('Error fetching tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        // setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getIconForTaskType = (type: string): string => {
    switch (type) {
      case '1':
        return '𝕏'; // Twitter or social media tasks
      case '2':
        return '👥'; //Tg, Youtube, Instagram, Discord, Whatsapp
      default:
        return '🔹'; // Default icon for unknown task types
    }
  };
  const handleTaskAction = (callbackUrl: string) => {
    window.open(callbackUrl, '_blank', 'noopener,noreferrer');
    console.log("callbackUrl-------------->", callbackUrl);
  };

  return (
    <div className="flex-grow mt-4 ml-4 mr-4 bg-[#1d2025] rounded-t-[48px] p-7 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <h2 className="text-2xl text-white font-bold mb-1">Earn Coins</h2>
      <p className="text-gray-300 mb-4">Complete tasks to earn more coins!</p>
      {tasks.length === 0 ? (
        <p className="text-white text-center">No tasks available at the moment.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-purple-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-4">{getIconForTaskType(task.type)}</span>
                <div>
                  <h2 className="text-m font-semibold text-white">{task.title}</h2>
                  <p className="text-yellow-400 text-sm font-bold">+{task.reward} coins</p>
                </div>
              </div>
              <button 
                className={`${
                  task.status ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'
                } text-white font-bold py-2 px-4 rounded transition duration-300`}
                onClick={() => task.status && handleTaskAction(task.callbackUrl)}
              >
                {task.action}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Earn;

// import React , { useEffect } from 'react';
// import { getTasks } from '../services/api';


// interface Task {
//   id: string;
//   icon: string;
//   title: string;
//   reward: number;
//   action: string;
// }

// const tasks: Task[] = [
//   { id: '1', icon: '🚀', title: 'Daily Login Streak', reward: 500, action: 'Claim' },
//   { id: '2', icon: '🎮', title: 'Play 5 Games', reward: 1000, action: 'Play' },
//   { id: '3', icon: '🤝', title: 'Invite a Friend', reward: 2000, action: 'Invite' },
//   { id: '4', icon: '📢', title: 'Share on Social Media', reward: 1500, action: 'Share' },
//   { id: '5', icon: '🏆', title: 'Complete Daily Challenge', reward: 3000, action: 'Start' },
// ];

// const Earn: React.FC = () => {

//     useEffect(() => {
//         const fetchTasks = async () => {
//           try {
//             const tasks = await getTasks();
//             console.log("tasks-------------->", tasks);
//           } catch (error) {
//             console.error('Error fetching tasks:', error);
//           }
//         };
//         fetchTasks();
//       }, []);
//   return (
//     <div className="flex-grow mt-4 ml-4 mr-4 bg-[#1d2025] rounded-t-[48px] p-7 max-h-[calc(100vh-6rem)] overflow-y-auto">
//       <h2 className="text-2xl text-white font-bold mb-1">Earn Coins</h2>
//       <p className="text-gray-300 mb-4">Complete tasks to earn more coins!</p>
//       <div className="space-y-4">
//         {tasks.map((task) => (
//           <div key={task.id} className="bg-purple-800 rounded-lg p-4 flex items-center justify-between">
//             <div className="flex items-center">
//               <span className="text-2xl mr-4">{task.icon}</span>
//               <div>
//                 <h2 className="text-sm font-semibold text-white">{task.title}</h2>
//                 <p className="text-yellow-400 font-semibold text-sm">+{task.reward} coins</p>
//               </div>
//             </div>
//             <button className="bg-purple-600 hover:bg-purple-700 text-sm text-white font-bold py-2 px-4 rounded transition duration-300">
//               {task.action}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Earn;

// import React from 'react';

// const Earn: React.FC = () => {
//   return (
//     <div className="flex-grow mt-4 ml-4 mr-4 bg-[#1d2025] rounded-t-[48px] p-7">
//       <h2 className="text-2xl text-white font-bold mb-4">Earn Coins</h2>
//       <p className="text-gray-300">Complete tasks to earn more coins!</p>
//       {/* Add more content for the Earn screen here */}
//       <EarnPage />
//     </div>
//   );
// };

// export default Earn;




// interface Task {
//     id: string;
//     icon: string;
//     title: string;
//     reward: number;
//     action: string;
// }


// const EarnPage: React.FC = () => {
//     const tasks: Task[] = [
//       { id: '1', icon: '🚀', title: 'Daily Login Streak', reward: 500, action: 'Claim' },
//       { id: '2', icon: '🎮', title: 'Play 5 Games', reward: 1000, action: 'Play' },
//       { id: '3', icon: '🤝', title: 'Invite a Friend', reward: 2000, action: 'Invite' },
//       { id: '4', icon: '📢', title: 'Share on Social Media', reward: 1500, action: 'Share' },
//       { id: '5', icon: '🏆', title: 'Complete Daily Challenge', reward: 3000, action: 'Start' },
//     ];
  
//     return (
//       <div className="bg-purple-900 max-h-screen overflow-y-auto">
//         <div className="space-y-4">
//           {tasks.map((task) => (
//             <div key={task.id} className="bg-purple-800 rounded-lg p-4 flex items-center justify-between">
//               <div className="flex items-center">
//                 <span className="text-4xl mr-4">{task.icon}</span>
//                 <div>
//                   <h2 className="text-xl font-semibold text-white">{task.title}</h2>
//                   <p className="text-yellow-400 font-bold">+{task.reward} coins</p>
//                 </div>
//               </div>
//               <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
//                 {task.action}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };
  
 


import {useState , useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../stores/store';
  import { getTasks } from '../services/api';

interface Task {
    _id: string;
    action: string;
    callbackUrl: string;
    reward: number;
    status: boolean;
    title: string;
    type: string;
}

export default function Earn() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getTasks();
        setTasks(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } 
    };
    fetchTasks();
  }, []);

  const handleTaskAction = (task: Task) => {
    console.log("task", task);

  };

  const handleVerifyTask = async (task: Task) => {
    console.log("task", task);
  };

  const hippoData = useSelector((state: RootState) => state.hippo.hippodata);
  return (
    <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative z-0">
    <div className="bg-[#1d2025] rounded-t-[46px] overflow-hidden p-4 flex flex-col h-full">
      <div className="text-white mb-4">
        <h2 className="text-xl font-bold mb-2">Earn Coins</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>Telegram ID: {hippoData?.telegramId}</p>
          <p>Points: {hippoData?.points}</p>
          <p>Level: {hippoData?.level}</p>
          <p>Clicks: {hippoData?.clickCount}</p>
          <p>Streak: {hippoData?.streakCount}</p>
          <p>Happiness: {hippoData?.happinessIndex}</p>
          <p>Combo Bonus: {hippoData?.comboBonus}</p>
          <p>Purchased Upgrades: {hippoData?.purchasedUpgrades}</p>
        </div>
        {tasks.length === 0 ? (
        <p className="text-white text-center">No tasks available at the moment.</p>
      ) : (
        <div className="space-y-4 pt-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-purple-800 rounded-lg px-3 py-2 flex items-center justify-between">
              <div className="flex items-center">
                <img src={task.type} alt={task.title} className="w-10 h-10 mr-4" />
                <div>
                  <h2 className="text-m font-semibold text-white">{task.title}</h2>
                  <p className="text-yellow-400 text-sm font-bold">+{task.reward} coins</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-col ">
              <button 
                className={`${
                  task.status ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'
                } text-white w-full font-bold py-1 px-4  rounded transition duration-300`}
                onClick={() => task.status && handleTaskAction(task)}
              >
                Link
              </button>
              <button 
                className={`${
                  task.status ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'
                } text-white w-full font-bold py-1 px-4 rounded transition duration-300`}
                onClick={() => task.status && handleVerifyTask(task)}
              >
                Verify
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  </div>
  )
}

// import React , { useEffect , useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getTasks , completeTask } from '../services/api';
// import { addCoins } from '../stores/slices/userSlice';
// import { RootState } from '../stores/store';

// interface Task {
//     _id: string;
//     action: string;
//     callbackUrl: string;
//     reward: number;
//     status: boolean;
//     title: string;
//     type: string;
//   }
  


// const Earn: React.FC = () => {

//     const [tasks, setTasks] = useState<Task[]>([]);
//     const dispatch = useDispatch();
//     const user = useSelector((state: RootState) => state.user.user);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);

// const fetchTasks = async () => {
//     try {
//       const fetchedTasks = await getTasks();
//       setTasks(fetchedTasks);
//     } catch (err) {
//       console.error('Error fetching tasks:', err);
//     }
//   };
//  // api to get the tasks 
//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // useEffect(() => {
//   //   const handleTaskCompletion = async () => {
//   //     const urlParams = new URLSearchParams(window.location.search);
//   //     const taskId = urlParams.get('taskId');
//   //     const completed = urlParams.get('completed');

//   //     if (taskId && completed === 'true') {
//   //       const task = tasks.find(t => t.id === taskId);
//   //       if (task && task.status) {
//   //         try {
//   //           await updateTaskStatus(taskId, false);
//   //           dispatch(addCoins(task.reward));
//   //           await fetchTasks(); // Refresh tasks
//   //         } catch (error) {
//   //           console.error('Error updating task status:', error);
//   //         }
//   //       }
//   //     }
//   //   };

//   //   handleTaskCompletion();
//   // }, [tasks, dispatch]);

//   // const handleTaskAction = (task: Task) => {
//   //   const taskUrl = new URL(task.callbackUrl);
//   //   taskUrl.searchParams.append('taskId', task.id);
//   //   window.open(taskUrl.toString(), '_blank', 'noopener,noreferrer');
//   // };

//   // useEffect(() => {
//   //   const handleTaskCompletion = async () => {
//   //     const urlParams = new URLSearchParams(window.location.search);
//   //     const taskId = urlParams.get('taskId');
  
//   //     if (taskId) {
//   //       const task = tasks.find(t => t._id === taskId);
//   //       if (task && task.status) {
//   //         try {
//   //           await updateTaskStatus(taskId, false);
//   //           dispatch(addCoins(task.reward));
//   //           await fetchTasks(); // Refresh tasks
            
//   //           // Clear the taskId from the URL
//   //           window.history.replaceState({}, document.title, window.location.pathname);
//   //         } catch (error) {
//   //           console.error('Error updating task status:', error);
//   //         }
//   //       }
//   //     }
//   //   };
  
//   //   handleTaskCompletion();
//   // }, [tasks, dispatch]);


//   // const handleTaskAction = (task: Task) => {
//   //   console.log("task", task);
//   //   // Construct the task URL
//   //   const currentUrl = new URL(window.location.href);
//   //   console.log("taskId", task._id);
//   //   currentUrl.searchParams.set('taskId', task._id);
//   //   window.history.replaceState({}, document.title, currentUrl.toString());
//   //   console.log("currentUrl.toString()", currentUrl.toString());
    
//   //   // Open the task URL in the same window
//   //   window.open(task.callbackUrl, '_blank', 'noopener,noreferrer');

//   //   // window.location.href = task.callbackUrl;
//   // };


//   const handleTaskAction = (task: Task) => {
//     console.log("task", task);
//     window.open(task.callbackUrl, '_blank', 'noopener,noreferrer');
//     // window.location.href = task.callbackUrl;
//   };

//   const handleVerifyTask = async (task: Task) => {
//     console.log("task", task);
//     console.log("user", user?.telegramId);
//     const taskUpdate = await completeTask({ telegramId: user?.telegramId as unknown as number, taskId: task._id, is_completed: true});
//     dispatch(addCoins(task.reward));
//     console.log("taskUpdate", taskUpdate);
   
//     // window.location.href = task.callbackUrl;
//   };



//   return (
//     <div className="flex-grow mt-4 ml-4 mr-4 bg-[#1d2025] rounded-t-[48px] p-7 max-h-[calc(100vh-6rem)] overflow-y-auto">
//       <h2 className="text-2xl text-white font-bold mb-1">Earn Coins</h2>
//       <p className="text-gray-300 mb-4">Complete tasks to earn more coins!</p>
//       {tasks.length === 0 ? (
//         <p className="text-white text-center">No tasks available at the moment.</p>
//       ) : (
//         <div className="space-y-4">
//           {tasks.map((task) => (
//             <div key={task._id} className="bg-purple-800 rounded-lg px-3 py-2 flex items-center justify-between">
//               <div className="flex items-center">
//                 <img src={task.type} alt={task.title} className="w-10 h-10 mr-4" />
//                 {/* <span className="text-2xl mr-4">{getIconForTaskType(task.type)}</span> */}
//                 <div>
//                   <h2 className="text-m font-semibold text-white">{task.title}</h2>
//                   <p className="text-yellow-400 text-sm font-bold">+{task.reward} coins</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-1.5 flex-col ">
//               <button 
//                 className={`${
//                   task.status ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'
//                 } text-white w-full font-bold py-1 px-4  rounded transition duration-300`}
//                 onClick={() => task.status && handleTaskAction(task)}
//               >
//                 Link
//               </button>
//               <button 
//                 className={`${
//                   task.status ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'
//                 } text-white w-full font-bold py-1 px-4 rounded transition duration-300`}
//                 onClick={() => task.status && handleVerifyTask(task)}
//               >
//                 Verify
//               </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Earn;

// // import React , { useEffect } from 'react';
// // import { getTasks } from '../services/api';


// // interface Task {
// //   id: string;
// //   icon: string;
// //   title: string;
// //   reward: number;
// //   action: string;
// // }

// // const tasks: Task[] = [
// //   { id: '1', icon: '🚀', title: 'Daily Login Streak', reward: 500, action: 'Claim' },
// //   { id: '2', icon: '🎮', title: 'Play 5 Games', reward: 1000, action: 'Play' },
// //   { id: '3', icon: '🤝', title: 'Invite a Friend', reward: 2000, action: 'Invite' },
// //   { id: '4', icon: '📢', title: 'Share on Social Media', reward: 1500, action: 'Share' },
// //   { id: '5', icon: '🏆', title: 'Complete Daily Challenge', reward: 3000, action: 'Start' },
// // ];

// // const Earn: React.FC = () => {

// //     useEffect(() => {
// //         const fetchTasks = async () => {
// //           try {
// //             const tasks = await getTasks();
// //             console.log("tasks-------------->", tasks);
// //           } catch (error) {
// //             console.error('Error fetching tasks:', error);
// //           }
// //         };
// //         fetchTasks();
// //       }, []);
// //   return (
// //     <div className="flex-grow mt-4 ml-4 mr-4 bg-[#1d2025] rounded-t-[48px] p-7 max-h-[calc(100vh-6rem)] overflow-y-auto">
// //       <h2 className="text-2xl text-white font-bold mb-1">Earn Coins</h2>
// //       <p className="text-gray-300 mb-4">Complete tasks to earn more coins!</p>
// //       <div className="space-y-4">
// //         {tasks.map((task) => (
// //           <div key={task.id} className="bg-purple-800 rounded-lg p-4 flex items-center justify-between">
// //             <div className="flex items-center">
// //               <span className="text-2xl mr-4">{task.icon}</span>
// //               <div>
// //                 <h2 className="text-sm font-semibold text-white">{task.title}</h2>
// //                 <p className="text-yellow-400 font-semibold text-sm">+{task.reward} coins</p>
// //               </div>
// //             </div>
// //             <button className="bg-purple-600 hover:bg-purple-700 text-sm text-white font-bold py-2 px-4 rounded transition duration-300">
// //               {task.action}
// //             </button>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Earn;

// // import React from 'react';

// // const Earn: React.FC = () => {
// //   return (
// //     <div className="flex-grow mt-4 ml-4 mr-4 bg-[#1d2025] rounded-t-[48px] p-7">
// //       <h2 className="text-2xl text-white font-bold mb-4">Earn Coins</h2>
// //       <p className="text-gray-300">Complete tasks to earn more coins!</p>
// //       {/* Add more content for the Earn screen here */}
// //       <EarnPage />
// //     </div>
// //   );
// // };

// // export default Earn;




// // interface Task {
// //     id: string;
// //     icon: string;
// //     title: string;
// //     reward: number;
// //     action: string;
// // }


// // const EarnPage: React.FC = () => {
// //     const tasks: Task[] = [
// //       { id: '1', icon: '🚀', title: 'Daily Login Streak', reward: 500, action: 'Claim' },
// //       { id: '2', icon: '🎮', title: 'Play 5 Games', reward: 1000, action: 'Play' },
// //       { id: '3', icon: '🤝', title: 'Invite a Friend', reward: 2000, action: 'Invite' },
// //       { id: '4', icon: '📢', title: 'Share on Social Media', reward: 1500, action: 'Share' },
// //       { id: '5', icon: '🏆', title: 'Complete Daily Challenge', reward: 3000, action: 'Start' },
// //     ];
  
// //     return (
// //       <div className="bg-purple-900 max-h-screen overflow-y-auto">
// //         <div className="space-y-4">
// //           {tasks.map((task) => (
// //             <div key={task.id} className="bg-purple-800 rounded-lg p-4 flex items-center justify-between">
// //               <div className="flex items-center">
// //                 <span className="text-4xl mr-4">{task.icon}</span>
// //                 <div>
// //                   <h2 className="text-xl font-semibold text-white">{task.title}</h2>
// //                   <p className="text-yellow-400 font-bold">+{task.reward} coins</p>
// //                 </div>
// //               </div>
// //               <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
// //                 {task.action}
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   };
  
 


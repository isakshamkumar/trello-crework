import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

const TaskBoard = dynamic(() => import('./components/TaskBoard'), { ssr: false });
const Home= () => {
return <TaskBoard/>
}

export default Home
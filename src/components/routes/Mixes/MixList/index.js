import React from 'react';

// React Web
import Mix from '../../../Mix';

// Redux
import { useSelector } from 'react-redux';

function MixList({ mixes, sounds, userId, usernames }) {
  const userMixes = useSelector((state) => state.user.mixes);
  const mixesArray = Object.keys(mixes)
    .map((key) => mixes[key])
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className='mt-5'>
      {mixesArray.map((mix) => (
        <Mix
          key={mix.id}
          mix={mix}
          sounds={sounds}
          userId={userId}
          userMix={userMixes[mix.id]}
          usernames={usernames}
        />
      ))}
    </div>
  );
}

export default MixList;

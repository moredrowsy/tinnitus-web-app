import React from 'react';

// React Web
import AddMix from './AddMix';
import MixList from './MixList';

// Redux
import { useSelector } from 'react-redux';
import { selectMixes } from '../../../store/redux/slices/mixes';
import { selectSounds } from '../../../store/redux/slices/sounds';

const Mixes = ({ userId, usernames, userVotes }) => {
  const sounds = useSelector(selectSounds);
  const mixes = useSelector(selectMixes);

  return (
    <div className='m-5'>
      <AddMix sounds={sounds} userId={userId} />
      <MixList
        mixes={mixes}
        sounds={sounds}
        userId={userId}
        usernames={usernames}
        userVotes={userVotes}
      />
    </div>
  );
};

export default Mixes;

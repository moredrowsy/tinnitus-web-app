import React, { useState } from 'react';

// React Web
import { ArrowCircleUpIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import NeedAuthedUserMsg from '../../NeedAuthedUserMsg';
import { audioTrim } from '../../../utils';
import { blobToDataURL } from '../../../utils';

// Redux
import { useDispatch } from 'react-redux';
import { addSound } from '../../../store/redux/slices/sounds';
import { addSoundFile } from '../../../store/redux/slices/soundFiles';
import { updateUserSoundsAsync } from '../../../store/redux/slices/user';

// Firebase
import { db } from '../../../store/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

import { TAGS, VOLUME } from '../../../constants';

const Upload = ({ addPlayer, user }) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let eFiles = null;
    if (e.dataTransfer && e.dataTransfer.files) {
      eFiles = e.dataTransfer.files;
    } else if (e.target && e.target.files) {
      eFiles = e.target.files;
    }

    if (eFiles) {
      for (const file of eFiles) {
        if (file.type === 'audio/mpeg') {
          setLoading(true);

          if (file.size > 1000000) {
            const blob = await audioTrim(file, 0, 30);
            files[file.name] = {
              type: 'Blob',
              data: blob,
              title: file.name,
              tags: new Set(),
              status: 'none',
            };
          } else {
            files[file.name] = {
              type: 'File',
              data: file,
              title: file.name,
              tags: new Set(),
              status: 'none',
            };
          }

          setFiles({ ...files });
          setLoading(false);
        }
      }
    }
  };

  const uploadFiles = async () => {
    for (const [filename, file] of Object.entries(files)) {
      if (file.status !== 'uploaded') {
        // update file on client to 'uploading' status
        files[filename] = { ...file, status: 'uploading' };
        setFiles({ ...files });

        // add sound file to firebase storage
        const storage = getStorage();
        const storagePath = `sounds/${user.uid}/${filename}`;
        const soundPathRef = ref(storage, storagePath);
        await uploadBytes(soundPathRef, file.data);

        // Add to player storage locally
        const dataURL = await blobToDataURL(file.data);
        addPlayer({ storageKey: storagePath, dataURL, volume: VOLUME.default });

        // add sounds to firebase database;
        const sound = {
          authorId: user.uid,
          title: file.title,
          filename: filename,
          timestamp: Date.now(),
          storagePath,
          tags: Array.from(files[filename].tags),
          votes: 1,
        };
        const docRef = await addDoc(collection(db, 'sounds'), sound);
        sound.id = docRef.id;
        dispatch(addSound({ sound }));
        const storageKey = `sounds/${user.uid}/${file.name}`;
        dispatch(addSoundFile({ storageKey }));

        const userSound = {
          vote: 1,
          volume: VOLUME.default,
        };

        // update user's sound array to firebase database
        dispatch(
          updateUserSoundsAsync({
            userId: user.uid,
            soundId: docRef.id,
            userSound,
          })
        );

        // update file on client to 'uploaded' status
        files[filename] = { ...file, status: 'uploaded' };
        setFiles({ ...files });
      }
    }
  };

  const onChangeFileTitle = (ev, filename) => {
    files[filename].title = ev.target.value;
    setFiles({ ...files });
  };

  const onToggleFileTag = (filename, tag) => {
    const tags = files[filename].tags;

    if (tags.has(tag)) {
      tags.delete(tag);
    } else {
      tags.add(tag);
    }

    setFiles({ ...files });
  };

  if (!user) {
    return (
      <NeedAuthedUserMsg authed={user ? true : false} msg='to upload sounds' />
    );
  }

  return (
    <div className='m-5'>
      <div
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <label className='block m-5 text-md text-center font-medium text-gray-700'>
          Upload audio files
        </label>
        <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
          <div className='space-y-1 text-center'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              stroke='currentColor'
              fill='none'
              viewBox='0 0 48 48'
              aria-hidden='true'
            >
              <path
                d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <div className='flex text-sm text-gray-600'>
              <label
                htmlFor='file-upload'
                className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
              >
                <span>Upload a file</span>
                <input
                  id='file-upload'
                  name='file-upload'
                  type='file'
                  className='sr-only'
                  onChange={(e) => handleDrop(e)}
                />
              </label>
              <p className='pl-1'>or drag and drop</p>
            </div>
            <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>

      {Object.keys(files).length > 0 && (
        <div>
          <div className='text-center m-5'>
            <button
              className='inline-block bg-gray-200  hover:bg-gray-400 hover:text-white font-semibold px-3 py-1 rounded-md text-md text-gray-700'
              onClick={uploadFiles}
            >
              Upload Files
            </button>
          </div>

          <div className='relative overflow-x-auto shadow-md sm:rounded-lg '>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    File name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Title
                  </th>
                  <th scope='col' className='px-6 py-3 text-right'>
                    Size (bytes)
                  </th>
                  <th scope='col' className='px-6 py-3 text-right'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(files).map((filename) => {
                  let statusIcon;

                  if (files[filename].status === 'uploading') {
                    statusIcon = (
                      <svg
                        role='status'
                        className='inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-red-600'
                        viewBox='0 0 100 101'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                          fill='currentColor'
                        />
                        <path
                          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                          fill='currentFill'
                        />
                      </svg>
                    );
                  } else if (files[filename].status === 'uploaded') {
                    statusIcon = (
                      <CheckCircleIcon
                        className='h-6 w-6 fill-green-600'
                        aria-hidden='true'
                      />
                    );
                  } else {
                    statusIcon = (
                      <ArrowCircleUpIcon
                        className='h-6 w-6'
                        aria-hidden='true'
                      />
                    );
                  }

                  return (
                    <React.Fragment key={filename}>
                      <tr className='bg-white  dark:bg-gray-800 dark:border-gray-700'>
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'
                        >
                          {filename}
                        </th>
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'
                        >
                          <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type='text'
                            placeholder='title'
                            value={files[filename].title}
                            onChange={(ev) => onChangeFileTitle(ev, filename)}
                          />
                        </th>
                        <td className='px-6 py-4 text-right'>
                          {files[filename].data.size}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <div className='flex justify-end'>{statusIcon}</div>
                        </td>
                      </tr>
                      <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                        <th
                          colSpan={4}
                          scope='row'
                          className='px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'
                        >
                          <div className='flex gap-1'>
                            {TAGS.map((tag) => {
                              const hasTag = files[filename].tags.has(tag);
                              let className =
                                'inline-block font-semibold px-3 py-1 rounded-full text-md hover:bg-gray-400 hover:text-white';
                              const unSelectedColors =
                                'bg-gray-200 text-gray-700';
                              const selectedColors = 'bg-gray-400 text-white';

                              if (hasTag) {
                                className = `${className} ${selectedColors}`;
                              } else {
                                className = `${className} ${unSelectedColors}`;
                              }

                              return (
                                <div
                                  key={tag}
                                  className={'text-center select-none'}
                                >
                                  <button
                                    className={className}
                                    onClick={() =>
                                      onToggleFileTag(filename, tag)
                                    }
                                  >
                                    #{tag}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </th>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && (
        <div className='text-center m-5'>
          <svg
            role='status'
            className='inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-slate-600'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
              fill='currentColor'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
              fill='currentFill'
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Upload;

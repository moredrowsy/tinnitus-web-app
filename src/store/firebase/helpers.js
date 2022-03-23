import { getStorage, getBlob, ref } from 'firebase/storage';
import { blobToDataURL } from '../../utils';

// Create a reference to the file we want to download
const storage = getStorage();

export function getStorageFile(storagePath) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, storagePath);

    // Download blob
    getBlob(storageRef)
      .then(async (blob) => {
        const dataURL = await blobToDataURL(blob);
        resolve(dataURL);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

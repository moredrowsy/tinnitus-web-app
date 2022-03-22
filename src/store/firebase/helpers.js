import { getStorage, getDownloadURL, getBlob, ref } from 'firebase/storage';

// Create a reference to the file we want to download
const storage = getStorage();

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (_e) => resolve(reader.result);
    reader.onerror = (_e) => reject(reader.error);
    reader.onabort = (_e) => reject(new Error('Read aborted'));
    reader.readAsDataURL(blob);
  });
}

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

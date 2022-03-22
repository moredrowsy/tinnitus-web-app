import audioMaker from 'audiomaker';

export function audioTrim(file, start, end) {
  return new Promise((resolve, reject) => {
    const _audioMaker = new audioMaker();
    _audioMaker
      .trim(file, start, end)
      .then((blob) => resolve(blob))
      .catch((err) => reject(err));
  });
}

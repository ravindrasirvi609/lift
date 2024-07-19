import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebase";

interface UseFirebaseStorageReturn {
  uploadFile: (file: File) => Promise<string>;
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
}

export const useFirebaseStorage = (): UseFirebaseStorageReturn => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, `abstracts/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      setUploadProgress(100);

      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      setError("Failed to upload file");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, uploadProgress, isUploading, error };
};

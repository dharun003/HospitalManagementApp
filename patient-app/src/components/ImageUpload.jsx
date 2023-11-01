// src/components/ImageUpload.js
// To do..If same image uploaded remove make it distinct.

import React, { useState } from 'react';
import { storage } from "../utils/firebase";
import { auth } from "../utils/firebase";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    listAll, // Import listAll
    deleteObject, // Import deleteObject
  } from 'firebase/storage';
import { useUserEmail } from './UserContext';


function ImageUpload({ onImagesUpdated ,guid }) {
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

    

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const userName = useUserEmail().userEmail;

  const buttonStyle = {
    backgroundColor: '#f2f2f2', // Button background color
    color: '#000', // Text color
    border: '1px solid #000', // Remove the default button border
    borderRadius: '4px', // Rounded corners
    padding: '4px 4px', // Padding for better readability
    fontSize: '10px', // Font size
    cursor: 'pointer', // Add a pointer cursor to indicate interactivity
    transition: 'background-color 0.3s ease'// Smooth color transition on hover
  };

  const handleDelete = (name) => {
    // Delete the image from Firebase Storage
    const storageRef = ref(storage, `Images_${userName}/${guid}/${name}`);
    deleteObject(storageRef)
      .then(() => {
        // Remove the deleted image from the list
        const updatedImages = images.filter((img) => img.name !== name);
        setImages(updatedImages);
        onImagesUpdated(updatedImages);
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };
//   const handleUpload = () => {
//     const storageRef = ref( storage , `Images/${image.name}`);
//     //const uploadTask = storage().ref(`Images/${image.name}`).put(image);
//     const uploadTask = uploadBytesResumable(storageRef , image);

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         // Progress tracking logic
//         const progress = Math.round(
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//         );
//         setProgress(progress);
//       },
//       (error) => {
//         // Handle error
//         console.error(error);
//       },
//       () => {
//         // Handle successful upload
//         // storage
//         //   .ref('images')
//         //   .child(image.name)
//         //   .getDownloadURL()
//         //   .then((url) => {
//         //     setUrl(url);
//         //   });
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setUrl(downloadURL));
//       }
//     );
//   };

const handleUpload = (image) => {
    if (image) {
      
      const storageRef = ref(storage, `Images_${userName}/${guid}/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      }, (error) => {
        console.error(error.message);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Do something image URL, e.g., save it to a database
          console.log('File available at:', downloadURL);
          setProgress(0); // Reset progress
          setImage(null); // Clear the selected image
          // Add the uploaded image to the list
          const newImages = [...images, { name: image.name, url: downloadURL, guid:guid}];
          setImages(newImages);
          onImagesUpdated(newImages);
        });
      });
    }
  };
  return (
    <div>
      
      <input type="file" onChange={handleChange} />
      {/* <button onClick={handleUpload}>Upload</button> */}
      <br />
      {progress > 0 && <progress value={progress} max="100" />}
      <br />
      <h8>Uploaded Images:</h8>
      <ul>
        {images.map((img) => (
          <li key={img.name}>
            <a href={img.url} target="_blank" rel="noopener noreferrer">
              {img.name}
            </a>
            <button 
            style={{ ...buttonStyle, marginLeft: '8px' }}
            onClick={() => handleDelete(img.name)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ImageUpload;

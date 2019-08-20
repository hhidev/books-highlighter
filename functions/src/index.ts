import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
import CloudVisionApi from './utils/cloud-vision-api';

export const detectText = functions.storage
  .object()
  .onFinalize(async object => {
    const db = admin.firestore();
    const bucketName = 'books-highlighter-f0af2.appspot.com';
    const filePath = object.name;
    const uid = object.metadata ? object.metadata.owner : '';
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filePath}?alt=media`;

    const result = await CloudVisionApi.execute(downloadUrl);
    if (result.isOK()) {
      db.collection('images')
        .add({
          filePath,
          downloadUrl: downloadUrl,
          text: result.data.responses[0].textAnnotations[0].description,
          uid: uid
        })
        .then(r => {
          console.log(r);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log(result);
    }
  });

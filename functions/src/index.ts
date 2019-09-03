import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
import CloudVisionApi from './utils/cloud-vision-api';
import * as cheerio from 'cheerio';
import * as rp from 'request-promise';

// storageに格納された画像をテキスト解析する
export const detectText = functions.storage
  .object()
  .onFinalize(async object => {
    const db = admin.firestore();
    const bucketName = 'books-highlighter-f0af2.appspot.com';
    const filePath = object.name;
    const uid = object.metadata ? object.metadata.owner : '';
    const bookId = object.metadata ? object.metadata.bookId : '';
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filePath}?alt=media`;

    const result = await CloudVisionApi.execute(downloadUrl);
    if (result.isOK()) {
      db.collection('images')
        .add({
          filePath: filePath,
          text: result.data.responses[0].textAnnotations[0].description,
          uid: uid,
          bookId
        })
        .then(r => {
          console.log(r);
          admin
            .storage()
            .bucket()
            .file(filePath!)
            .delete()
            .then(res => {
              console.log(res);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log(result);
    }
  });

const options = {
  transform: (body: any) => {
    return cheerio.load(body);
  }
};

// amazonリンクから書籍情報をスクレイピングする
export const scraping = functions.https.onCall(data => {
  return rp
    .get(data.targetUrl, options)
    .then($ => {
      let urls = [];
      let title = '';
      if ($('#ebooksImgBlkFront').attr('data-a-dynamic-image')) {
        urls = JSON.parse($('#ebooksImgBlkFront').attr('data-a-dynamic-image'));
        title = $('#ebooksProductTitle').text();
      } else if ($('#imgBlkFront').attr('data-a-dynamic-image')) {
        urls = JSON.parse($('#imgBlkFront').attr('data-a-dynamic-image'));
        title = $('#productTitle').text();
      }

      return {
        title: title ? title.replace(/\s+/g, '') : title,
        imageUrl: Object.keys(urls).length > 0 ? Object.keys(urls)[0] : '',
        author: $('.contributorNameID').text()
      };
    })
    .catch(error => {
      console.log(error);
    });
});

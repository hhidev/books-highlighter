import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
import CloudVisionApi from './utils/cloud-vision-api';
import * as puppeteer from 'puppeteer';

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

// amazonリンクから書籍情報をスクレイピングする
export const scraping = functions
  .runWith({
    timeoutSeconds: 200,
    memory: '1GB'
  })
  .https.onCall(async (data, context) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(data.targetUrl, { waitUntil: 'networkidle0' });
    const bookTitle = await (await page.$x(
      '//span[@id="ebooksProductTitle"]'
    ))[0];
    console.log(bookTitle);
    return bookTitle;
  });

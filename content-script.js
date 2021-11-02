// const findIndex = require('array.prototype.findindex')
// findIndex.shim()

const saveAs = require('file-saver');
const JSZip = require('jszip');



function formatFileName(submission, i){
    const {fullName, matrikelNr} = submission
    return  `${i}) ${fullName} ${matrikelNr}.pdf`
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        const {startMatrikelNr, endMatrikelNr, fileName} = request;


        const mopeds = moped(startMatrikelNr, endMatrikelNr)

        Promise.all(mopeds.map(async (el, i) => {
            const blob = await fetch(el.submissionLink).then(res => res.blob())
            const fileName = formatFileName(el, i+1)
            return {blob, fileName}
        })
        ).then(files => {
            let zip = new JSZip();


            console.log(files);
            for (let file of files){
                zip.file(file.fileName, file.blob)
                // saveAs(file.blob, file.fileName)
            }

            zip.generateAsync({type:"blob"}).then(function(content) {
                // see FileSaver.js
                saveAs(content, `${fileName}.zip`);
            });
        })


        // mopeds.forEach((el,i) => {
        //     fetch(el.submissionLink)
        //         .then(res => res.blob())
        //         .then(blob => saveBlob(blob, formatFileName(el, i+1)))
        //         .catch(err => {
        //             console.error(err)
        //         })
        // });

        sendResponse({ok: 'ok'})
    }
  );


function moped(startMatrikelNr, endMatrikelNr){

    const $tableRows = $('.generaltable > tbody > tr');

    let submissions = $tableRows.map(function(){

        return {
            email: $(this).find('.email').html(),
            fullName: $(this).find('.c2 > a').html(),
            matrikelNr: $(this).find('.idnumber').html(),
            submissionLink: $(this).find('.c10 a[target="_blank"]').attr('href')
            // Ja ich weiss, das ist der übelste Müll Selector aber was soll man machen wenn moodle nur so kack generierte classes verwendet
        }
    })

    // Array muss kopiert werden weil das von jquery's map zurückgegebene array kein findIndex hat
    submissions = [...submissions]

    const startIndex = submissions.findIndex(s => s.matrikelNr == startMatrikelNr)
    const endIndex = submissions.findIndex(s => s.matrikelNr == endMatrikelNr)

    submissions = submissions.slice(startIndex, endIndex +1)

    return submissions
}
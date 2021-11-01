// const findIndex = require('array.prototype.findindex')
// findIndex.shim()

function saveBlob(blob, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
};

function formatFileName(submission, i){
    const {fullName, matrikelNr} = submission
    return  `${i}) ${fullName} ${matrikelNr}.pdf`
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        const {startMatrikelNr, endMatrikelNr} = request;


        const mopeds = moped(startMatrikelNr, endMatrikelNr)

        mopeds.forEach((el,i) => {
            fetch(el.submissionLink)
                .then(res => res.blob())
                .then(blob => saveBlob(blob, formatFileName(el, i+1)))
        });

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
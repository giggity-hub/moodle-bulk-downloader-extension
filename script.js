


function setInputValFromStorage(){
    chrome.storage.local.get(['startMatrikelNr', 'endMatrikelNr'], function(result) {
        if (result.startMatrikelNr) {
            $('#start-matrikel-nr').val(result.startMatrikelNr)
        }
        if (result.endMatrikelNr){
            $('#end-matrikel-nr').val(result.endMatrikelNr)
        }
    });
    
}

$(document).ready(function(){
    
    setInputValFromStorage()

    

    $('.download').on('click', function(){

        const startMatrikelNr = $('#start-matrikel-nr').val()
        const endMatrikelNr = $('#end-matrikel-nr').val();
        const fileName = $('#file-name').val()

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const request = {
                startMatrikelNr,
                endMatrikelNr,
                fileName
            }

            chrome.tabs.sendMessage(tabs[0].id, request, function(response) {

            });
          });
    })

    $('input').on('input', function(){
        chrome.storage.local.set({'startMatrikelNr': $('#start-matrikel-nr').val()})
        chrome.storage.local.set({'endMatrikelNr': $('#end-matrikel-nr').val()})
    })

    $('.clear').on('click', function(){
        $('#start-matrikel-nr').val('')
        $('#end-matrikel-nr').val('')
        chrome.storage.local.set({'startMatrikelNr': ''})
        chrome.storage.local.set({'endMatrikelNr': ''})
    })

})


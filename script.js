


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

    

    $('.btn').on('click', function(){

        const startMatrikelNr = $('#start-matrikel-nr').val()
        const endMatrikelNr = $('#end-matrikel-nr').val();

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const request = {
                startMatrikelNr,
                endMatrikelNr
            }

            chrome.tabs.sendMessage(tabs[0].id, request, function(response) {

            });
          });
    })

    $('input').on('input', function(){
        chrome.storage.local.set({'startMatrikelNr': $('#start-matrikel-nr').val()})
        chrome.storage.local.set({'endMatrikelNr': $('#end-matrikel-nr').val()})
    })

})


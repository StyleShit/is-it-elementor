chrome.runtime.onMessage.addListener( ( message, sender, sendResponse ) => {

    switch ( message.action )
    {
        case 'fetchURL':
            fetch( message.URL ).then( res => res.text() ).then( HTML => {
                sendResponse( HTML );
            } );

            return true;

        default:
            break;
    }

} );
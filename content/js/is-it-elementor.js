class IsItElementor
{

    /**
     * Get the elements from the page using `this.selectors`.
     * 
     * @returns {object}
     */
    getDefaultElements()
    {
        if ( this.elements )
        {
            return this.elements;
        }

        this.elements = {};

        Object.entries( this.selectors ).forEach( ( [ key, selector ] ) => {
            this.elements[ key ] = __( selector );
        } );

        return this.elements;

    }

    /**
     * Extract the base URL (i.e https + domain) from a given URL.
     * 
     * @param {string} URL - The URL to extract from.
     * 
     * @returns {boolean}
     */
    extractBaseURL( URL )
    {
        const pattern = /(https?:\/\/[^\/]+)/ig;
        const matches = URL.match( pattern );

        return matches?.[ 0 ];
    }

    /**
     * Determine if a page is an Elementor page.
     * 
     * @param {string} HTML - The page markup to check.
     * 
     * @returns {boolean}
     */
    isElementor( HTML )
    {
        const pattern = /class=".+elementor-page.+"/i;

        return pattern.test( HTML );
    }

    /**
     * Add a loader to a search results link.
     * 
     * @param {HTMLElement} link - HTML link element to add the loader to.
     * 
     * @returns {void}
     */
    addLoader( link )
    {
        const loader = `<span class="${ this.classes.loader }"></span>`;

        link.insertAdjacentHTML( 'beforeend', loader );
    }

    /**
     * Remove a loader from a search results link.
     * 
     * @param {HTMLElement} link - HTML link element to remove the loader from.
     * 
     * @returns {void}
     */
    removeLoader( link )
    {
        const loader = link.querySelector( `.${ this.classes.loader }` );

        if ( loader )
        {
            loader.remove();
        }
    }

     /**
     * Add a badge to a search results link.
     * 
     * @param {HTMLElement} link - HTML link element to add the badge to.
     * @param {boolean} isElementor - Whether the badge should be V or X.
     * 
     * @returns {void}
     */
    addBadge( link, isElementor = true )
    {
        const badge = `<span class="${ isElementor ? this.classes.badgeV : this.classes.badgeX }"></span>`;

        link.insertAdjacentHTML( 'beforeend', badge );
    }

    /**
     * Remove a badge from a search results link.
     * 
     * @param {HTMLElement} link - HTML link element to remove the badge from.
     * 
     * @returns {void}
     */
    removeBadge( link )
    {
        const badge = link.querySelector( `.${ this.classes.badgeV }, .${ this.classes.badgeX }` );

        if ( badge )
        {
            badge.remove();
        }
    }

    /**
     * Check a list of links for being an Elementor page, and add badges accordingly.
     * 
     * @param {HTMLElement[]} links - Array of link elements to check.
     * 
     * @returns {void}
     */
    checkLinks( links )
    {
        links.forEach( ( link ) => {
            const URL = this.extractBaseURL( link.href );

            if ( URL )
            {
                this.removeBadge( link );
                this.addLoader( link );

                chrome.runtime.sendMessage( { action: 'fetchURL', URL }, ( HTML ) => {
                    this.removeLoader( link );
                    this.addBadge( link, this.isElementor( HTML ) );
                } );
            }
        } );
    }

    /**
     * Initialize the IsItElementor class.
     * 
     * @returns {void}
     */
    constructor()
    {
        this.classes = {
            loader: 'is-it-elementor--loader',
            badgeV: 'is-it-elementor--badge-v',
            badgeX: 'is-it-elementor--badge-x',
        };
    
        this.selectors = {
            googleSearchLinks: '#search a[data-ved]:not( [class] )',
        };

        const { googleSearchLinks } = this.getDefaultElements();
        this.checkLinks( googleSearchLinks );
    }

}

new IsItElementor();
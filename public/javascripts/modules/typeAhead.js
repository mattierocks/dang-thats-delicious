const axios = require('axios');

function searchResultsHTML(stores) {
    return stores.map(store => {
        return `
            <a href="/store/${store.slug}" class="search__result">
                <strong>${store.name}</strong>
            </a>
        `;
    }).join('')
}

function typeAhead(search) {
    if (!search) return;

    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results');

    searchInput.on('input', function() {
        // If there is no value, quit it!
        if (!this.value) {
            searchResults.style.display = 'none';
            return; //stop
        }

        // show the search results
        searchResults.style.display = 'block';
        searchResults.innerHTML = '';

        axios
            .get(`/api/search?q=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    searchResults.innerHTML = searchResultsHTML(res.data);
                }
            })
            .catch(err => {
                console.error(err);
            });
    });

    // Handle keybaord inputs
    searchInput.on('keyup', (e) => {
        // if they aren't pressing up, down or enter, who cares!
        if (![38, 40, 13].includes(e.keycode)) {
            return;
        }
        const activeClass = 'search__result--active';
        const current = search.querySelector(`.${activeClass}`);
        const items = search.querySelectorAll('.search__result');
        let next;
        if (e.keycode === 40 && current) {
            next = current.nextElementSibling || items[0];
        } else if (e.keycode === 40) {
            next = items[0];
        } else if (e.keycode === 38 && current) {
            next = current.previousElementSibling || items[items.length - 1]
        } else if (e.keycode === 38) {
            next = items[items.length - 1]
        } else if (e.keycode === 13 && current.href) {
            window.location = current.href;
        }
    });
}

export default typeAhead;
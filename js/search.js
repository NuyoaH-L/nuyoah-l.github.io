(function() {
let searchData;

function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
}

function qsa(sel, ctx) {
    return (ctx || document).querySelectorAll(sel);
}

function eachBody(fn) {
    qsa('.search-body').forEach(fn);
}

function updateStats(count) {
    const stats = qs('.search-stats');
    if (!stats) return;
    if (count > 0) {
        stats.textContent = count + ' 条结果';
        stats.style.opacity = '1';
    } else {
        stats.textContent = '';
        stats.style.opacity = '0';
    }
}

function showEmpty(show) {
    const empty = qs('.search-empty');
    if (!empty) return;
    empty.classList.toggle('show', show);
}

function loadData(arg) {
    if(!arg || arg.length == 0 || !arg[0]) {
        eachBody(body => {
            body.innerHTML = '';
            body.classList.remove('show');
        });
        showEmpty(false);
        updateStats(0);
        return;
    }
    eachBody(body => body.classList.add('show'));
    if (!searchData) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/content.json', true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                const res = JSON.parse(this.response || this.responseText);
                searchData = res instanceof Array ? res : res.posts;
                searchkey(arg);
            } else {
                console.error(statusText);
            }
        };
        xhr.onerror = function () {
            console.error(statusText);
        };
        xhr.send();
    } else {
        searchkey(arg);
    }
}

function searchkey(keywords) {
    let count = 0;
    searchData.forEach(post => {
        const rend = {};
        for (const word of keywords) {
            const reg = new RegExp(word, 'gi');
            const titleMatch = post.title.match(reg);
            if (titleMatch) {
                rend.title = post.title.replace(reg, `<span class="keyword">${word}</span>`);
            }
            const contentMatch = post.text.match(reg);
            if (contentMatch) {
                const idx = post.text.search(reg);
                const start = Math.max(0, idx - 20);
                rend.text = `…${post.text.substring(start, start + 60)}…`;
                rend.text = rend.text.replace(reg, `<span class="keyword">${word}</span>`);
            }
            if (titleMatch || contentMatch) {
                rend.title = rend.title || post.title;
                rend.text = rend.text || post.text;
                rend.href = post.path;
                render(rend);
                count++;
                break;
            }
        }
    });
    updateStats(count);
    showEmpty(count === 0);
    if (count === 0) {
        eachBody(body => body.classList.remove('show'));
    }
}

function render(data) {
    const ele = document.createElement('div');
    ele.className = 'search-result';
    ele.innerHTML = `<a href="${data.href}"><div class="search-result-title">${data.title}</div>
    <div class="search-result-text">${data.text}</div></a>`;
    eachBody(body => body.appendChild(ele.cloneNode(true)));
}

function sclose() {
    const space = document.getElementById('nexmoe-search-space');
    if (space) space.style.display = 'none';
}

function sinput(el) {
    eachBody(body => {
        body.innerHTML = '';
        body.classList.remove('show');
    });
    showEmpty(false);
    updateStats(0);
    const input = el || document.getElementsByClassName('search-input')[0];
    const val = input.value;
    if (val.trim()) {
        loadData(format(val));
    }
}

function format(word) {
    return word.trim().split(/\s+/);
}

window.sclose = sclose;
window.sinput = sinput;
window.loadData = loadData;
window.format = format;
})();

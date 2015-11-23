'use strict';

import tata from './tata';

document.addEventListener('click', function () {
    let list = tata();

    list.forEach(el => alert(el));
});

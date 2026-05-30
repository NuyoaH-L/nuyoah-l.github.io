window.addEventListener('load', () => {
    const codeBlocks = document.querySelectorAll('figure.highlight');
    if (!codeBlocks.length) return;

    const addCopyButton = codeBlock => {
        const copyWrapper = document.createElement('div');
        copyWrapper.setAttribute('class', 'codeblock-copy-wrapper');

        let copiedTimeout = null;

        copyWrapper.addEventListener('click', ev => {
            const highlightDom = ev.target.parentElement;
            const code = highlightDom.querySelector('code');

            navigator.clipboard.writeText(code.textContent).then(() => {
                if (copiedTimeout) clearTimeout(copiedTimeout);

                copyWrapper.classList.add('codeblock-copy-wrapper-copied');
                copiedTimeout = setTimeout(() => {
                    copyWrapper.classList.remove('codeblock-copy-wrapper-copied');
                    copiedTimeout = null;
                }, 1500);
            });
        }, { passive: true });
        codeBlock.appendChild(copyWrapper);
    };

    codeBlocks.forEach(addCopyButton);
}, { passive: true });

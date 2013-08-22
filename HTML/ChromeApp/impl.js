function clipboardWrite() {
    if (document.execCommand('copy')) {
        setAccountPassword('... has been copied to your clipboard');
    }
}

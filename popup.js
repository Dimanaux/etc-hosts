const hostsInput = document.getElementById('hosts-input');
const applyButton = document.getElementById('apply-button');

hostsInput.value = getRawHosts();

applyButton.onclick = function (_) {
    let rawHosts = hostsInput.value;
    saveRawHosts(rawHosts);
    saveHosts(parseHosts(rawHosts));
};

function parseHosts(hostsString) {
    let hosts = {};
    let hostsLines = hostsString.split('\n');
    for (let line of hostsLines) {
        let host = parseHost(line);
        Object.assign(hosts, host);
    }
    return hosts;
}

function parseHost(line) {
    line = line.trim();
    if (line.startsWith('#') || line === '') {
        return {};
    }
    let [ip, domain] = line.split(/\s+/);
    return { [domain]: ip };
}

function saveHosts(hosts) {
    localStorage.hosts = JSON.stringify(hosts);
}

function saveRawHosts(hosts) {
    localStorage.rawHosts = hosts;
}

function getRawHosts() {
    return localStorage.rawHosts || '';
}

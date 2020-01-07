chrome.runtime.onInstalled.addListener(function () {
    chrome.webRequest.onBeforeRequest.addListener(
        applyHosts,
        { urls: ["http://*/*", "https://*/*"] },
        ["blocking"]
    );

    chrome.declarativeContent.onPageChanged.removeRules(
        undefined,
        function () {
            chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { ports: [80, 443] }
                    })
                ],
                actions: [
                    new chrome.declarativeContent.ShowPageAction()
                ]
            }]);
        }
    );
});

function applyHosts(requestDetails) {
    let [schema, domain, path] = schemaDomainAndPath(requestDetails.url);
    let newDomain = resolve(getHosts(), domain);
    return { redirectUrl: `${schema}://${newDomain}/${path}` };
}

function resolve(hosts, domain) {
    for (const key in hosts) {
        const ip = hosts[key];
        if (domain.endsWith(key)) {
            return ip;
        }
    }
    return domain;
}

function schemaDomainAndPath(url) {
    let [schema, resource] = url.split("://");
    let [domain, ...path] = resource.split("/");
    return [schema, domain, path.join("/")];
}

function getHosts() {
    try {
        return JSON.parse(localStorage.hosts);
    } catch (error) {
        return {};
    }
}

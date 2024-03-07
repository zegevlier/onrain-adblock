function listener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    let data = "";

    filter.ondata = event => {
        let str = decoder.decode(event.data, { stream: true });
        data += str;
    }

    filter.onstop = (event) => {
        let json_data = JSON.parse(data);
        json_data.entries = json_data.entries.filter(entry => entry.type !== "ADVERTISEMENT");
        let new_str = JSON.stringify(json_data);
        filter.write(encoder.encode(new_str));
        filter.disconnect();
    };

    return {};
}

console.log("Background script running");

browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ["https://social.schoolrp.net/api/feeds/primary", "https://social.schoolrp.net/api/feeds/primary?reset_cursor=true", "https://social.schoolrp.net/api/feeds/latest", "https://social.schoolrp.net/api/feeds/latest?reset_cursor=true"], types: ["xmlhttprequest"] },
    ["blocking"]
);
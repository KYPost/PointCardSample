//#region - PARAMETER -
// 根據 UserDataHandler 設定
var cookieKey = "UserData";
var DayToLive = 0.5;

var collectionKey = "collection";
var collectionValue = ["a", "b", "c", "d", "e"];

var prizeKey = "prize";
var prizeValue = ["normal"];

// 集章網址
// var WebsiteURL = "";
//#endregion

//#region - USER DATA -
// 根據 UserDataHandler 設定
var UserStatus = {
    FirstVisit: 0, //首次進入
    Collect: 1, // 集章
    Feedback: 2,// 回饋
    Exchange: 3 // 兌換
}
var UserData = {
    status: UserStatus.FirstVisit,
    collections: new Array(collectionValue.length).fill(false),
    newCollectIndex: -1,
    prizes: new Array(prizeValue.length).fill(false),
    newExchangeIndex: -1,
}
//#endregion

// 獲取Cookie
var data = GetCookie(cookieKey);
console.log("data => " + DataToString(data));

// 更新集章資料
var collectionParameter = GetURLParameter(collectionKey);
for (var i = 0; i < collectionValue.length; i++) {
    if (collectionParameter == collectionValue[i]) {
        if (!data.collections[i]) {
            data.newCollectIndex = i;
        }
        break;
    }
}

// 如果使用者狀態為兌換，更新兌換資料
if (data.status == UserStatus.Exchange) {
    var prizeParameter = GetURLParameter(prizeKey);
    for (var i = 0; i < prizeValue.length; i++) {
        if (prizeParameter == prizeValue[i]) {
            if (!data.prizes[i]) {
                data.newExchangeIndex = i;
            }            
            break;
        }
    }
}
console.log("updated data => " + DataToString(data));

// 寫入Cookie
var dataString = JSON.stringify(data);
console.log("updated cookie => " + dataString);
SetCookie(cookieKey, dataString);

// 前往活動網頁
window.location.replace("/");


//#region - 獲取COOKIE -
function GetCookie(key) {
    var data = JSON.parse(JSON.stringify(UserData)); // clone 預設值

    var cookies = document.cookie.split('; ');
    for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split("=");
        var name = parts.shift();
        if (name == key) {
            try {
                var cookieData = JSON.parse(decodeURIComponent(parts.join("=")));

                // 檢查是否過期
                if (cookieData.expireAt && Date.now() > cookieData.expireAt) {
                    console.warn("Cookie expired, clearing:", key);
                    document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    return data; // 回傳預設
                }

                data.status = cookieData.status;
                data.collections = cookieData.collections;
                data.prizes = cookieData.prizes;
            } catch (e) {
                console.error("Cookie parse error:", e);
            }
        }
    }
    return data;
}
//#endregion

//#region - 獲取網址參數 - 
function GetURLParameter(key) {
    var url = document.URL;
    var index = url.indexOf("?");
    if (index != -1) {
        var parameters = url.split("?")[1].split("&");
        for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i].split("=");
            if (parameter[0] == key) {
                return parameter[1];
            }
        }
    }
    return null;
}
//#endregion

//#region - 寫入COOKIE - 
function SetCookie(key, value) {
    try {
        var obj = JSON.parse(value);
        obj.expireAt = Date.now() + (dayToLive * 24 * 60 * 60 * 1000); // 加過期時間戳記
        var newValue = JSON.stringify(obj);

        var safeValue = encodeURIComponent(newValue); 
        var cookie = key + "=" + safeValue;

        var date = new Date();
        date.setTime(date.getTime() + (dayToLive * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();

        document.cookie = cookie + "; " + expires + "; path=/";
        console.log("Set Cookie Finish!! => " + cookie);
    } catch(e) {
        console.error("SetCookie Failed:", e);
    }
}
//#endregion

//#region - DEBUG -
function DataToString(data)
{
    var str ="{\n"+
            "status: " + data.status + "\n" +
            "collection: " + data.collections + "\n" +
            "newCollectIndex: " + data.newCollectIndex + "\n" +
            "prize: " + data.prizes + "\n" +
            "newExchangeIndex: " + data.newExchangeIndex + "\n"+
            "}";
    return str;
}
//#endregion

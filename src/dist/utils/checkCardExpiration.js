export default function isCardExpired(date) {
    var month = parseInt(date.split("/")[0]);
    var year = parseInt(date.split("/")[1]) + 2000;
    var expirationDate = new Date(year, month);
    var now = new Date();
    if (now >= expirationDate)
        return true;
    return false;
}

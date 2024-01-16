module.exports = async ({UserManager, getStatic, res, username}) => {
    if (await UserManager.isBanned(username)) {
        res.sendFile(getStatic('docs/bannedloser.html'));
        return true;
    }
    return false;
}
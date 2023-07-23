import JumperExchange from '../providers/jumper.provider';
var MERCHANT;
(function (MERCHANT) {
    MERCHANT["JUMPER"] = "jumper-exchange";
})(MERCHANT || (MERCHANT = {}));
;
var ERROR;
(function (ERROR) {
    ERROR["INVALID_MERCHANT"] = "INVALID_MERCHANT";
})(ERROR || (ERROR = {}));
export const getMerchantForSwapTransaction = (key) => {
    switch (key) {
        case MERCHANT.JUMPER:
            return JumperExchange;
        default:
            return ERROR.INVALID_MERCHANT;
    }
};

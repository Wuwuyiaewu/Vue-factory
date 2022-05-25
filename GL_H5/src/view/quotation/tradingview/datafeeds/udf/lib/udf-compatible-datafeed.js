import { __extends } from 'tslib'
import { UDFCompatibleDatafeedBase } from './udf-compatible-datafeed-base'
import { QuotesProvider } from './quotes-provider'
import { Requester } from './requester'
var UDFCompatibleDatafeed = /** @class */ (function (_super) {
    __extends(UDFCompatibleDatafeed, _super)
    function UDFCompatibleDatafeed (datafeedURL, { store, vm } = {}, updateFrequency) {
        if (updateFrequency === void 0) {
            updateFrequency = 10 * 1000
        }
        var _this = this
        var requester = new Requester()
        var quotesProvider = new QuotesProvider(datafeedURL, requester)
        _this = _super.call(this, datafeedURL, quotesProvider, requester, updateFrequency, store, vm) || this
        return _this
    }
    return UDFCompatibleDatafeed
})(UDFCompatibleDatafeedBase)
export { UDFCompatibleDatafeed }
